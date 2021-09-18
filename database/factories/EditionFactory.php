<?php

namespace Database\Factories;

use App\Models\Edition;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class EditionFactory extends Factory
{
	/**
	 * The name of the factory's corresponding model.
	 *
	 * @var string
	 */
	protected $model = Edition::class;


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
			"title" => Str::random("32"),
			"slug" => Str::slug(Str::random()),
			"content" => json_encode($content_json),
			"open_at" => $open_at = Carbon::now()->addDays(rand(-7, 21)),
			"close_at" => $open_at->clone()->addDays(rand(4, 7)),
			"published_at" => $open_at->clone()->subDays(rand(5, 10)),
		];
	}
}
