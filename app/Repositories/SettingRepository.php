<?php


namespace App\Repositories;


use App\Models\Setting;
use Illuminate\Cache\ArrayStore;
use Illuminate\Log\Logger;
use Illuminate\Support\Collection;

class SettingRepository
{
	private ArrayStore $cache;


	public function __construct(Logger $logger)
	{
		$logger->debug("Initialize SettingRepository");
		$this->cache = new ArrayStore();
		$this->cacheMany(Setting::query()->get());
	}


	public function get(string $name): ?Setting
	{
		if ($setting = $this->cache->get($name)) {
			return $setting;
		}

		return null;
	}


	public function create(string $name, mixed $value): Setting
	{
		if ($this->cache->get($name)) {
			throw new \Exception("The setting '$name' cannot be created because it already exists.");
		}

		$setting = new Setting(["name" => $name, "value" => $value]);
		$setting->save();

		$this->cache->forever($name, $setting);

		return $setting;
	}


	public function createMany(array $raw_settings): Collection
	{
		$settings = collect();

		foreach ($raw_settings as $raw_setting) {
			$setting = new Setting($raw_setting);

			if (! $setting->save()) {
				throw new \Error("Error while creating many settings, one setting might already exists");
			}

			$settings->push($setting);
		}

		$this->cacheMany($settings);
		return $settings;
	}


	public function update(string $name, mixed $value): Setting
	{
		if (! $setting = $this->cache->get($name)) {
			throw new \Exception("The setting '$name' cannot be udpated because it does not exists.");
		}

		$setting->value = $value;
		$setting->save();
		return $setting;
	}


	public function upsert(string $name, mixed $value): Setting
	{
		if ($this->cache->get($name)) {
			return $this->update($name, $value);
		}

		return $this->create($name, $value);
	}


	private function cacheMany(Collection $settings)
	{
		$settings->each(fn(Setting $setting) => $this->cache->forever($setting->name, $setting));
	}
}