<?php

use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AuthController;
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
	Route::post("/logout", [AuthController::class, "logout"]);
	Route::resource("articles", ArticleController::class);
	Route::post("/articles/{article}/media", [ArticleController::class, "saveContentMedia"]);
});
