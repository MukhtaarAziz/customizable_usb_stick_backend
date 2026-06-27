<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PackageOrderStatus extends Model
{
    protected $fillable = [
        'package_order_id',
        'status',
    ];

    public function packageOrder(): BelongsTo
    {
        return $this->belongsTo(PackageOrder::class);
    }
}
