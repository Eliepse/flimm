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
		Schema::disableForeignKeyConstraints();
		Schema::table('selections', function (Blueprint $table) {
			$table->text("intro")->nullable()->change();
		});
		Schema::enableForeignKeyConstraints();
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::disableForeignKeyConstraints();
		Schema::table('selections', function (Blueprint $table) {
			$table->string("intro")->nullable()->change();
		});
		Schema::enableForeignKeyConstraints();
	}
};
