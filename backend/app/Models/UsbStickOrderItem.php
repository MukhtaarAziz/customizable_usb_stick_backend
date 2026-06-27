<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * App\Models\UsbStickOrderItem
 *
 * @property int $id
 * @property int $usb_stick_order_id
 * @property string $itemable_type
 * @property int $itemable_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
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
