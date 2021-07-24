<?php


namespace App\Casts;


use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class SerializationCast implements CastsAttributes
{
	public function get($model, string $key, $value, array $attributes): mixed
	{
		if (is_string($value)) {
			return unserialize($value);
		}

		return null;
	}


	public function set($model, string $key, $value, array $attributes): ?string
	{
		if (empty($value)) {
			return null;
		}

		if (is_object($value)) {
			return null;
		}

		return serialize($value);
	}
}