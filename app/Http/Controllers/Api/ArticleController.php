<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Models\Article;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ArticleController extends Controller
{

	public function index(): Collection
	{
		return Article::all();
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @param StoreArticleRequest $request
	 *
	 * @return JsonResponse
	 * @throws \Throwable
	 */
	public function store(StoreArticleRequest $request): JsonResponse
	{
		$article = new Article($request->all(["title", "content", "published_at"]));
		$article->slug = $request->getSlug();

		$article->saveOrFail();

		return response()->json($article, 201);
	}


	/**
	 * Display the specified resource.
	 *
	 * @param Article $article
	 *
	 * @return Article
	 */
	public function show(Article $article): Article
	{
		return $article;
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param Request $request
	 * @param Article $article
	 *
	 * @return Response
	 */
	public function update(UpdateArticleRequest $request, Article $article): Article
	{
		$article->fill($request->all());
		$article->slug = $request->getSlug();
		$article->saveOrFail();

		return $article;
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param Article $article
	 *
	 * @return Response
	 */
	public function destroy(Article $article)
	{
		//
	}


	public function saveContentMedia(Request $request, Article $article)
	{
		try {
			$media = $article->saveContentImage("image");
		} catch (\Exception $exception) {
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
