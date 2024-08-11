<?php

namespace App\Http\Requests;

use App\FileField;
use App\Rules\FileFieldRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreEditionRequest extends FormRequest implements RequestWithFileFields
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
			"thumbnail" => [new FileFieldRule()],
			"program" => ["nullable", new FileFieldRule()],
			"poster" => ["nullable", new FileFieldRule()],
			"brochure" => ["nullable", new FileFieldRule()],
			"flyer" => ["nullable", new FileFieldRule()],
			"teaser_link" => ["url", "nullable"],
			"published_at" => ["nullable", "date_format:Y-m-d\TH:i:sO"],
			"open_at" => ["required_with:published_at", "nullable", "date_format:Y-m-d\TH:i:sO"],
			"close_at" => ["required_with:published_at", "nullable", "date_format:Y-m-d\TH:i:sO"],
		];
	}


	public function getFilesToUpload(string $field): array
	{
		if (! $this->shouldUpdateFileField($field)) {
			return [];
		}

		$fieldValue = $this->toArray()[$field] ?? [];
		$uploadablePayload = array_filter($fieldValue, fn($payload) => $payload["action"] === "UPLOAD" && is_file($payload["file"]));
		return array_map(fn($payload) => $payload["file"], $uploadablePayload);
	}


	public function shouldUpdateFileField(string $field): bool
	{
		return $this->has($field) && is_array($this->get($field));
	}


	public function getFileField(string $fieldName): array
	{
		return array_map(fn($file) => new FileField($file), $this->all()[$fieldName] ?? []);
	}
}
