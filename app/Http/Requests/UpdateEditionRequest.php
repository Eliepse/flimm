<?php

namespace App\Http\Requests;

use App\Models\Edition;
use Illuminate\Validation\Rule;

/**
 * @property-read Edition $edition
 */
class UpdateEditionRequest extends StoreEditionRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules(): array
	{
		return array_merge(parent::rules(), [
			"slug" => [
				"required",
				"string",
				"between:3,64",
				Rule::unique("editions", "slug")->ignoreModel($this->edition, "slug"),
			],
		]);
	}
}
