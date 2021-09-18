<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEditionsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('editions', function (Blueprint $table) {
			$table->id();
			$table->string("title");
			$table->string("slug")->unique();
			$table->text("presentation")->nullable();
			$table->string("teaser_link")->nullable();
			$table->date("open_at")->nullable();
			$table->date("close_at")->nullable();
			$table->dateTime("published_at")->nullable();
			$table->timestamps();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('editions');
	}
}
