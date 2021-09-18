<?php

namespace Tests\Unit\Models;

use App\EditorJSAttribute;
use App\Models\Article;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleTest extends TestCase
{
	use RefreshDatabase;

	public function test_get_published_articles()
	{
		/** @var Article $published */
		$published = Article::factory()->create(["published_at" => Carbon::now()->subMonth()]);
		Article::factory()->create(["published_at" => Carbon::now()->addMonth()]);

		$this->assertCount(1, Article::published()->get());
		$this->assertTrue($published->is(Article::published()->first()));
	}


	public function test_content_is_an_object()
	{
		/** @var Article $article */
		$article = Article::factory()->create();
		$this->assertInstanceOf(EditorJSAttribute::class, $article->content);
	}
}
