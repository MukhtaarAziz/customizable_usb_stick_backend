<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_en',
        'description_en',
        'name_ar',
        'description_ar',
        'category_id',
        'program_platform_id',
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
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function platform(): BelongsTo
    {
        return $this->belongsTo(ProgramPlatform::class, 'program_platform_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProgramImage::class);
    }
}
