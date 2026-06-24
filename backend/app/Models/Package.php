<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_en',
        'description_en',
        'name_ar',
        'description_ar',
        'cover_id',
        'platform_id',
        'views',
        'order_count',
    ];

    protected $casts = [
        'views' => 'integer',
        'order_count' => 'integer',
    ];

    public function cover(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'cover_id');
    }

    public function platform(): BelongsTo
    {
        return $this->belongsTo(Platform::class);
    }

    public function games(): BelongsToMany
    {
        return $this->belongsToMany(Game::class, 'game_package');
    }
}
