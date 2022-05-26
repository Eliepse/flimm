<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\EditionController;
use App\Http\Controllers\FilmController;
use App\Http\Controllers\HomepageController;
use App\Http\Controllers\SelectionController;
use App\Http\Controllers\SessionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', HomepageController::class);
Route::view("/a-propos", "about")->name("about");
Route::view('/admin/{any?}', 'admin')->where("any", ".*");
Route::get('/actus', [ArticleController::class, "index"])->name("actus");
Route::get('/actus/{article:slug}', [ArticleController::class, "show"])->name("article");
Route::get('/films/{film:slug}', [FilmController::class, "show"])->name("film");
Route::get("/editions/{edition:slug}", [EditionController::class, "show"])->name("edition");
Route::get("/seances/{session}", [SessionController::class, "show"])->name("session");
Route::get("/editions/{edition:slug}/selections/{selection}", [SelectionController::class, "show"])->name("selection");
