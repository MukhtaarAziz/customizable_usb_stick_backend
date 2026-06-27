<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\ProgramImage
 *
 * @property int $id
 * @property int $program_id
 * @property string $path
 * @property string|null $thumb_path
 * @property string|null $type
 * @property string|null $alt
 * @property int $sort_order
 * @property string|null $mime
 * @property int|null $size
 * @property string $disk
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
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
