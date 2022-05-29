<?php

use App\Models\Film;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

uses(RefreshDatabase::class);

test("Can create a film", function () {
	$user = User::factory()->create();

	$response = actingAs($user)
		->post("/api/films", [
			"title" => "My first movie",
			"slug" => $slug = "my-first-movie",
			"filmmaker" => "Eliepse",
			"duration" => 42,
			"year" => "2022",
		]);

	$response->assertCreated();
	assertDatabaseHas("films", ["slug" => $slug]);
});

test("Can update a film", function () {
	$user = User::factory()->create();
	/** @var Film $film */
	$film = Film::factory()->create(["slug" => "foo"]);

	$response = actingAs($user)
		->post("/api/films/$film->id", $data = [
			"title" => "My first movie 2",
			"slug" => $slug = "my-first-movie",
			"filmmaker" => "Eliepse",
			"duration" => 42,
			"year" => "2022",
		]);

	$response->assertOk();
	assertDatabaseMissing("films", ["slug" => $film->slug]);
	assertDatabaseHas("films", ["slug" => $slug]);
	expect(Film::first()->toArray())->toMatchArray($data);
});

test("Can upload a thumbnail", function () {
	$user = User::factory()->create();
	/** @var Film $film */
	$film = Film::factory()->create();

	expect($film->thumbnail)->toBeNull();

	$response = actingAs($user)
		->post("/api/films/$film->id", array_merge($film->toArray(), [
			"thumbnail" => UploadedFile::fake()->image("film-01.jpg", 640, 480),
		]));

	$film->refresh();

	$response->assertOk();
	expect($film->thumbnail)->toBeInstanceOf(Spatie\MediaLibrary\MediaCollections\Models\Media::class);
});

test("Can fetch all films", function () {
	$user = User::factory()->create();
	Film::factory(100)->create();

	$response = actingAs($user)->get("/api/films");

	$response->assertOk();
	$response->assertJsonCount(100);
});

test("Can query films by title", function () {
	$user = User::factory()->create();
	Film::factory()->create(["title" => $title1 = "The old house"]);
	Film::factory()->create(["title" => $title2 = "Old man on the hill"]);
	Film::factory()->create(["title" => "Every morning of the world"]);

	$response = actingAs($user)->get("/api/films?title=old");

	$response->assertOk();
	$response->assertJsonCount(2);
	$response->assertJsonPath("0.title", $title2);
	$response->assertJsonPath("1.title", $title1);
});
