<?php

namespace App\Models;

use App\Models\Program;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProgramPlatform extends Model
{
    use HasFactory;

    protected $table = 'program_platforms';

    protected $fillable = [
        'name_en',
        'name_ar',
        'description_en',
        'description_ar',
    ];

    public function programs(): HasMany
    {
        return $this->hasMany(Program::class, 'program_platform_id');
    }
}
