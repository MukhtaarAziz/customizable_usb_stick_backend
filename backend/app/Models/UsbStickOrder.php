<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class UsbStickOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'usb_stick_id',
        'total_price',
        'status',
        'notes',
    ];

    protected $casts = [
        'total_price' => 'double',
    ];

    /**
     * Get the customer that placed this order.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the USB stick chosen for this order.
     */
    public function usbStick(): BelongsTo
    {
        return $this->belongsTo(UsbStick::class);
    }

    /**
     * Get the games included in this custom USB stick order.
     */
    public function games(): BelongsToMany
    {
        return $this->belongsToMany(Game::class, 'game_usb_stick_order');
    }
}
