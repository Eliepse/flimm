<?php

namespace Database\Seeders;

use App\Repositories\SettingRepository;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run(SettingRepository $repository)
	{
		$repository->createMany([
			["name" => "socials", "value" => ["facebook" => null, "instagram" => null]],
			["name" => "header.text", "value" => "21 - 24.10.2021\nDOC - Paris"],
			["name" => "homepage.featuredImage", "isMedia" => true]]);
	}
}
