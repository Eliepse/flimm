<?php

namespace App\Console\Commands;

use App\Jobs\RegisterAdminUserJob;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

class CreateAdminUserCommand extends Command
{
    protected $signature = 'user:create-admin';
    protected $description = 'Create a new user';


    public function handle(): int
    {
        $userData = [
            "email" => $this->ask("Email"),
            "firstname" => $this->ask("Firstname"),
            "lastname" => $this->ask("Lastname"),
            "password" => $this->secret("Password"),
        ];

        $validator = Validator::make($userData, [
            "email" => "required|email|unique:App\Models\User,email",
            "firstname" => "required|between:2,50",
            "lastname" => "required|between:2,50",
            "password" => "required|between:8,32",
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }
            return 1;
        }

        RegisterAdminUserJob::dispatchSync(
	        $validator->safe()->string("email"),
	        $validator->safe()->string("firstname"),
	        $validator->safe()->string("lastname"),
	        $validator->safe()->string("password"),
        );

        return 0;
    }
}
