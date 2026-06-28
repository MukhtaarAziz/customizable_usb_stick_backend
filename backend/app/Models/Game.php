<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Game
 *
 * @property int $id
 * @property string $name_en
 * @property string|null $description_en
 * @property string $name_ar
 * @property string|null $description_ar
 * @property int $category_id
 * @property int $platform_id
 * @property array|null $tags
 * @property float $size_gb
 * @property int $downloads
 * @property \Illuminate\Support\Carbon|null $date_release
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Game extends Model
{
    use HasFactory;

    protected $attributes = [
        'active' => true,
    ];

    protected $fillable = [
        'name_en',
        'description_en',
        'name_ar',
        'description_ar',
        'category_id',
        'platform_id',
        'tags',
        'size_gb',
        'downloads',
        'date_release',
        'active',
    ];

    protected $casts = [
        'tags' => 'array',
        'date_release' => 'date',
        'size_gb' => 'double',
        'active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function platform(): BelongsTo
    {
        return $this->belongsTo(Platform::class, 'platform_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(GameImage::class);
    }

}
