<?php

namespace Database\Factories;

use App\Models\Personality;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

class PersonalityFactory extends Factory
{
	/**
	 * The name of the factory's corresponding model.
	 *
	 * @var string
	 */
	protected $model = Personality::class;


	/**
	 * Define the model's default state.
	 *
	 * @return array
	 */
	public function definition(): array
	{
		return [
			'firstname' => Arr::random(["Pia", "Melinde", "Tadd", "Nerty", "Jobina", "Iggie", "Marci", "Paule", "Bob"]),
			'lastname' => Arr::random(["Empleton", "Coales", "Siney", "Cromleholme", "Janoschek", "Ilsley", "Franseco", "Lockyear", "Ebenezer"]),
		];
	}
}