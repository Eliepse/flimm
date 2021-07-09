<?php

use App\Http\Controllers\ArticleController;
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

Route::view('/', 'welcome');
Route::view('/admin/{any?}', 'admin')->where("any", ".*");
Route::get('/actus', [ArticleController::class, "index"]);
Route::get('/actus/{article:slug}', [ArticleController::class, "show"]);
