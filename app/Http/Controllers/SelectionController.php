<?php

namespace App\Http\Controllers;

use App\Models\Edition;
use App\Models\Selection;
use Illuminate\Contracts\View\View;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class SelectionController
{
	/**
	 * @throws \Throwable
	 */
	public function show(Edition $edition, Selection $selection): View
	{
		throw_if($selection->edition_id !== $edition->id, new NotFoundHttpException());

		return view("selection", ["edition" => $edition, "selection" => $selection]);
	}
}