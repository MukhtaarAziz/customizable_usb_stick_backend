<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PackageOrder extends Model
{
    use HasFactory;

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

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            $order->uuid = (string) \Illuminate\Support\Str::uuid();
        });

        static::created(function ($order) {
            $order->statuses()->create(['status' => $order->status]);
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

    public function statuses(): HasMany
    {
        return $this->hasMany(PackageOrderStatus::class);
    }
}
