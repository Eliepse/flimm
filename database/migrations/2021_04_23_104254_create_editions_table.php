<?php

use App\Models\Edition;
use App\Models\Film;
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
			$table->json("content")->comment("The content has to be in a json format, not html.");
			$table->date("open_at");
			$table->date("close_at");
			$table->dateTime("published_at");
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
