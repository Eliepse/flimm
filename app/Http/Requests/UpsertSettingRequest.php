<?php

namespace App\Http\Requests;

use App\Models\Setting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;

/**
 * Class UpsertSettingRequest
 *
 * @package App\Http\Requests
 * @property-read string $name
 * @property-read UploadedFile|string|mixed $value
 */
class UpsertSettingRequest extends FormRequest
{
	public Setting $setting;


	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array
	 */
	public function rules(): array
	{
		$this->setting = $this->getSetting();

		return [
			"value" => ["present", "nullable", $this->isMedia() ? "file" : ""],
		];
	}


	public function getSetting(): Setting
	{
		$name = $this->name;
		return Setting::query()->find($name) ?? new Setting(["name" => $name, "isMedia" => $this->hasFile("value")]);
	}


	public function isMedia(): bool
	{
		return $this->setting->isMedia;
	}
}
