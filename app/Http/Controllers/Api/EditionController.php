<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEditionRequest;
use App\Http\Requests\UpdateEditionRequest;
use App\Models\Edition;
use App\Models\FilmSchedule;
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
		$this->handleEditionSchedules(collect($request->get("schedules", [])), $edition);
		$edition->loadMissing(["schedules:id,film_id,edition_id,start_at"]);

		return $edition;
	}


	public function update(UpdateEditionRequest $request, Edition $edition): Edition
	{
		$edition->fill($request->validated());
		$this->handleEditionFiles($request, $edition);
		$this->handleEditionSchedules(collect($request->get("schedules", [])), $edition);
		$edition->save();
		$edition->loadMissing(["schedules:id,film_id,edition_id,start_at"]);

		return $edition;
	}


	private function handleEditionFiles(FormRequest $request, Edition $edition)
	{
		if ($request->hasFile("thumbnail")) {
			$edition->saveThumbnail($request->file("thumbnail"));
		} else if ($request->has("thumbnail") && is_null($request->get("thumbnail"))) {
			$edition->removeThumbnail();
		}

	}


	private function handleEditionSchedules(\Illuminate\Support\Collection $schedules, Edition $edition)
	{
		$storedSchedules = $edition->schedules()->get(["id"]);

		// Delete removed schedules
		$staleSchedules = $storedSchedules->whereNotIn("id", $schedules->pluck("id"), true);
		FilmSchedule::query()->whereIn("id", $staleSchedules->pluck("id"))->delete();

		// Add new schedules
		$edition->schedules()->createMany($schedules->whereNull("id"));

		// Update existing schedules
		// Commented since no schedule change is avaible for now client side
//		$schedules
//			->whereNotNull("id")
//			->each(function ($schedule) use ($storedSchedules) {
//				/** @var FilmSchedule|null $storedSchedule */
//				$storedSchedule = $storedSchedules->firstWhere("id", $schedule["id"]);
//
//				if (! $storedSchedule) {
//					return;
//				}
//
//				$storedSchedule->update($schedule);
//			});
	}
}
