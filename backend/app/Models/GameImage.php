<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\GameImage
 *
 * @property int $id
 * @property int $game_id
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
class GameImage extends Model
{
    use HasFactory;

    protected $table = 'game_images';

    protected $fillable = [
        'game_id',
        'path',
        'thumb_path',
        'type',
        'alt',
        'sort_order',
        'mime',
        'size',
        'disk',
    ];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}
