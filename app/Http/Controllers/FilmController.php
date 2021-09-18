<?php

namespace App\Http\Controllers;

use App\Models\Film;
use Illuminate\Contracts\View\View;

class FilmController
{
	public function show(Film $film): View
	{
		return view("film", ["film" => $film]);
	}
}