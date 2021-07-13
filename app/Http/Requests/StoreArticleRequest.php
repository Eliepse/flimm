<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreArticleRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 *
	 * @return bool
	 */
	public function authorize()
	{
		return $this->user();
	}


	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules()
	{
		return [
			"title" => ["required", "string", "between:3,250"],
			"slug" => ["nullable", "string", "between:3,64", "unique:App\Models\Article,slug"],
			"excerpt" => ["nullable", "string", "max:250"],
			"content" => ["nullable", "array:time,blocks,version"],
			"published_at" => ["nullable", "date_format:Y-m-d\TH:i:sO"],
		];
	}


	public function getSlug(): string
	{
		$slug = trim($this->get("slug", ""));

		if (! empty($slug)) {
			return $slug;
		}

		return Str::slug(substr($this->get("title"), 0, 64));
	}
}