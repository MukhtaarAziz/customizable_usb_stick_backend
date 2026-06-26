<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Customer extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'password',
        'governorate_id',
        'address',
        'nearest_service_point',
    ];

    public function governorate(): BelongsTo
    {
        return $this->belongsTo(Governorate::class);
    }

    /**
     * Get the orders for this customer.
     */
    public function usbStickOrders(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(UsbStickOrder::class);
    }
}
