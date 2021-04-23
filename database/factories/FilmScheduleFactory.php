<?php

namespace Database\Factories;

use App\Models\FilmSchedule;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class FilmScheduleFactory extends Factory
{
	/**
	 * The name of the factory's corresponding model.
	 *
	 * @var string
	 */
	protected $model = FilmSchedule::class;


	/**
	 * Define the model's default state.
	 *
	 * @return array
	 */
	public function definition()
	{
		$content_json = [
			"time" => 1550476186479,
			"blocks" => [
				"type" => "paragraph",
				"data" => [
					"text" => "This is an exemple paragraph.",
				],
			],
			"version" => "2.8.1",
		];

		return [
			"content" => json_encode($content_json),
			"start_at" => Carbon::now()->addDays(rand(-7, 21)),
		];
	}
}
