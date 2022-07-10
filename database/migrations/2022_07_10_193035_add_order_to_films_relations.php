<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('film_session', function (Blueprint $table) {
			$table->dropColumn("order");
			$table->smallInteger("film_order")->default(0);
		});

		Schema::table('film_selection', function (Blueprint $table) {
			$table->smallInteger("film_order")->default(0);
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('film_session', function (Blueprint $table) {
			$table->smallInteger("order")->default(0);
			$table->dropColumn("film_order");
		});

		Schema::table('film_selection', function (Blueprint $table) {
			$table->dropColumn("film_order");
		});
	}
};
