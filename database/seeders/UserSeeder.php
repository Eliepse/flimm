<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		(new User([
			'firstname' => "Elie",
			'lastname' => "Meignan",
			'role' => "admin",
			'email' => "contact@eliepse.fr",
			'password' => Hash::make("password"),
		]))->save();
	}
}
