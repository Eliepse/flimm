<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSelectionsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up(): void
	{
		Schema::create('selections', function (Blueprint $table) {
			$table->id();
			$table->string("name");
			$table->foreignId("edition_id")->constrained();
			$table->timestamps();
		});

		Schema::create('film_selection', function (Blueprint $table) {
			$table->foreignId("film_id")
				->constrained()
				->cascadeOnUpdate()
				->cascadeOnDelete();

			$table->foreignId("selection_id")
				->constrained()
				->cascadeOnUpdate()
				->cascadeOnDelete();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down(): void
	{
		Schema::dropIfExists('selections');
		Schema::dropIfExists('film_selection');
	}
}
