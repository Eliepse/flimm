<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateUserCommand extends Command
{
	protected $signature = 'user:create';
	protected $description = 'Create a new user';


	public function handle(): int
	{
		$user = new User([
			"email" => $this->ask("Email"),
			"firstname" => $this->ask("Firstname"),
			"lastname" => $this->ask("Lastname"),
			"role" => $this->choice("Role", ["admin", "visitor"], "visitor"),
			"password" => $this->secret("Password"),
		]);

		$validator = Validator::make($user->getAttributes(), [
			"email" => "required|email|unique:App\Models\User,email",
			"firstname" => "required|between:2,50",
			"lastname" => "required|between:2,50",
			"role" => "required|in:admin,visitor",
			"password" => "required|between:8,32",
		]);

		if ($validator->fails()) {
			foreach ($validator->errors()->all() as $error) {
				$this->error($error);
			}
			return 1;
		}

		$user->password = Hash::make($user->password);

		$user->saveOrFail();

		return 0;
	}
}
