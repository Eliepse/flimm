<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateArticleRequest extends FormRequest
{
	protected function prepareForValidation()
	{
		$this->merge([
			'content' => json_decode($this->input("content"), true),
		]);
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
			"slug" => ["nullable", "string", "between:3,64", Rule::unique("App\Models\Article", "slug")->ignoreModel($this->article)],
			"excerpt" => ["nullable", "string", "max:250"],
			"content" => ["required", "array:time,blocks,version"],
			"published_at" => ["nullable", "date_format:Y-m-d\TH:i:sO"],
			"thumbnail" => ["nullable", "image"],
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


	public function getThumbnail(): ?UploadedFile
	{
		return Arr::wrap($this->file("thumbnail"))[0] ?? null;
	}
}
