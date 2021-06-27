<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArticleRequest;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{

	public function index()
	{
		return Article::all();
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @param \Illuminate\Http\Request $request
	 *
	 * @return \Illuminate\Http\JsonResponse
	 * @throws \Throwable
	 */
	public function store(StoreArticleRequest $request)
	{
		$article = new Article($request->all(["title", "content", "published_at"]));
		$article->slug = $request->getSlug();

		$article->saveOrFail();

		return response()->json($article, 201);
	}


	/**
	 * Display the specified resource.
	 *
	 * @param \App\Models\Article $article
	 *
	 * @return Article
	 */
	public function show(Article $article)
	{
		return $article;
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @param \App\Models\Article $article
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, Article $article)
	{
		//
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param \App\Models\Article $article
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function destroy(Article $article)
	{
		//
	}
}
