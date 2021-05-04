<?php

use App\Models\Film;
use App\Models\Personality;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePersonalitiesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('personalities', function (Blueprint $table) {
			$table->id();
			$table->string("firstname");
			$table->string("lastname");
			$table->timestamps();
		});

		Schema::create("film_personality", function (Blueprint $table) {
			$table->foreignIdFor(Film::class)
				->references("id")
				->on("films")
				->cascadeOnUpdate()
				->cascadeOnDelete();
			$table->foreignIdFor(Personality::class)
				->references("id")
				->on("personalities")
				->cascadeOnUpdate()
				->cascadeOnDelete();
			$table->string("title")->nullable();
			$table->unsignedInteger("order")->nullable();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('personalities');
		Schema::dropIfExists('film_personality');
	}
}
