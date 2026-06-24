<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'user_id'        => $this->user_id,
            'name'           => $this->user?->name,
            'email'          => $this->user?->email,
            'specialization' => $this->specialization,
            'phone'          => $this->phone,
            'bio'            => $this->bio,
            'is_active'      => $this->user?->is_active,
            'schedule'       => $this->timeSlots()
                ->where('date', '>=', now()->toDateString())
                ->orderBy('date')
                ->orderBy('start_time')
                ->get()
                ->map(function ($slot) {
                    $date = \Carbon\Carbon::parse($slot->date);
                    $days = [
                        'Sunday' => 'Minggu', 'Monday' => 'Senin', 'Tuesday' => 'Selasa',
                        'Wednesday' => 'Rabu', 'Thursday' => 'Kamis', 'Friday' => 'Jumat',
                        'Saturday' => 'Sabtu'
                    ];
                    $dayName = $days[$date->format('l')] ?? $date->format('l');
                    $formattedDate = $date->format('d/m/Y');
                    $start = substr($slot->start_time, 0, 5);
                    $end = substr($slot->end_time, 0, 5);
                    return "{$dayName}, {$formattedDate} ({$start} - {$end})";
                })->toArray(),
            'created_at'     => $this->created_at?->toDateTimeString(),
        ];
    }
}
