<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategoryType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_en',
        'name_ar',
    ];

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }
}
