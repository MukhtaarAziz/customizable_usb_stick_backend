<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * App\Models\ProgramCategory
 *
 * @property int $id
 * @property int $category_type_id
 * @property string $name_en
 * @property string $name_ar
 * @property string|null $description_en
 * @property string|null $description_ar
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
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
