<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreSelectionRequest;
use App\Models\Edition;
use App\Models\Selection;
use Illuminate\Http\Response;

class SelectionController
{
	public function store(StoreSelectionRequest $request, Edition $edition): array
	{
		/** @var Selection $selection */
		$selection = $edition->selections()->create($request->all(["name"]));

		$selection->films()->attach($request->get("films", []));

		return $selection->loadMissing("films:id,title")->toArray();
	}


	public function destroy(Edition $edition, Selection $selection): Response
	{
		if (! $edition->selections()->where("id", $selection->id)->exists()) {
			return response(status: 404);
		}

		$selection->delete();
		return response()->noContent();
	}
}