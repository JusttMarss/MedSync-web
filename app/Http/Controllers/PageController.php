<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\TimeSlot;
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

        $appointments = Appointment::with(['doctor.user', 'timeSlot'])
            ->where('patient_id', $patient->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($a) => [
                'id'             => $a->id,
                'doctor'         => $a->doctor?->user?->name,
                'specialization' => $a->doctor?->specialization,
                'date'           => $a->timeSlot?->date,
                'time'           => $a->timeSlot?->start_time . ' - ' . $a->timeSlot?->end_time,
                'status'         => $a->status,
            ]);

        $doctors = Doctor::with('user')
            ->whereHas('user', fn($q) => $q->where('is_active', true))
            ->get()
            ->map(fn($d) => [
                'id'   => $d->id,
                'name' => $d->user?->name,
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
     * Dashboard page — reuse stats from home but render Dashboard.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();
        $patient = $user?->patient;

        $upcoming = null;
        if ($patient) {
            $upcomingAppointment = Appointment::with(['doctor.user', 'timeSlot'])
                ->where('patient_id', $patient->id)
                ->where('status', 'scheduled')
                ->orderBy('time_slot_id')
                ->first();

            if ($upcomingAppointment) {
                $upcoming = [
                    'doctor'         => $upcomingAppointment->doctor?->user?->name,
                    'specialization' => $upcomingAppointment->doctor?->specialization,
                    'date'           => $upcomingAppointment->timeSlot?->date,
                    'time'           => $upcomingAppointment->timeSlot?->start_time . ' - ' . $upcomingAppointment->timeSlot?->end_time,
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
        ]);
    }
}