<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class UsbStickOrderItem extends Model
{
    protected $fillable = [
        'usb_stick_order_id',
        'itemable_type',
        'itemable_id',
    ];

    public function order(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(UsbStickOrder::class, 'usb_stick_order_id');
    }

    public function itemable(): MorphTo
    {
        return $this->morphTo();
    }
}
