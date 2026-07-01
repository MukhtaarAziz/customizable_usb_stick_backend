<?php

namespace App\Models;

use App\Models\Traits\HasOrderStatuses;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UsbStickOrder extends Model
{
    use HasFactory, HasOrderStatuses;

    protected $fillable = [
        'customer_id',
        'usb_stick_id',
        'total_price',
        'status',
        'notes',
        'custom_message',
        'delivery_address',
        'phone',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function usbStick(): BelongsTo
    {
        return $this->belongsTo(UsbStick::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(UsbStickOrderItem::class);
    }

    public function toArray()
    {
        $data = parent::toArray();

        $data['games'] = $this->items
            ->where('itemable_type', Game::class)
            ->map(fn ($item) => $item->itemable)
            ->filter()
            ->values()
            ->toArray();

        $data['programs'] = $this->items
            ->where('itemable_type', Program::class)
            ->map(fn ($item) => $item->itemable)
            ->filter()
            ->values()
            ->toArray();

        unset($data['items']);

        return $data;
    }
}
