<?php

use App\Models\Edition;
use App\Models\Film;
use App\Models\Schedule;
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
		Schema::create('schedules', function (Blueprint $table) {
			$table->id();
			$table->string("title");
			$table->foreignIdFor(Edition::class);
			$table->json("content")->nullable();
			$table->dateTime("start_at");
			$table->timestamps();
		});

		Schema::create("edition_film", function (Blueprint $table) {
			$table->foreignIdFor(Schedule::class);
			$table->foreignIdFor(Film::class);
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('schedules');
		Schema::dropIfExists('edition_film');
	}
}
