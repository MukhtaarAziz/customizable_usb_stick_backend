<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    use HasFactory;

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
    ];

    protected $casts = [
        'tags' => 'array',
        'date_release' => 'date',
        'size_gb' => 'double',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function platform(): BelongsTo
    {
        return $this->belongsTo(Platform::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(Image::class);
    }
}
