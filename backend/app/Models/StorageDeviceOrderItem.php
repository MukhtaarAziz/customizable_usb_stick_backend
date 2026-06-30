<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * App\Models\StorageDeviceOrderItem
 *
 * @property int $id
 * @property int $storage_device_order_id
 * @property string $itemable_type
 * @property int $itemable_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class StorageDeviceOrderItem extends Model
{
    protected $fillable = [
        'storage_device_order_id',
        'itemable_type',
        'itemable_id',
    ];

    public function order(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(StorageDeviceOrder::class, 'storage_device_order_id');
    }

    public function itemable(): MorphTo
    {
        return $this->morphTo();
    }
}
