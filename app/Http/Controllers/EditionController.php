<?php

namespace App\Http\Controllers;

use App\Models\Edition;
use Illuminate\Contracts\View\View;

class EditionController
{
	public function show(Edition $edition): View
	{
		$edition->loadMissing("selections.films");

		return view("edition", ["edition" => $edition]);
	}
}