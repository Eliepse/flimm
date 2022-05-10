<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreSelectionRequest;
use App\Models\Edition;
use App\Models\Selection;

class SelectionController
{
	public function store(StoreSelectionRequest $request, Edition $edition): array
	{
		/** @var Selection $selection */
		$selection = $edition->selections()->create($request->all(["name"]));

		$selection->films()->attach($request->get("films", []));

		return $selection->loadMissing("films:id,title")->toArray();
	}
}