<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProgramCategory extends Category
{
    use HasFactory;

    protected $table = 'categories';

    protected static function booted(): void
    {
        static::addGlobalScope('program_type', function (Builder $builder) {
            $builder->where('category_type_id', 2);
        });
    }

    public function programs(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Program::class, 'category_id');
    }
}
