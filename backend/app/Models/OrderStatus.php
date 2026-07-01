<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class OrderStatus extends Model
{
    protected $fillable = [
        'statusable_type',
        'statusable_id',
        'status',
    ];

    public function statusable(): MorphTo
    {
        return $this->morphTo();
    }
}
