<?php

namespace Database\Seeders;

use App\Models\Film;
use Illuminate\Database\Seeder;

class FilmSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		(new Film([
			'title' => "LA GUERRE DES CENTIMES",
			'slug' => "la-guerre-des-centimes",
			'duration' => 37,
			'filmmaker' => "Nader Samir Ayach",
			'year' => 2019,
		]))->save();

		(new Film([
			'title' => "VIE ET MORT D’OSCAR PEREZ",
			'slug' => "vie-et-mort-doscar-perez",
			'duration' => 46,
			'filmmaker' => "Romain Champalaune",
			'year' => 2018,
		]))->save();

		(new Film([
			'title' => "HISTOIRE DE LA RÉVOLUTION",
			'slug' => "histoire-de-la-revolution",
			'duration' => 30,
			'filmmaker' => "Maxime Martinot",
			'year' => 2019,
		]))->save();

		(new Film([
			'title' => "LA FORÊT DE L’ESPACE",
			'slug' => "la-foret-de-lespace",
			'duration' => 30,
			'filmmaker' => "Victor Missud",
			'year' => 2019,
		]))->save();
	}
}
