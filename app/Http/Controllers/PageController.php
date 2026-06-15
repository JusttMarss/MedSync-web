<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\TimeSlot;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class PageController extends Controller
{
    /**
     * Homepage — tampilkan statistik umum.
     */
    public function home()
    {
        $todaySlots = TimeSlot::with('doctor.user')
            ->whereDate('date', today())
            ->where('is_booked', false)
            ->orderBy('start_time')
            ->limit(8)
            ->get()
            ->map(fn($slot) => [
                'id'             => $slot->id,
                'doctorName'     => $slot->doctor?->user?->name,
                'specialization' => $slot->doctor?->specialization,
                'startTime'      => \Carbon\Carbon::parse($slot->start_time)->format('H:i'),
                'endTime'        => \Carbon\Carbon::parse($slot->end_time)->format('H:i'),
            ]);

        return Inertia::render('Home', [
            'stats' => [
                'doctors'      => Doctor::whereHas('user', fn($q) => $q->where('is_active', true))->count(),
                'patients'     => Patient::count(),
                'appointments' => Appointment::count(),
            ],
            'featuredDoctors' => Doctor::with('user')
                ->whereHas('user', fn($q) => $q->where('is_active', true))
                ->latest()
                ->take(3)
                ->get()
                ->map(fn($d) => [
                    'id'             => $d->id,
                    'name'           => $d->user?->name,
                    'specialization' => $d->specialization,
                    'bio'            => $d->bio,
                ]),
            'todaySlots' => $todaySlots,
        ]);
    }

    /**
     * Doctor List — tampilkan semua dokter aktif dengan search & filter.
     */
    public function doctors(Request $request)
    {
        $query = Doctor::with('user')
            ->whereHas('user', fn($q) => $q->where('is_active', true));

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%"))
                  ->orWhere('specialization', 'like', "%{$search}%");
            });
        }

        if ($request->filled('specialization')) {
            $query->where('specialization', $request->specialization);
        }

        $doctors = $query->orderBy('created_at', 'desc')->get()->map(fn($d) => [
            'id'             => $d->id,
            'name'           => $d->user?->name,
            'email'          => $d->user?->email,
            'specialization' => $d->specialization,
            'phone'          => $d->phone,
            'bio'            => $d->bio,
        ]);

        $specializations = Doctor::whereHas('user', fn($q) => $q->where('is_active', true))
            ->distinct()
            ->pluck('specialization')
            ->filter()
            ->values();

        return Inertia::render('Doctors', [
            'doctors'         => $doctors,
            'specializations' => $specializations,
            'filters'         => $request->only(['search', 'specialization']),
        ]);
    }

    /**
     * Appointments page — daftar appointment dan form pemesanan sederhana.
     */
    public function appointments(Request $request)
    {
        $user = $request->user();
        $patient = $user?->patient;

        if (!$patient) {
            return Redirect::route('dashboard')->with('error', 'Akun Anda belum terhubung ke profil pasien.');
        }

        $appointments = Appointment::with(['doctor.user', 'timeSlot', 'medicalRecord'])
            ->where('patient_id', $patient->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($a) => [
                'id'             => $a->id,
                'doctor'         => $a->doctor?->user?->name,
                'specialization' => $a->doctor?->specialization,
                'date'           => $a->timeSlot?->date,
                'time'           => $a->timeSlot?->start_time . ' - ' . $a->timeSlot?->end_time,
                'status'         => $a->status instanceof \App\Enums\AppointmentStatusEnum ? $a->status->value : $a->status,
                'notes'          => $a->notes,
                'medical_record' => $a->medicalRecord ? [
                    'id' => $a->medicalRecord->id,
                    'diagnosis' => $a->medicalRecord->diagnosis,
                    'treatment' => $a->medicalRecord->treatment,
                    'medications' => $this->formatMedications($a->medicalRecord->medications),
                    'notes' => $a->medicalRecord->notes,
                ] : null,
            ]);

        $doctors = Doctor::with('user')
            ->whereHas('user', fn($q) => $q->where('is_active', true))
            ->get()
            ->map(fn($d) => [
                'id'   => $d->id,
                'name' => $d->user?->name,
                'specialization' => $d->specialization,
            ]);

        $timeSlots = TimeSlot::with('doctor')
            ->where('is_booked', false)
            ->orderBy('date')
            ->get()
            ->map(fn($t) => [
                'id'          => $t->id,
                'doctor_id'   => $t->doctor_id,
                'doctor_name' => $t->doctor?->user?->name,
                'date'        => $t->date,
                'start_time'  => $t->start_time,
                'end_time'    => $t->end_time,
            ]);

        return Inertia::render('Appointments', [
            'appointments' => $appointments,
            'doctors'      => $doctors,
            'timeSlots'    => $timeSlots,
        ]);
    }

    /**
     * Schedule page — show timeslots grouped by doctor.
     */
    public function schedule()
    {
        $doctors = Doctor::with(['timeSlots' => fn($q) => $q->orderBy('date')])->get()
            ->map(fn($d) => [
                'id'        => $d->id,
                'name'      => $d->user?->name,
                'timeSlots' => $d->timeSlots->map(fn($t) => [
                    'id'         => $t->id,
                    'date'       => $t->date,
                    'start_time' => $t->start_time,
                    'end_time'   => $t->end_time,
                    'is_booked'  => (bool) $t->is_booked,
                ]),
            ]);

        return Inertia::render('Schedule', [
            'doctors' => $doctors,
        ]);
    }

    /**
     * Profile page — tampilkan data user/patient sederhana.
     */
    public function profile(Request $request)
    {
        $user = $request->user();
        $patient = null;
        if ($user) {
            $patient = Patient::where('user_id', $user->id)->first();
        }

        return Inertia::render('Profile', [
            'user'    => $user,
            'patient' => $patient,
        ]);
    }

    /**
     * Update profile — simpan data user + patient.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:users,email,' . $user->id,
            'date_of_birth' => 'nullable|date',
            'gender'        => 'nullable|in:Laki-laki,Perempuan',
            'phone'         => 'nullable|string|max:25',
            'address'       => 'nullable|string|max:500',
        ]);

        // Update user
        $user->name  = $data['name'];
        $user->email = $data['email'];
        $user->save();

        // Upsert patient profile
        Patient::updateOrCreate(
            ['user_id' => $user->id],
            [
                'date_of_birth' => $data['date_of_birth'] ?? null,
                'gender'        => $data['gender'] ?? null,
                'phone'         => $data['phone'] ?? null,
                'address'       => $data['address'] ?? null,
            ]
        );

        return Redirect::back()->with('success', 'Profil berhasil diperbarui!');
    }


    /**
     * Dashboard page — route berdasarkan role user.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $role = $user->role?->value ?? $user->role;

        if ($role === 'admin') {
            return $this->adminDashboard($user);
        }

        if ($role === 'doctor') {
            return $this->doctorDashboard($user);
        }

        return $this->patientDashboard($user);
    }

    /**
     * Admin Dashboard — overview seluruh sistem.
     */
    private function adminDashboard($user)
    {
        $totalDoctors = Doctor::count();
        $totalPatients = Patient::count();
        $totalAppointments = Appointment::count();
        $pendingAppointments = Appointment::whereIn('status', ['pending', 'scheduled'])->count();
        $completedAppointments = Appointment::where('status', 'completed')->count();
        $cancelledAppointments = Appointment::where('status', 'cancelled')->count();

        $recentAppointments = Appointment::with(['doctor.user', 'patient.user', 'timeSlot'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(fn($a) => [
                'id'             => $a->id,
                'patient'        => $a->patient?->user?->name,
                'doctor'         => $a->doctor?->user?->name,
                'specialization' => $a->doctor?->specialization,
                'date'           => $a->timeSlot?->date,
                'time'           => $a->timeSlot?->start_time . ' - ' . $a->timeSlot?->end_time,
                'status'         => $a->status?->value ?? $a->status,
                'notes'          => $a->notes,
                'created_at'     => $a->created_at?->format('d M Y'),
            ]);

        $recentPatients = Patient::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($p) => [
                'id'     => $p->id,
                'name'   => $p->user?->name,
                'email'  => $p->user?->email,
                'phone'  => $p->phone,
                'gender' => $p->gender?->value ?? $p->gender,
                'joined' => $p->created_at?->format('d M Y'),
            ]);

        // Get full lists for CRUD
        $allDoctors = Doctor::with('user')
            ->get()
            ->map(fn($d) => [
                'id'             => $d->id,
                'name'           => $d->user?->name,
                'email'          => $d->user?->email,
                'specialization' => $d->specialization,
                'phone'          => $d->phone,
                'bio'            => $d->bio,
                'is_active'      => $d->user?->is_active ?? true,
            ]);

        $allPatients = Patient::with('user')
            ->get()
            ->map(fn($p) => [
                'id'            => $p->id,
                'name'          => $p->user?->name,
                'email'         => $p->user?->email,
                'date_of_birth' => $p->date_of_birth,
                'gender'        => $p->gender?->value ?? $p->gender,
                'address'       => $p->address,
                'phone'         => $p->phone,
            ]);

        $allAppointments = Appointment::with(['doctor.user', 'patient.user', 'timeSlot'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($a) => [
                'id'             => $a->id,
                'patient'        => $a->patient?->user?->name,
                'doctor'         => $a->doctor?->user?->name,
                'specialization' => $a->doctor?->specialization,
                'date'           => $a->timeSlot?->date,
                'time'           => $a->timeSlot?->start_time . ' - ' . $a->timeSlot?->end_time,
                'status'         => $a->status?->value ?? $a->status,
                'notes'          => $a->notes,
                'created_at'     => $a->created_at?->format('d M Y'),
            ]);

        $allTimeSlots = TimeSlot::with('doctor.user')
            ->orderBy('date', 'desc')
            ->orderBy('start_time', 'desc')
            ->get()
            ->map(fn($t) => [
                'id'          => $t->id,
                'doctor_id'   => $t->doctor_id,
                'doctor_name' => $t->doctor?->user?->name,
                'date'        => $t->date,
                'start_time'  => $t->start_time,
                'end_time'    => $t->end_time,
                'is_booked'   => (bool)$t->is_booked,
            ]);

        return Inertia::render('AdminDashboard', [
            'userName' => $user->name,
            'stats' => [
                'doctors'      => $totalDoctors,
                'patients'     => $totalPatients,
                'appointments' => $totalAppointments,
                'pending'      => $pendingAppointments,
                'completed'    => $completedAppointments,
                'cancelled'    => $cancelledAppointments,
            ],
            'recentAppointments' => $recentAppointments,
            'recentPatients'     => $recentPatients,
            'allDoctors'         => $allDoctors,
            'allPatients'        => $allPatients,
            'allAppointments'    => $allAppointments,
            'allTimeSlots'       => $allTimeSlots,
        ]);
    }

    /**
     * Doctor Dashboard — overview jadwal dan pasien dokter.
     */
    private function doctorDashboard($user)
    {
        $doctor = $user->doctor;

        if (!$doctor) {
            return Inertia::render('DoctorDashboard', [
                'userName' => $user->name,
                'stats' => [
                    'todayPatients'    => 0,
                    'upcomingTotal'    => 0,
                    'completedWeek'   => 0,
                    'availableSlots'   => 0,
                ],
                'todaySchedule'       => [],
                'upcomingAppointments' => [],
            ]);
        }

        $today = now()->toDateString();
        $startOfWeek = now()->startOfWeek()->toDateString();
        $endOfWeek = now()->endOfWeek()->toDateString();

        // Today's patients
        $todayAppointments = Appointment::with(['patient.user', 'timeSlot'])
            ->where('doctor_id', $doctor->id)
            ->whereHas('timeSlot', fn($q) => $q->whereDate('date', $today))
            ->orderBy('time_slot_id')
            ->get();

        $todayPatients = $todayAppointments->count();

        // Upcoming appointments (scheduled, future dates)
        $upcomingAppointments = Appointment::with(['patient.user', 'timeSlot'])
            ->where('doctor_id', $doctor->id)
            ->whereIn('status', ['pending', 'confirmed', 'scheduled'])
            ->whereHas('timeSlot', fn($q) => $q->whereDate('date', '>=', $today))
            ->orderBy('time_slot_id')
            ->limit(8)
            ->get();

        $upcomingTotal = Appointment::where('doctor_id', $doctor->id)
            ->whereIn('status', ['pending', 'confirmed', 'scheduled'])
            ->whereHas('timeSlot', fn($q) => $q->whereDate('date', '>=', $today))
            ->count();

        // Completed this week
        $completedWeek = Appointment::where('doctor_id', $doctor->id)
            ->where('status', 'completed')
            ->whereHas('timeSlot', fn($q) => $q->whereBetween('date', [$startOfWeek, $endOfWeek]))
            ->count();

        // Available slots
        $availableSlots = TimeSlot::where('doctor_id', $doctor->id)
            ->where('is_booked', false)
            ->whereDate('date', '>=', $today)
            ->count();

        $myTimeSlots = TimeSlot::where('doctor_id', $doctor->id)
            ->orderBy('date', 'desc')
            ->orderBy('start_time', 'desc')
            ->get()
            ->map(fn($t) => [
                'id'          => $t->id,
                'date'        => $t->date,
                'start_time'  => $t->start_time,
                'end_time'    => $t->end_time,
                'is_booked'   => (bool)$t->is_booked,
            ]);

        return Inertia::render('DoctorDashboard', [
            'userName' => $user->name,
            'stats' => [
                'todayPatients'  => $todayPatients,
                'upcomingTotal'  => $upcomingTotal,
                'completedWeek'  => $completedWeek,
                'availableSlots' => $availableSlots,
            ],
            'todaySchedule' => $todayAppointments->map(fn($a) => [
                'id'      => $a->id,
                'patient' => $a->patient?->user?->name,
                'time'    => $a->timeSlot?->start_time . ' - ' . $a->timeSlot?->end_time,
                'status'  => $a->status instanceof \App\Enums\AppointmentStatusEnum ? $a->status->value : $a->status,
                'notes'   => $a->notes,
            ]),
            'upcomingAppointments' => $upcomingAppointments->map(fn($a) => [
                'id'      => $a->id,
                'patient' => $a->patient?->user?->name,
                'date'    => $a->timeSlot?->date,
                'time'    => $a->timeSlot?->start_time . ' - ' . $a->timeSlot?->end_time,
                'status'  => $a->status instanceof \App\Enums\AppointmentStatusEnum ? $a->status->value : $a->status,
                'notes'   => $a->notes,
            ]),
            'myTimeSlots' => $myTimeSlots,
        ]);
    }

    /**
     * Patient Dashboard — overview jadwal kesehatan pasien.
     */
    private function patientDashboard($user)
    {
        $patient = $user?->patient;

        $upcoming = null;
        if ($patient) {
            $upcomingAppointment = Appointment::with(['doctor.user', 'timeSlot'])
                ->where('patient_id', $patient->id)
                ->whereIn('status', ['pending', 'confirmed', 'scheduled'])
                ->orderBy('time_slot_id')
                ->first();

            if ($upcomingAppointment) {
                $upcoming = [
                    'id'             => $upcomingAppointment->id,
                    'doctor'         => $upcomingAppointment->doctor?->user?->name,
                    'specialization' => $upcomingAppointment->doctor?->specialization,
                    'date'           => $upcomingAppointment->timeSlot?->date,
                    'time'           => $upcomingAppointment->timeSlot?->start_time . ' - ' . $upcomingAppointment->timeSlot?->end_time,
                    'status'         => $upcomingAppointment->status?->value ?? $upcomingAppointment->status,
                ];
            }
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'doctors'      => Doctor::whereHas('user', fn($q) => $q->where('is_active', true))->count(),
                'patients'     => Patient::count(),
                'appointments' => Appointment::count(),
            ],
            'upcoming' => $upcoming,
            'userName' => $user->name,
        ]);
    }

    /**
     * Medical Records page — view patient medical history depending on role.
     */
    public function medicalRecords(Request $request)
    {
        $user = $request->user();
        $role = $user->role?->value ?? $user->role;

        $query = MedicalRecord::with(['patient.user', 'doctor.user', 'appointment.timeSlot']);

        if ($role === 'patient') {
            $patient = $user->patient;
            if (!$patient) {
                return Redirect::back()->with('error', 'Profil pasien tidak ditemukan.');
            }
            $query->where('patient_id', $patient->id);
        }

        $records = $query->orderBy('created_at', 'desc')->get()->map(fn($r) => [
            'id' => $r->id,
            'appointment_id' => $r->appointment_id,
            'patient_id' => $r->patient_id,
            'patient_name' => $r->patient?->user?->name,
            'patient_dob' => $r->patient?->date_of_birth,
            'patient_gender' => $r->patient?->gender?->value ?? $r->patient?->gender,
            'doctor_id' => $r->doctor_id,
            'doctor_name' => $r->doctor?->user?->name,
            'doctor_specialization' => $r->doctor?->specialization,
            'date' => $r->appointment?->timeSlot?->date ?? $r->created_at->toDateString(),
            'time' => $r->appointment?->timeSlot?->start_time && $r->appointment?->timeSlot?->end_time 
                ? $r->appointment->timeSlot->start_time . ' - ' . $r->appointment->timeSlot->end_time 
                : $r->created_at->format('H:i'),
            'diagnosis' => $r->diagnosis,
            'treatment' => $r->treatment,
            'medications' => $this->formatMedications($r->medications),
            'notes' => $r->notes,
        ]);

        return Inertia::render('MedicalRecords', [
            'records' => $records,
            'userName' => $user->name,
            'userRole' => $role,
        ]);
    }

    private function formatMedications($medications): array
    {
        $meds = [];
        if (is_array($medications)) {
            foreach ($medications as $med) {
                if (is_array($med)) {
                    $name = $med['name'] ?? '';
                    $dosage = $med['dosage'] ?? '';
                    $meds[] = $dosage ? "$name ($dosage)" : $name;
                } elseif (is_object($med)) {
                    $name = $med->name ?? '';
                    $dosage = $med->dosage ?? '';
                    $meds[] = $dosage ? "$name ($dosage)" : $name;
                } else {
                    $meds[] = (string)$med;
                }
            }
        } elseif ($medications) {
            $meds[] = (string)$medications;
        }
        return $meds;
    }
}