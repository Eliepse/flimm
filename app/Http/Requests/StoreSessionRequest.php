<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSessionRequest extends FormRequest
{
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules(): array
	{
		return [
			"title" => ["required", "string", "nullable"],
			"start_at" => ["nullable", "date_format:Y-m-d\TH:i:sO"],
			"edition_id" => [Rule::exists("editions", "id"), "nullable"],
			"location" => ["required", "string"],
			"duration" => ["required", "int"],
		];
	}
}
