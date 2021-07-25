<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\HomepageController;
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
Route::view('/admin/{any?}', 'admin')->where("any", ".*");
Route::get('/actus', [ArticleController::class, "index"])->name("actus");
Route::get('/actus/{article:slug}', [ArticleController::class, "show"])->name("article");
