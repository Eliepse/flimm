<?php

namespace App\Models;

use App\Casts\SerializationCast;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Class Setting
 *
 * @package App\Models
 * @property-read string $name
 * @property Media|mixed $value
 * @property bool $isMedia
 */
class Setting extends Model implements HasMedia
{
	use HasFactory, InteractsWithMedia;

	protected $keyType = "string";
	protected $primaryKey = "name";
	public $timestamps = false;
	protected $casts = ["value" => SerializationCast::class, "isMedia" => "bool"];
	protected $fillable = ["name", "value"];
	protected $hidden = ["value", "media"];


	public function registerMediaCollections(): void
	{
		$this
			->addMediaCollection('settings')
			->useDisk("media")
			->singleFile();
	}


	/** @noinspection PhpUnused */
	public function getValueAttribute(): mixed
	{
		if ($this->isMedia) {
			return $this->getValueAsMedia();
		}

		return $this->castAttribute("value", $this->attributes["value"] ?? null);
	}


	public function getIsMediaAttribute(): bool
	{
		return $this->attributes["isMedia"] ?? false;
	}


	private function getValueAsMedia(): ?Media
	{
		return $this->getFirstMedia("settings");
	}


	public function saveMedia(UploadedFile $media): Media
	{
		if (! $this->isMedia) {
			throw new \Exception("The setting '$this->name' does not accept image.");
		}

		return $this->addMedia($media)->toMediaCollection("settings");
	}


	public function toArray()
	{
		return array_merge([
			"name" => $this->name,
			"value" => $this->isMedia ? $this->getValueAsMedia()?->getFullUrl() : $this->value,
		]);
	}
}
