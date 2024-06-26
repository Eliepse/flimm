<?php

namespace App\Jobs;

use App\Events\AdminUserCreated;
use App\Models\User;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Hash;

class RegisterAdminUserJob
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public readonly string $email,
        public readonly string $firstname,
        public readonly string $lastname,
        public readonly string $password,
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $user = new User([
            "email" => $this->email,
            "firstname" => $this->firstname,
            "lastname" => $this->lastname,
            "role" => "admin",
            "password" => Hash::make($this->password),
        ]);

        $user->saveOrFail();

        AdminUserCreated::dispatch($user);
    }
}
