<?php

namespace Database\Factories;

use App\Models\Program;
use App\Models\Category;
use App\Models\ProgramPlatform;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProgramFactory extends Factory
{
    protected $model = Program::class;

    public function definition()
    {
        return [
            'name_en' => $this->faker->unique()->words(3, true),
            'description_en' => $this->faker->sentence(),
            'name_ar' => $this->faker->unique()->words(3, true),
            'description_ar' => $this->faker->sentence(),
            'category_id' => Category::where('category_type_id', 2)->inRandomOrder()->first()->id ?? Category::factory(),
            'program_platform_id' => ProgramPlatform::inRandomOrder()->first()->id ?? ProgramPlatform::factory(),
            'tags' => $this->faker->randomElements(['utility', 'office', 'design', 'development', 'multimedia', 'security', 'education'], rand(1, 3)),
            'size_gb' => $this->faker->randomFloat(2, 0.1, 50),
            'downloads' => $this->faker->numberBetween(0, 1000000),
            'date_release' => $this->faker->date(),
        ];
    }
}
