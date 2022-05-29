<?php


namespace App\Casts;


use App\EditorJSAttribute;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class EditorJSCast implements CastsAttributes
{
	public function get($model, string $key, $value, array $attributes): ?EditorJSAttribute
	{
		if(is_null($value)) {
			return null;
		}

		if (is_string($value)) {
			$value = json_decode($value, true);
		}

		return new EditorJSAttribute($value);
	}


	public function set($model, string $key, $value, array $attributes): ?string
	{
		if (empty($value)) {
			return null;
		}

		if (is_array($value)) {
			$value = new EditorJSAttribute($value);
		}

		if (! $value instanceof EditorJSAttribute) {
			throw new \InvalidArgumentException('The given value is not an EditorJSCast instance.');
		}

		return $value->toJson();
	}
}