<?php

namespace App\Http\Controllers;

use App\Models\Film;
use Illuminate\Contracts\View\View;

class FilmController
{
	public function show(Film $film): View
	{
		$sessions = $film->schedules()->with("edition:id,title,slug")->get();
		return view("film", ["film" => $film, "sessions" => $sessions]);
	}
}