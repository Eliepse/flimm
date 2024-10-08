<?php

namespace App\Http\Controllers\Api;

use App\Action\PersistArticle;
use App\Data\ArticleData;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Models\Article;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ArticleController extends Controller
{

	public function index(): Collection
	{
		return Article::all();
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @param  StoreArticleRequest  $request
	 *
	 * @return JsonResponse
	 * @throws \Throwable
	 */
	public function store(StoreArticleRequest $request, PersistArticle $action): JsonResponse
	{
		$data = ArticleData::fromFormRequest($request);
		$article = $action->execute(new Article(), $data);

		return response()->json($article, 201);
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  Article  $article
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
	 * @param  UpdateArticleRequest  $request
	 * @param  Article  $article
	 *
	 * @return Article
	 */
	public function update(UpdateArticleRequest $request, Article $article, PersistArticle $action): Article
	{
		$data = ArticleData::fromFormRequest($request);
		$action->execute($article, $data);

		return $article;
	}


	public function destroy(Article $article): Response
	{
		if ($article->delete()) {
			return response()->noContent();
		}

		throw new HttpException(500, "Entity deletion didn't succeed");
	}


	public function saveContentMedia(Request $request, Article $article): JsonResponse
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
			],
		], 201);
	}
}
