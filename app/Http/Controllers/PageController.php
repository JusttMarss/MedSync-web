<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    /**
     * Homepage — tampilkan statistik umum.
     */
    public function home()
    {
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

        // Ambil daftar spesialisasi unik untuk filter dropdown
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
}
