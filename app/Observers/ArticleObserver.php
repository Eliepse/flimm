<?php

namespace App\Observers;

use App\Models\Article;

class ArticleObserver
{
	/**
	 * Handle the Article "created" event.
	 *
	 * @param \App\Models\Article $article
	 *
	 * @return void
	 */
	public function created(Article $article)
	{
		//
	}


	/**
	 * Handle the Article "updated" event.
	 *
	 * @param \App\Models\Article $article
	 *
	 * @return void
	 */
	public function updated(Article $article)
	{
		$article->clearStaleContentImages();
	}


	/**
	 * Handle the Article "deleted" event.
	 *
	 * @param \App\Models\Article $article
	 *
	 * @return void
	 */
	public function deleted(Article $article)
	{
		$article->clearAllContentImages();
		$article->clearMediaCollection("thumbnail");
	}


	/**
	 * Handle the Article "restored" event.
	 *
	 * @param \App\Models\Article $article
	 *
	 * @return void
	 */
	public function restored(Article $article)
	{
		//
	}


	/**
	 * Handle the Article "force deleted" event.
	 *
	 * @param \App\Models\Article $article
	 *
	 * @return void
	 */
	public function forceDeleted(Article $article)
	{
		$article->clearAllContentImages();
		$article->clearMediaCollection("thumbnail");
	}
}
