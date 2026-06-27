<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * App\Models\Customer
 *
 * @property int $id
 * @property string $name
 * @property string $phone
 * @property string|null $email
 * @property string $password
 * @property int $governorate_id
 * @property string|null $address
 * @property string|null $nearest_service_point
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
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

    public function storageDeviceOrders(): HasMany
    {
        return $this->hasMany(StorageDeviceOrder::class);
    }

    public function packageOrders(): HasMany
    {
        return $this->hasMany(PackageOrder::class);
    }

    public function cart(): HasOne
    {
        return $this->hasOne(Cart::class);
    }
}
