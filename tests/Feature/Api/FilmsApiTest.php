<?php

use App\Models\Edition;
use App\Models\Film;
use App\Models\Selection;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;

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
			"thumbnail" => UploadedFile::fake()->image('avatar.jpg'),
		]);

	$response->assertCreated();
	$this->assertDatabaseHas("films", ["slug" => $slug]);
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
			"thumbnail" => UploadedFile::fake()->image('avatar.jpg'),
		]);

	$response->assertOk();
	$this->assertDatabaseMissing("films", ["slug" => $film->slug]);
	$this->assertDatabaseHas("films", ["slug" => $slug]);
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

it("removes relations on delete", function () {
	$edition = Edition::factory()->create();
	$film = Film::factory()->create(["slug" => "foo"]);
	$session = Selection::factory()->create(["edition_id" => $edition->id]);
	$film->selections()->attach($session);

	$this->assertDatabaseHas("film_selection", ["film_id" => $film->id, "selection_id" => $session->id]);

	$film->delete();

	$this->assertDatabaseMissing("film_selection", ["film_id" => $film->id, "selection_id" => $session->id]);
});
