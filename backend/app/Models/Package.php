<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_en',
        'name_ar',
        'description_en',
        'description_ar',
        'platform_id',
        'package_category_type_id',
        'active',
        'price_iqd',
        'discount',
        'views',
        'order_count',
    ];

    protected $casts = [
        'active' => 'boolean',
        'price_iqd' => 'decimal:2',
        'discount' => 'decimal:2',
    ];

    protected $appends = ['final_price_iqd'];

    public function platform(): BelongsTo
    {
        return $this->belongsTo(Platform::class);
    }

    public function packageCategoryType(): BelongsTo
    {
        return $this->belongsTo(PackageCategoryType::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PackageItem::class);
    }

    protected function finalPriceIqd(): Attribute
    {
        return Attribute::make(
            get: fn () => round($this->price_iqd * (1 - ($this->discount ?? 0)), 2),
        );
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

        $data['items_count'] = count($data['games']) + count($data['programs']);
        unset($data['items']);

        return $data;
    }
}
