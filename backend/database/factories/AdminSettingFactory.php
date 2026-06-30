<?php

namespace Database\Factories;

use App\Models\AdminSetting;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AdminSetting>
 */
class AdminSettingFactory extends Factory
{
    protected $model = AdminSetting::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'language' => 'en',
            'pagination_per_page' => 15,
            'darkmode' => false,
        ];
    }
}
