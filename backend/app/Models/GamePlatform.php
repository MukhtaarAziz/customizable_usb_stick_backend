<?php

namespace App\Models;

use App\Models\Game;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GamePlatform extends Model
{
    use HasFactory;

    protected $table = 'game_platforms';

    protected $fillable = [
        'name_en',
        'name_ar',
        'description_en',
        'description_ar',
    ];

    public function games(): HasMany
    {
        return $this->hasMany(Game::class, 'game_platform_id');
    }
}
