<?php

namespace Database\Factories;

use App\Models\Film;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class FilmFactory extends Factory
{
	private const TITLES = [
		"Gods and Generals",
		"Sleep Furiously",
		"Carandiru",
		"Mission, The (Cheung fo)",
		"Santo vs. las lobas",
		"Informant!",
		"Beyond Bedlam",
		"Ledge",
		"Music Man",
		"Sinbad",
		"The fifth, voyage",
	];

	private const WORDS = [
		"Curabitur", "convallis.", "Duis", "consequat", "dui", "nec", "nisi",
		"volutpat", "eleifend.", "Donec", "ut", "dolor.", "Morbi", "vel", "lectus",
		"in", "quam", "fringilla", "rhoncus.", "Mauris", "enim", "leo,", "rhoncus",
		"sed,", "vestibulum", "sit", "amet,", "cursus", "id,", "turpis.",
	];

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
	public function definition(): array
	{
		$title = rand(0, 1) ? Arr::random(self::TITLES) : Arr::random(self::TITLES) . ": " . Arr::random(self::TITLES);

		$synopsis = [];
		for ($i = rand(32, 64); $i > 0; $i--) {
			$synopsis[] = Arr::random(self::WORDS);
		}

		$description = [];
		for ($i = rand(8, 24); $i > 0; $i--) {
			$description[] = Arr::random(self::WORDS);
		}

		return [
			"title" => $title,
			"duration" => rand(25, 75),
			"slug" => Str::slug($title . " " . Str::random(5)),
			"synopsis" => join(" ", $synopsis),
			"filmmaker" => Arr::random(["Empleton", "Coales", "Siney", "Cromleholme", "Janoschek", "Ilsley", "Franseco", "Lockyear", "Ebenezer"]),
			"year" => random_int(1900, 2022),
			"description" => join(" ", $description),
			"video_link" => null,
		];
	}
}
