<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\UsbStickOrder
 *
 * @property int $id
 * @property int $customer_id
 * @property int $usb_stick_id
 * @property string $total_price
 * @property string $status
 * @property string|null $notes
 * @property string|null $custom_message
 * @property string|null $delivery_address
 * @property string|null $phone
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class UsbStickOrder extends Model
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
