<?php

use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EditionController;
use App\Http\Controllers\Api\FilmController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post("/login", [AuthController::class, "login"]);

Route::middleware('auth:sanctum')->group(function () {
	Route::get("/me", fn() => Auth::user());
	Route::get("/user", fn() => Auth::user());
	Route::post("/logout", [AuthController::class, "logout"]);

	// Articles
	Route::resource("articles", ArticleController::class);
	Route::post("/articles/{article}", [ArticleController::class, "update"]);
	Route::post("/articles/{article}/media", [ArticleController::class, "saveContentMedia"]);

	// Settings
	Route::get("settings", [SettingController::class, "index"]);
	Route::post("settings/{name}", [SettingController::class, "upsert"]);

	// Films
	Route::resource("films", FilmController::class)->only(["index", "store", "show"]);
	Route::post("films/{film}", [FilmController::class, "update"]);

	// Editions
	Route::resource("editions", EditionController::class)->only(["index", "store", "show"]);
	Route::post("editions/{edition}", [EditionController::class, "update"]);
	Route::post("/editions/{edition}/media", [EditionController::class, "saveContentMedia"]);
});
