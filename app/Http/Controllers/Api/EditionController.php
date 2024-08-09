<?php

namespace App\Http\Controllers\Api;

use App\Action\PersistEdition;
use App\Data\EditionData;
use App\FileFieldHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\RequestWithFileFields;
use App\Http\Requests\StoreEditionRequest;
use App\Http\Requests\UpdateEditionRequest;
use App\Models\Edition;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class EditionController extends Controller
{
	public function index(): Collection
	{
		return Edition::query()->get();
	}


	public function show(Edition $edition): Edition
	{
		return $edition;
	}


	public function store(StoreEditionRequest $request, PersistEdition $action): Edition
	{
		$data = EditionData::fromFormRequest($request);
		return $action->execute(new Edition(), $data);
	}


	public function update(UpdateEditionRequest $request, Edition $edition, PersistEdition $action): Edition
	{
		$data = EditionData::fromFormRequest($request);
		return $action->execute($edition, $data);
	}


	public function destroy(Edition $edition): Response
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
		} catch (Exception $e) {
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
