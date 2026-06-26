<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProgramPackage extends Model
{
    use HasFactory;

    protected $table = 'program_packages';

    protected $fillable = [
        'name_en',
        'description_en',
        'name_ar',
        'description_ar',
        'cover_id',
        'program_platform_id',
        'views',
        'order_count',
    ];

    protected $casts = [
        'views' => 'integer',
        'order_count' => 'integer',
    ];

    public function cover(): BelongsTo
    {
        return $this->belongsTo(ProgramImage::class, 'cover_id');
    }

    public function platform(): BelongsTo
    {
        return $this->belongsTo(ProgramPlatform::class, 'program_platform_id');
    }

    public function programs(): BelongsToMany
    {
        return $this->belongsToMany(Program::class, 'program_package', 'program_package_id', 'program_id');
    }
}
