<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEditionRequest;
use App\Http\Requests\UpdateEditionRequest;
use App\Models\Edition;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Http\FormRequest;

class EditionController extends Controller
{
	public function index(): Collection
	{
		return Edition::query()->get();
	}


	public function show(Edition $edition): Edition
	{
		$edition->loadMissing(["schedules:id,film_id,edition_id,start_at"]);
		return $edition;
	}


	public function store(StoreEditionRequest $request): Edition
	{
		$edition = new Edition($request->validated());
		$edition->save();

		// Relational elements have to be handled after we created our instance
		$this->handleEditionFiles($request, $edition);
//		$this->handleEditionSchedules(collect($request->get("schedules", [])), $edition);
//		$edition->loadMissing(["schedules:id,film_id,edition_id,start_at"]);

		return $edition;
	}


	public function update(UpdateEditionRequest $request, Edition $edition): Edition
	{
		$edition->fill($request->validated());
		$this->handleEditionFiles($request, $edition);
//		$this->handleEditionSchedules(collect($request->get("schedules", [])), $edition);
		$edition->save();
//		$edition->loadMissing(["schedules:id,film_id,edition_id,start_at"]);

		return $edition;
	}


	private function handleEditionFiles(FormRequest $request, Edition $edition)
	{
		// Thumbnail
		if ($request->hasFile("thumbnail")) {
			$edition->saveThumbnail($request->file("thumbnail"));
		} else if ($request->has("thumbnail") && is_null($request->get("thumbnail"))) {
			$edition->removeThumbnail();
		}

		// Program
		if ($request->hasFile("program")) {
			$edition->saveProgram($request->file("program"));
		} else if ($request->has("program") && is_null($request->get("program"))) {
			$edition->removeProgram();
		}

		// Poster
		if ($request->hasFile("poster")) {
			$edition->savePoster($request->file("poster"));
		} else if ($request->has("poster") && is_null($request->get("poster"))) {
			$edition->removeProgram();
		}

		// Brochure
		if ($request->hasFile("brochure")) {
			$edition->saveBrochure($request->file("brochure"));
		} else if ($request->has("brochure") && is_null($request->get("brochure"))) {
			$edition->removeProgram();
		}

		// Flyer
		if ($request->hasFile("flyer")) {
			$edition->saveFlyer($request->file("flyer"));
		} else if ($request->has("flyer") && is_null($request->get("flyer"))) {
			$edition->removeProgram();
		}
	}
}
