<?php

namespace App\Http\Controllers\Api;

use App\FileFieldHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\RequestWithFileFields;
use App\Http\Requests\StoreEditionRequest;
use App\Http\Requests\UpdateEditionRequest;
use App\Models\Edition;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class EditionController extends Controller
{
	public function index(): Collection
	{
		return Edition::query()->get();
	}


	public function show(Edition $edition): Edition
	{
//		$edition->loadMissing(["schedules:id,film_id,edition_id,start_at"]);
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


	private function handleEditionFiles(RequestWithFileFields $request, Edition $edition)
	{
		$fileFieldHandler = new FileFieldHandler([
			"thumbnail" => "thumbnail",
			"program" => "program",
			"poster" => "poster",
			"brochure" => "brochure",
			"flyer" => "flyer",
		]);
		$fileFieldHandler->updateModel($request, $edition);
	}


	public function update(UpdateEditionRequest $request, Edition $edition): Edition
	{
		$edition->fill($request->validated());
		$this->handleEditionFiles($request, $edition);
		$edition->save();

		return $edition;
	}


	public function destroy(Edition $edition)
	{
		if ($edition->delete()) {
			return response()->noContent();
		}

		throw new HttpException(500, "Entity deletion didn't succeed");
	}


	public function saveContentMedia(Request $request, Edition $edition): JsonResponse
	{
		try {
			$media = $edition->saveContentImage("image");
		} catch (\Exception $e) {
			return response()->json(["success" => 0], 201);
		}

		return response()->json([
			"success" => 1,
			"file" => [
				"url" => $media->getFullUrl(),
				"uuid" => $media->uuid,
				// ... and any additional fields you want to store, such as width, height, color, extension, etc
			],
		], 201);
	}
}
