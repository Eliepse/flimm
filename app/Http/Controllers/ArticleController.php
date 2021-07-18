<?php


namespace App\Http\Controllers;


use App\Models\Article;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ArticleController
{
	public function index(): View
	{
		return view("articlesIndex", ["articles" => Article::published()->get()]);
	}


	public function show(Article $article): View
	{
		if (! $article->isPublished()) {
			throw new ModelNotFoundException();
		}

		return view("article", ["article" => $article]);
	}
}