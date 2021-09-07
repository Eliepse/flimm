<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFilmsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('films', function (Blueprint $table) {
			$table->id();
			$table->string("title");
			$table->string("slug")->unique();
			$table->string("title_override")->nullable();
			$table->unsignedSmallInteger("duration");
			$table->text("synopsis")->nullable();
			$table->text("description")->nullable();
			$table->string("filmmaker");
			$table->string("technical_members")->nullable();
			$table->string("gender")->nullable();
			$table->year("year");
			$table->string("production_name")->nullable();
			$table->string("country")->nullable();
			$table->string("other_technical_infos")->nullable();
			$table->string("website_link")->nullable();
			$table->string("video_link")->nullable();
			$table->string("trailer_link")->nullable();
			$table->string("imdb_id")->nullable();
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
		Schema::dropIfExists('films');
	}
}
