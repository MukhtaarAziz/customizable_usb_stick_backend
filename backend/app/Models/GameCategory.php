<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GameCategory extends Category
{
    use HasFactory;

    protected $table = 'categories';

    protected static function booted(): void
    {
        static::addGlobalScope('game_type', function (Builder $builder) {
            $builder->where('category_type_id', 1);
        });
    }

    public function games(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Game::class, 'category_id');
    }
}
