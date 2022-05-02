<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSessionsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('sessions', function (Blueprint $table) {
			$table->id();
			$table->string("title");
			$table->json("description")->nullable();
			$table->string("location");
			$table->unsignedSmallInteger("duration");
			$table->unsignedBigInteger("edition_id")->nullable();
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
		Schema::dropIfExists('session');
	}
}
