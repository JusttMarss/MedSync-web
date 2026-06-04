<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\User;
use App\Enums\RoleEnum;
use App\Enums\GenderEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rules\Enum;

class AdminController extends Controller
{
    /**
     * Store a new doctor.
     */
    public function storeDoctor(Request $request)
    {
        $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => 'required|string|email|max:255|unique:users',
            'password'       => 'required|string|min:8',
            'specialization' => 'required|string|max:255',
            'phone'          => 'required|string|max:20',
            'bio'            => 'nullable|string',
        ]);

        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role'      => RoleEnum::DOCTOR->value,
            'is_active' => true,
        ]);

        Doctor::create([
            'user_id'        => $user->id,
            'specialization' => $request->specialization,
            'phone'          => $request->phone,
            'bio'            => $request->bio,
        ]);

        return Redirect::back()->with('success', 'Dokter berhasil ditambahkan.');
    }

    /**
     * Update an existing doctor.
     */
    public function updateDoctor(Request $request, $id)
    {
        $doctor = Doctor::findOrFail($id);
        $user = $doctor->user;

        $request->validate([
            'name'           => 'required|string|max:255',
            'email'          => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password'       => 'nullable|string|min:8',
            'specialization' => 'required|string|max:255',
            'phone'          => 'required|string|max:20',
            'bio'            => 'nullable|string',
        ]);

        $userData = [
            'name'  => $request->name,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }

        $user->update($userData);

        $doctor->update([
            'specialization' => $request->specialization,
            'phone'          => $request->phone,
            'bio'            => $request->bio,
        ]);

        return Redirect::back()->with('success', 'Data dokter berhasil diperbarui.');
    }

    /**
     * Delete a doctor.
     */
    public function deleteDoctor($id)
    {
        $doctor = Doctor::findOrFail($id);
        $user = $doctor->user;

        $doctor->delete();
        if ($user) {
            $user->delete();
        }

        return Redirect::back()->with('success', 'Dokter berhasil dihapus.');
    }

    /**
     * Store a new patient.
     */
    public function storePatient(Request $request)
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|string|email|max:255|unique:users',
            'password'      => 'required|string|min:8',
            'date_of_birth' => 'required|date',
            'gender'        => ['required', new Enum(GenderEnum::class)],
            'address'       => 'required|string',
            'phone'         => 'required|string|max:20',
        ]);

        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role'      => RoleEnum::PATIENT->value,
            'is_active' => true,
        ]);

        Patient::create([
            'user_id'       => $user->id,
            'date_of_birth' => $request->date_of_birth,
            'gender'        => $request->gender,
            'address'       => $request->address,
            'phone'         => $request->phone,
        ]);

        return Redirect::back()->with('success', 'Pasien berhasil ditambahkan.');
    }

    /**
     * Update an existing patient.
     */
    public function updatePatient(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);
        $user = $patient->user;

        $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password'      => 'nullable|string|min:8',
            'date_of_birth' => 'required|date',
            'gender'        => ['required', new Enum(GenderEnum::class)],
            'address'       => 'required|string',
            'phone'         => 'required|string|max:20',
        ]);

        $userData = [
            'name'  => $request->name,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }

        $user->update($userData);

        $patient->update([
            'date_of_birth' => $request->date_of_birth,
            'gender'        => $request->gender,
            'address'       => $request->address,
            'phone'         => $request->phone,
        ]);

        return Redirect::back()->with('success', 'Data pasien berhasil diperbarui.');
    }

    /**
     * Delete a patient.
     */
    public function deletePatient($id)
    {
        $patient = Patient::findOrFail($id);
        $user = $patient->user;

        $patient->delete();
        if ($user) {
            $user->delete();
        }

        return Redirect::back()->with('success', 'Pasien berhasil dihapus.');
    }

    /**
     * Admin update appointment status (Acc or Cancel)
     */
    public function updateAppointmentStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:pending,scheduled,confirmed,completed,cancelled',
        ]);

        $appointment = Appointment::findOrFail($id);
        $appointment->update([
            'status' => $request->status,
        ]);

        return Redirect::back()->with('success', 'Status appointment berhasil diperbarui.');
    }
}
