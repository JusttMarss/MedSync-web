<?php

namespace App\Enums;

enum AppointmentStatusEnum: string
{
    case PENDING = 'pending';
    case SCHEDULED = 'scheduled';
    case CONFIRMED = 'confirmed';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
}
