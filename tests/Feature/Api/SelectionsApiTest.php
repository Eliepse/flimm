<?php

use App\Models\Edition;
use App\Models\Film;
use App\Models\Selection;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

uses(RefreshDatabase::class);

test('Create a valid selection', function () {
	$user = User::factory()->create();
	$edition = Edition::factory()->create();
	$films = Film::factory(5)->create();

	/** @var TestResponse $response */
	$response = $this->actingAs($user)
		->postJson("/api/editions/$edition->id/selections", [
			"name" => "My selection",
			"films" => $films->pluck("id"),
		]);

	$response->assertStatus(200);
	expect($response->json())->toHaveKeys(["name", "films"]);
	expect($response->json("films"))->toBeArray();
	expect($response->json("films"))->toHaveLength(5);
    $this->assertDatabaseCount("selections", 1);
    $this->assertDatabaseCount("film_selection", 5);
});

test("Request fails on missing data", function () {
	$user = User::factory()->create();
	$edition = Edition::factory()->create();
	$this->actingAs($user)
		->postJson("/api/editions/$edition->id/selections", [
			"films" => [],
		])->assertUnprocessable();

	$this->actingAs($user)
		->postJson("/api/editions/$edition->id/selections", [
			"name" => "My selection",
		])->assertUnprocessable();

    $this->assertDatabaseCount("film_selection", 0);
});

test("Films list can't have duplicates", function () {
	$user = User::factory()->create();
	$edition = Edition::factory()->create();
	$films = Film::factory(5)->create();

	/** @var TestResponse $response */
	$response = $this->actingAs($user)
		->postJson("/api/editions/$edition->id/selections", [
			"name" => "My selection",
			"films" => [...$films->pluck("id"), ...$films->pluck("id")],
		]);

	$response->assertUnprocessable();
});

test("Delete a selection returns success code", function () {
	/** @var User $user */
	$user = User::factory()->create();
	/** @var Edition $edition */
	$edition = Edition::factory()->create();
	$films = Film::factory(5)->create();
	/** @var Selection $selection */
	$selection = $edition->selections()->save(new Selection(["name" => "Foo"]));

	$selection->films()->attach($films->pluck("id"));

	actingAs($user)
		->delete("/api/editions/$edition->id/selections/$selection->id")
		->assertSuccessful();

    $this->assertDatabaseCount("film_selection", 0);
});

test("Delete a selection clean all associated links", function () {
	/** @var User $user */
	$user = User::factory()->create();
	/** @var Edition $edition */
	$edition = Edition::factory()->create();
	$films = Film::factory(5)->create();
	/** @var Selection $selection */
	$selection = $edition->selections()->save(new Selection(["name" => "Foo"]));

	$selection->films()->attach($films->pluck("id"));

	actingAs($user)->delete("/api/editions/$edition->id/selections/$selection->id")->assertSuccessful();

    $this->assertDatabaseCount("film_selection", 0);
});

test("Cannot delete a selection that doesn't belong to the given edition", function () {
	/** @var User $user */
	$user = User::factory()->create();
	$edition = Edition::factory()->create();
	$films = Film::factory(5)->create();
	$selection = $edition->selections()->save(new Selection(["name" => "Foo"]));
	$freeSelection = Edition::factory()->create()->selections()->save(new Selection(["name" => "Bar"]));

	$selection->films()->attach($films->pluck("id"));

	actingAs($user)->delete("/api/editions/$edition->id/selections/$freeSelection->id")->assertNotFound();
});

test("Edit only selection name", function () {
	/** @var User $user */
	$user = User::factory()->create();
	/** @var Selection $selection */
	$selection = Selection::factory()->for(Edition::factory()->create())->hasAttached(Film::factory(5)->create())->create(["name" => "Foo"]);

	actingAs($user)
		->postJson("/api/editions/{$selection->edition->id}/selections/$selection->id", ["name" => "Baz"])
		->assertSuccessful();

    $this->assertDatabaseMissing("selections", ["name" => "Foo"]);
    $this->assertDatabaseHas("selections", ["name" => "Baz"]);
    $this->assertDatabaseCount("film_selection", 5);
});

test("Remove or add some films in a selection", function () {
	/** @var User $user */
	$user = User::factory()->create();
	/** @var Selection $selection */
	$selection = Selection::factory()->for(Edition::factory()->create())->hasAttached($films = Film::factory(5)->create())->create(["name" => "Foo"]);

	actingAs($user)
		->postJson("/api/editions/{$selection->edition->id}/selections/$selection->id", ["films" => $films->pluck("id")->slice(0, 3)])
		->assertSuccessful();

    $this->assertDatabaseCount("film_selection", 3);
    $this->assertDatabaseMissing("film_selection", ["selection_id" => $selection->id, "film_id" => $films[3]->id]);
    $this->assertDatabaseMissing("film_selection", ["selection_id" => $selection->id, "film_id" => $films[4]->id]);

	actingAs($user)
		->postJson("/api/editions/{$selection->edition->id}/selections/$selection->id", ["films" => $films->pluck("id")])
		->assertSuccessful();

    $this->assertDatabaseCount("film_selection", 5);
});

test("Fetch a selection of an edition", function () {
	/** @var User $user */
	$user = User::factory()->create();
	/** @var Selection $selection */
	$selection = Selection::factory()->for(Edition::factory()->create())->hasAttached($films = Film::factory(5)->create())->create(["name" => "Foo"]);

	$response = actingAs($user)->get("/api/editions/{$selection->edition->id}/selections/$selection->id");

	$response->assertSuccessful();
	$response->assertJson([
		"id" => $selection->id,
		"name" => "Foo",
		"films" => $films->map(fn($f) => ["id" => $f->id, "title" => $f->title])->toArray(),
	]);
});

test("Fetch all selections of an edition", function () {
	/** @var User $user */
	$user = User::factory()->create();
	/** @var Edition $edition */
	$edition = Edition::factory()->create();
	/** @var Selection $selection */
	Selection::factory(3)
		->for($edition)
		->hasAttached(Film::factory(5)->create())
		->create(["name" => "Foo"]);

	$response = actingAs($user)->get("/api/editions/$edition->id/selections");

	$response->assertSuccessful();
	expect($response->json())->toHaveLength(3);
	$response->assertJsonStructure([
		"*" => [
			"id",
			"name",
			"films" => [
				"*" => ["id", "title"],
			],
		],
	]);
});

test("Empty array when fetching selections of an edition that doesn't have some", function () {
	/** @var User $user */
	$user = User::factory()->create();
	/** @var Edition $edition */
	$edition = Edition::factory()->create();

	$response = actingAs($user)->get("/api/editions/$edition->id/selections");

	$response->assertSuccessful();
	expect($response->json())->toHaveLength(0);
});
