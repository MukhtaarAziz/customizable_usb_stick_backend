<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
