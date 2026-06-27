<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Platform extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_en',
        'name_ar',
        'description_en',
        'description_ar',
    ];

    public function games(): HasMany
    {
        return $this->hasMany(Game::class, 'platform_id');
    }

    public function programs(): HasMany
    {
        return $this->hasMany(Program::class, 'platform_id');
    }

    public function packages(): HasMany
    {
        return $this->hasMany(Package::class);
    }
}
