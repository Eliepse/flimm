<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSessionRequest;
use App\Http\Requests\UpdateSessionRequest;
use App\Models\Session;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class SessionController extends Controller
{
	public function index(): Collection
	{
		return Session::query()->get();
	}


	public function show(Session $session): array
	{
		return array_merge($session->toArray(), ["films" => $session->films->pluck("id")]);
	}


	public function store(StoreSessionRequest $request): Session
	{
		$session = new Session($request->validated());
		$session->save();

		if ($editionId = $request->get("edition_id")) {
			$session->edition()->associate($editionId);
		}

		if ($films = $request->get("films")) {
			$session->films()->sync($films);
		}

		return $session;
	}


	public function update(UpdateSessionRequest $request, Session $session): array
	{
		$session->fill($request->validated());
		$session->save();

		if ($request->has("edition_id")) {
			if ($editionId = $request->get("edition_id")) {
				$session->edition()->associate($editionId);
			} else {
				$session->edition()->dissociate();
			}
		}

		if ($films = $request->get("films")) {
			$session->films()->sync(array_combine($films, array_map(fn($order) => ["film_order" => $order], array_keys($films))));
		}

		return array_merge($session->refresh()->toArray(), ["films" => $session->films->pluck("id")]);
	}


	public function destroy(Session $session)
	{
		if ($session->delete()) {
			return response()->noContent();
		}

		throw new HttpException(500, "Entity deletion didn't succeed");
	}


	public function saveContentMedia(Request $request, Session $session): JsonResponse
	{
		try {
			$media = $session->saveContentImage("image");
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
