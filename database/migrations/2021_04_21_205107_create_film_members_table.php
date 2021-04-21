<?php

use App\Models\Film;
use App\Models\FilmMember;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFilmMembersTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('film_members', function (Blueprint $table) {
			$table->id();
			$table->string("firstname");
			$table->string("lastname");
			$table->timestamps();
		});

		Schema::create("film_film_member", function (Blueprint $table) {
			$table->foreignIdFor(Film::class)
				->references("id")
				->on("films")
				->cascadeOnUpdate()
				->cascadeOnDelete();
			$table->foreignIdFor(FilmMember::class)
				->references("id")
				->on("film_members")
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
		Schema::dropIfExists('film_members');
	}
}
