<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEditionRequest extends FormRequest
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
			"slug" => ["nullable", "string", "between:3,64", "unique:App\Models\Edition,slug"],
			"thumbnail" => ["image", "nullable"],
			"program" => ["file", "nullable"],
			"poster" => ["file", "nullable"],
			"brochure" => ["file", "nullable"],
			"flyer" => ["file", "nullable"],
			"teaser_link" => ["url", "nullable"],
			"published_at" => ["nullable", "date_format:Y-m-d\TH:i:sO"],
			"open_at" => ["required_with:published_at", "nullable", "date_format:Y-m-d\TH:i:sO"],
			"close_at" => ["required_with:published_at", "nullable", "date_format:Y-m-d\TH:i:sO"],
		];
	}
}
