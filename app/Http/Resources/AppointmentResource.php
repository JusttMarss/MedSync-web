<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Disable expensive schedule loading for nested doctor resource
        DoctorResource::$withSchedule = false;

        $data = [
            'id'        => $this->id,
            'status'    => $this->status instanceof \App\Enums\AppointmentStatusEnum
                ? $this->status->value
                : $this->status,
            'notes'     => $this->notes,
            'patient'   => new PatientResource($this->whenLoaded('patient')),
            'doctor'    => new DoctorResource($this->whenLoaded('doctor')),
            'time_slot' => new TimeSlotResource($this->whenLoaded('timeSlot')),
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ];

        // Restore schedule loading for other contexts
        DoctorResource::$withSchedule = true;

        return $data;
    }
}
