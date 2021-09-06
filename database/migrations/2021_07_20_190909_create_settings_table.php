<?php

use App\Repositories\SettingRepository;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSettingsTable extends Migration
{
	public function __construct() { }


	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('settings', function (Blueprint $table) {
			$table->string("name")->unique();
			$table->string("value")->nullable();
			$table->boolean("isMedia")->default(false);
		});

		app(SettingRepository::class)->createMany([
			["name" => "socials.facebook", "value" => null],
			["name" => "socials.instagram", "value" => null],
			["name" => "header.text", "value" => "21 - 24.10.2021\nDOC - Paris"],
			["name" => "homepage.featuredImage", "isMedia" => true],
			["name" => "homepage.featuredImage.altText"],
			["name" => "homepage.featuredImage.link"],
		]);
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('settings');
	}
}
