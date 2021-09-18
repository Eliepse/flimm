@extends("layouts.root-public")

<?php
use App\Models\Article;

/**
 * @var Article $article
 */
?>

@section("main")
	<h1 class="mx-auto text-center my-24">Actus</h1>
	@include("common.actusList", ["articles" => $articles])
@endsection