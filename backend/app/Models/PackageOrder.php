<?php

namespace App\Models;

use App\Models\Traits\HasOrderStatuses;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PackageOrder extends Model
{
    use HasFactory, HasOrderStatuses;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            $order->uuid = (string) \Illuminate\Support\Str::uuid();
        });
    }

    protected $fillable = [
        'customer_id',
        'uuid',
        'customer_name',
        'governorate_id',
        'total_price',
        'status',
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

    public function governorate(): BelongsTo
    {
        return $this->belongsTo(Governorate::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PackageOrderItem::class);
    }
}
