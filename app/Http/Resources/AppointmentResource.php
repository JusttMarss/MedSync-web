<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Inline doctor/patient data to avoid N+1 from DoctorResource's timeSlots() query
        $doctor = $this->whenLoaded('doctor');
        $patient = $this->whenLoaded('patient');

        return [
            'id'        => $this->id,
            'status'    => $this->status instanceof \App\Enums\AppointmentStatusEnum
                ? $this->status->value
                : $this->status,
            'notes'     => $this->notes,
            'patient'   => new PatientResource($patient),
            'doctor'    => $this->formatDoctor($doctor),
            'time_slot' => new TimeSlotResource($this->whenLoaded('timeSlot')),
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }

    /**
     * Format doctor without the expensive timeSlots schedule query.
     */
    private function formatDoctor($doctor): ?array
    {
        if (!$doctor || $doctor instanceof \Illuminate\Http\Resources\MissingValue) {
            return null;
        }

        return [
            'id'             => $doctor->id,
            'user_id'        => $doctor->user_id,
            'name'           => $doctor->user?->name,
            'email'          => $doctor->user?->email,
            'specialization' => $doctor->specialization,
            'phone'          => $doctor->phone,
            'bio'            => $doctor->bio,
            'is_active'      => $doctor->user?->is_active,
            'schedule'       => [],
            'created_at'     => $doctor->created_at?->toDateTimeString(),
        ];
    }
}
