<?php

use App\Models\Film;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

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
