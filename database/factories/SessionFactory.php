<?php

namespace Database\Factories;

use App\Models\Session;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends Factory<Session>
 */
class SessionFactory extends Factory
{
	protected $model = Session::class;

	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
	{
		return [
			"title" => $this->faker->realText(32),
			"location" => Arr::random(["Salle 1", "Salle 2", "Salle 3"]),
			"duration" => rand(30, 120),
			"start_at" => $this->faker->dateTimeBetween("now", "1 month"),
		];
	}
}
