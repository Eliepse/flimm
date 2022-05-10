<?php

use App\Models\Edition;
use App\Models\Film;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use function Pest\Laravel\assertDatabaseCount;

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
	assertDatabaseCount("selections", 1);
	assertDatabaseCount("film_selection", 5);
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