<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Notifications\Notifiable;

/**
 * Class User
 *
 * @package App\Models
 * @property-read int $id
 * @property string $email
 * @property string $firstname
 * @property string $lastname
 * @property string $role
 * @property string $password
 * @property string $remember_token
 */
class User extends Model implements \Illuminate\Contracts\Auth\Authenticatable
{
	use HasFactory, Notifiable, Authenticatable, Authorizable, CanResetPassword, MustVerifyEmail;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'firstname',
		'lastname',
		'role',
		'email',
		'password',
	];

	/**
	 * The attributes that should be hidden for arrays.
	 *
	 * @var array
	 */
	protected $hidden = [
		'password',
		'remember_token',
	];
}
