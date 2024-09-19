<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EditionController;
use App\Http\Controllers\Api\FilmController;
use App\Http\Controllers\Api\SelectionController;
use App\Http\Controllers\Api\SessionController;
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

	Route::get("/dashboard", [DashboardController::class, "content"]);

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
	Route::delete("editions/{edition}", [EditionController::class, "destroy"]);

	// Selections
	Route::post("/editions/{edition}/selections", [SelectionController::class, "store"]);
	Route::get("/editions/{edition}/selections", [SelectionController::class, "index"]);
	Route::get("/editions/{edition}/selections/{selection}", [SelectionController::class, "get"]);
	Route::post("/editions/{edition}/selections/{selection}", [SelectionController::class, "update"]);
	Route::delete("/editions/{edition}/selections/{selection}", [SelectionController::class, "destroy"]);

	Route::resource("sessions", SessionController::class)->only(["index", "store", "show"]);
	Route::post("sessions/{session}", [SessionController::class, "update"]);
	Route::post("sessions/{session}/media", [SessionController::class, "saveContentMedia"]);
	Route::delete("sessions/{session}", [SessionController::class, "destroy"]);
});
