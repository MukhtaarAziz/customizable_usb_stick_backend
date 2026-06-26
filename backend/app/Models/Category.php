<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_type_id',
        'name_en',
        'name_ar',
        'description_en',
        'description_ar',
    ];

    public function categoryType(): BelongsTo
    {
        return $this->belongsTo(CategoryType::class);
    }
}
