<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

class SelectionFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array
	 */
	public function definition()
	{
		return [
			"name" => Arr::random(["Ouverture", "Fermeture", "Selection officielle", "Selection partenaire"]),
		];
	}
}
