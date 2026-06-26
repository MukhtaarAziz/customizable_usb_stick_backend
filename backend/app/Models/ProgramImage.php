<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramImage extends Model
{
    use HasFactory;

    protected $table = 'program_images';

    protected $fillable = [
        'program_id',
        'path',
        'thumb_path',
        'type',
        'alt',
        'sort_order',
        'mime',
        'size',
        'disk',
    ];

    public function program()
    {
        return $this->belongsTo(Program::class);
    }
}
