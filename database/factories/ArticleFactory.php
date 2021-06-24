<?php

namespace Database\Factories;

use App\Models\Article;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ArticleFactory extends Factory
{
	/**
	 * The name of the factory's corresponding model.
	 *
	 * @var string
	 */
	protected $model = Article::class;


	/**
	 * Define the model's default state.
	 *
	 * @return array
	 */
	public function definition()
	{
		return [
			"slug" => Str::random("32"),
			"title" => $this->faker->sentence,
			"content" => [
				"time" => 1550476186479,
				"blocks" => [
					["type" => "header", "data" => ["text" => $this->faker->sentence, "level" => 1]],
					[
						"type" => "paragraph",
						"data" => [
							"text" => $this->faker->paragraph,
						],
					],
				],
				"version" => "2.8.1",
			],
			"published_at" => rand(0, 1) ? Carbon::now()->subDays(rand(1, 60)) : null,
		];
	}
}
