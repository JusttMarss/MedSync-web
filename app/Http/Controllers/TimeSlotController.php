<?php

namespace App\Http\Controllers;

use App\Models\TimeSlot;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class TimeSlotController extends Controller
{
    /**
     * Store a newly created time slot in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $role = $user->role?->value ?? $user->role;

        $rules = [
            'date' => 'required|date',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
        ];

        if ($role === 'admin') {
            $rules['doctor_id'] = 'required|integer|exists:doctors,id';
        }

        $data = $request->validate($rules);

        $doctorId = null;
        if ($role === 'admin') {
            $doctorId = $data['doctor_id'];
        } elseif ($role === 'doctor') {
            $doctor = $user->doctor;
            if (!$doctor) {
                return Redirect::back()->with('error', 'Profil dokter Anda tidak ditemukan.');
            }
            $doctorId = $doctor->id;
        } else {
            return Redirect::back()->with('error', 'Anda tidak memiliki akses untuk membuat jadwal.');
        }

        // Format times to H:i:s
        $startTime = date('H:i:s', strtotime($data['start_time']));
        $endTime = date('H:i:s', strtotime($data['end_time']));

        // Check for exact duplicates
        $exists = TimeSlot::where('doctor_id', $doctorId)
            ->where('date', $data['date'])
            ->where('start_time', $startTime)
            ->exists();

        if ($exists) {
            return Redirect::back()->with('error', 'Slot waktu tersebut sudah terdaftar.');
        }

        TimeSlot::create([
            'doctor_id' => $doctorId,
            'date' => $data['date'],
            'start_time' => $startTime,
            'end_time' => $endTime,
            'is_booked' => false,
        ]);

        return Redirect::back()->with('success', 'Slot waktu berhasil ditambahkan.');
    }

    /**
     * Update the specified time slot in storage.
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();
        $role = $user->role?->value ?? $user->role;

        $slot = TimeSlot::findOrFail($id);

        // Authorization check
        if ($role === 'doctor') {
            $doctor = $user->doctor;
            if (!$doctor || $slot->doctor_id !== $doctor->id) {
                abort(403, 'Unauthorized action.');
            }
        } elseif ($role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $data = $request->validate([
            'date' => 'required|date',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
            'is_booked' => 'required|boolean',
        ]);

        $startTime = date('H:i:s', strtotime($data['start_time']));
        $endTime = date('H:i:s', strtotime($data['end_time']));

        $slot->update([
            'date' => $data['date'],
            'start_time' => $startTime,
            'end_time' => $endTime,
            'is_booked' => $data['is_booked'],
        ]);

        return Redirect::back()->with('success', 'Slot waktu berhasil diperbarui.');
    }

    /**
     * Remove the specified time slot from storage.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $role = $user->role?->value ?? $user->role;

        $slot = TimeSlot::findOrFail($id);

        // Authorization check
        if ($role === 'doctor') {
            $doctor = $user->doctor;
            if (!$doctor || $slot->doctor_id !== $doctor->id) {
                abort(403, 'Unauthorized action.');
            }
        } elseif ($role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        if ($slot->is_booked) {
            return Redirect::back()->with('error', 'Tidak dapat menghapus slot waktu yang telah dipesan pasien.');
        }

        $slot->delete();

        return Redirect::back()->with('success', 'Slot waktu berhasil dihapus.');
    }
}
