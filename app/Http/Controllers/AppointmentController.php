<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\AppointmentConfirmed;
use App\Models\Appointment;
use App\Models\TimeSlot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;

class AppointmentController extends Controller
{
    /**
     * Store a new appointment and mark timeslot as booked.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $patient = $user?->patient;

        if (!$patient) {
            return Redirect::back()->with('error', 'Hanya pasien yang dapat membuat appointment.');
        }

        $data = $request->validate([
            'doctor_id' => 'required|integer|exists:doctors,id',
            'time_slot_id' => 'required|integer|exists:time_slots,id',
            'notes' => 'nullable|string|max:500',
        ]);

        $slot = TimeSlot::where('id', $data['time_slot_id'])
            ->where('doctor_id', $data['doctor_id'])
            ->first();

        if (!$slot || $slot->is_booked) {
            return Redirect::back()->with('error', 'Time slot tidak tersedia atau sudah dipesan.');
        }

        $appointment = Appointment::create([
            'patient_id' => $patient->id,
            'doctor_id' => $data['doctor_id'],
            'time_slot_id' => $data['time_slot_id'],
            'status' => 'scheduled',
            'notes' => $data['notes'] ?? null,
        ]);

        $slot->update(['is_booked' => true]);

        if ($user?->email) {
            Mail::to($user->email)->send(new AppointmentConfirmed($appointment));
        }

        return Redirect::route('appointments')->with('success', 'Appointment berhasil dibuat. Konfirmasi telah dikirim ke email Anda.');
    }
}
