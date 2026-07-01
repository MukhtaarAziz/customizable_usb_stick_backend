<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\StorageDevice
 *
 * @property int $id
 * @property string $name_en
 * @property string $name_ar
 * @property string|null $description_en
 * @property string|null $description_ar
 * @property int $storage_type_id
 * @property int $size_mb
 * @property int|null $real_size_mb
 * @property string $price_iqd
 * @property string $marka
 * @property string $interface
 * @property bool $customizable
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class StorageDevice extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_en',
        'name_ar',
        'description_en',
        'description_ar',
        'storage_type_id',
        'size_mb',
        'real_size_mb',
        'price_iqd',
        'marka',
        'interface',
        'customizable',
    ];

    protected $casts = [
        'size_mb' => 'integer',
        'real_size_mb' => 'integer',
        'price_iqd' => 'decimal:2',
        'customizable' => 'boolean',
    ];

    protected $appends = ['size_gb', 'real_size_gb'];

    public function storageType()
    {
        return $this->belongsTo(StorageDeviceType::class, 'storage_type_id');
    }

    public function getNameAttribute()
    {
        return app('translator')->getLocale() === 'ar' ? $this->name_ar : $this->name_en;
    }

    public function getDescriptionAttribute()
    {
        return app('translator')->getLocale() === 'ar' ? $this->description_ar : $this->description_en;
    }

    public function getSizeGbAttribute()
    {
        return round($this->size_mb / 1024, 2);
    }

    public function getRealSizeGbAttribute()
    {
        return $this->real_size_mb ? round($this->real_size_mb / 1024, 2) : null;
    }

    public function orders(): HasMany
    {
        return $this->hasMany(StorageDeviceOrder::class);
    }

    public function packages(): HasMany
    {
        return $this->hasMany(Package::class);
    }
}