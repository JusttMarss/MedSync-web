<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicalRecordController extends Controller
{
    /**
     * Tampilkan semua rekam medis milik pasien yang login.
     */
    public function index(Request $request)
    {
        $user    = $request->user();
        $patient = $user?->patient;

        if (!$patient) {
            return redirect()->route('dashboard')
                ->with('error', 'Akun Anda belum terhubung ke profil pasien.');
        }

        $records = MedicalRecord::with(['doctor.user', 'appointment.timeSlot'])
            ->where('patient_id', $patient->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($r) => [
                'id'             => $r->id,
                'visit_date'     => $r->appointment?->timeSlot?->date
                                    ?? $r->created_at->format('d/m/Y'),
                'doctor'         => $r->doctor?->user?->name,
                'specialization' => $r->doctor?->specialization,
                'diagnosis'      => $r->diagnosis,
                'treatment'      => $r->treatment,
                'medications'    => $r->medications, // sudah di-cast array
                'notes'          => $r->notes,
            ]);

        return Inertia::render('MedicalRecords', [
            'records' => $records,
        ]);
    }
}