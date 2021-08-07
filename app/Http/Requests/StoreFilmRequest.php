<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFilmRequest extends FormRequest
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
			"title_override" => ["string", "nullable"],
			"duration" => ["required", "integer"],
			"synopsis" => ["string", "nullable"],
			"description" => ["string", "nullable"],
			"filmmaker" => ["required", "string"],
			"technical_members" => ["string", "nullable"],
			"gender" => ["string", "nullable"],
			"year" => ["required", "integer"],
			"production_name" => ["string", "nullable"],
			"country" => ["string", "nullable"],
			"other_technical_infos" => ["string", "nullable"],
			"website_link" => ["url", "nullable"],
			"video_link" => ["url", "nullable"],
			"trailer_link" => ["url", "nullable"],
			"imdb_id" => ["string", "nullable"],
		];
	}
}
