<?php

namespace App\Http\Requests;

use App\Models\Edition;
use App\Rules\EditorJsRule;

/**
 * @property-read Edition $edition
 * @property-read ?array $description
 */
class UpdateSessionRequest extends StoreSessionRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules(): array
	{
		return array_merge(parent::rules(), [
			"description" => [new EditorJsRule()],
		]);
	}
}
