<?php

use App\Models\Edition;
use App\Models\Film;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFilmSchedulesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('film_schedules', function (Blueprint $table) {
			$table->id();
			$table->foreignIdFor(Edition::class);
			$table->foreignIdFor(Film::class);
			$table->json("content")->nullable();
			$table->dateTime("start_at");
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
		Schema::dropIfExists('film_schedules');
	}
}
