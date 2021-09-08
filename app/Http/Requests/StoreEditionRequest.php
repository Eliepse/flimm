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
			"presentation" => ["string", "nullable"],
			"thumbnail" => ["image", "nullable"],
			"published_at" => ["nullable", "date_format:Y-m-d\TH:i:sO"],
			"open_at" => ["required_with:published_at", "nullable", "date_format:Y-m-d\TH:i:sO"],
			"close_at" => ["required_with:published_at", "nullable", "date_format:Y-m-d\TH:i:sO"],
//			"schedules" => ["required_with:published_at"],
//			"schedules.*.id" => ["nullable", "exists:film_schedules,id"],
//			"schedules.*.film_id" => ["required", "exists:films,id"],
//			"schedules.*.start_at" => ["required", "date_format:Y-m-d\TH:i:sO", "gte:open_at", "lte:close_at"],
		];
	}
}
