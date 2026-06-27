<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\UsbStick
 *
 * @property int $id
 * @property string $name_en
 * @property string $name_ar
 * @property string|null $description_en
 * @property string|null $description_ar
 * @property float $size_gb
 * @property string $interface
 * @property string|null $price_iqd
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class UsbStick extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_en',
        'name_ar',
        'description_en',
        'description_ar',
        'size_gb',
        'interface',
        'price_iqd',
    ];

    protected $casts = [
        'size_gb' => 'double',
        'price_iqd' => 'decimal:2',
    ];

    /**
     * Get the orders associated with this USB stick type.
     */
    public function orders(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(UsbStickOrder::class);
    }
}
