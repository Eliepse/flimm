<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpsertSettingRequest;
use App\Models\Setting;
use Illuminate\Database\Eloquent\Collection;

class SettingController extends Controller
{
	public function index(): Collection
	{
		return Setting::all();
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param UpsertSettingRequest $request
	 *
	 * @return Setting
	 * @throws \Exception
	 */
	public function upsert(UpsertSettingRequest $request): Setting
	{
		$setting = $request->setting;
		$setting->value = $request->value;

		if ($setting->isMedia) {
			if ($request->hasFile("value")) {
				$setting->saveMedia($request->file("value"));
			} else {
				$setting->removeMedia();
			}
		}

		$setting->save();

		return $setting;
	}
}
