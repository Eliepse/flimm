<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @property-read string $name
 * @property-read int[] $films
 */
class StoreSelectionRequest extends FormRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules(): array
	{
		return [
			"name" => "required|string|max:200",
			"films" => "required|array|min:0",
			"films.*" => "integer|numeric|distinct|exists:App\Models\Film,id",
		];
	}
}
