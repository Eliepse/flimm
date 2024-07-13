<?php

namespace App\Http\Controllers;

use App\Models\Session;
use Illuminate\Contracts\View\View;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class SessionController
{
	public function show(Session $session): View
	{
		$session->loadMissing(["edition", "films"]);

		if ($session->edition && ! $session->edition->isPublished()) {
			throw new NotFoundHttpException();
		}

		return view("session", compact("session"));
	}
}
