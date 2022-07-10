<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreSelectionRequest;
use App\Http\Requests\UpdateSelectionRequest;
use App\Models\Edition;
use App\Models\Selection;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Response;

class SelectionController
{
	public function index(Edition $edition): Collection
	{
		return $edition->selections()->with("films:id,title")->get();
	}


	public function get(Edition $edition, Selection $selection): Selection|Response
	{
		if (! $edition->selections()->where("id", $selection->id)->exists()) {
			return response(status: 404);
		}

		return $selection->loadMissing("films:id,title");
	}


	public function store(StoreSelectionRequest $request, Edition $edition): array
	{
		/** @var Selection $selection */
		$selection = $edition->selections()->create($request->all(["name", "intro"]));

		$selection->films()->attach($request->get("films", []));

		return $selection->loadMissing("films:id,title")->toArray();
	}


	public function update(UpdateSelectionRequest $request, Edition $edition, Selection $selection): array|Response
	{
		if (! $edition->selections()->where("id", $selection->id)->exists()) {
			return response(status: 404);
		}

		if ($request->hasAny(["name", "intro"])) {
			$selection->name = $request->name;
			$selection->intro = $request->intro;
			$selection->save();
		}

		if ($request->films) {
			$selection->films()->sync($request->films);
		}


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