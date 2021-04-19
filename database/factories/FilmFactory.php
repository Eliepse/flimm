<?php

namespace Database\Factories;

use App\Models\Film;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class FilmFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Film::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
	        "title" => Str::random(32),
	        "duration" => rand(25 * 60, 75 * 60),
	        "synopsis" => Str::random(64),
	        "description" => Str::random(256),
	        "video_link" => null,
	        "imdb_link" => null,
        ];
    }
}
