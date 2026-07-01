<?php

namespace App\Models\Traits;

use App\Models\OrderStatus;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasOrderStatuses
{
    const STATUS_PENDING = 'pending';
    const STATUS_PROCESSING = 'processing';
    const STATUS_SHIPPED = 'shipped';
    const STATUS_DELIVERED = 'delivered';
    const STATUS_CANCELLED = 'cancelled';

    const STATUSES = [
        self::STATUS_PENDING => 'قيد الانتظار',
        self::STATUS_PROCESSING => 'قيد المعالجة',
        self::STATUS_SHIPPED => 'تم الإرسال',
        self::STATUS_DELIVERED => 'تم الاستلام',
        self::STATUS_CANCELLED => 'ملغى',
    ];

    public static function bootHasOrderStatuses()
    {
        static::created(function ($order) {
            $order->statuses()->create(['status' => $order->status]);
        });
    }

    public function statuses(): MorphMany
    {
        return $this->morphMany(OrderStatus::class, 'statusable');
    }
}
