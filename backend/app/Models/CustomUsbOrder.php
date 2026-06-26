<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomUsbOrder extends Model
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

    /**
     * Get the customer that owns the order.
     */
    public function customer(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the usb stick for this order.
     */
    public function usbStick(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(UsbStick::class);
    }

    /**
     * Get the games for this custom order.
     */
    public function games(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Game::class, 'custom_usb_order_game');
    }
}