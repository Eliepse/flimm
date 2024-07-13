<?php

namespace App\Data;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;

final readonly class FilmData
{
	public function __construct(
		public string $title,
		public string $slug,
		public int $duration,
		public string $year,
		public string $filmmaker,
		public UploadedFile|null $thumbnail = null,
		public ?string $titleOverride = null,
		public ?string $synopsis = null,
		public ?string $description = null,
		public ?string $productionName = null,
		public ?string $otherTechnicalInfos = null,
		public ?string $gender = null,
		public ?string $websiteLink = null,
		public ?string $trailerLink = null,
		public ?string $videoLink = null,
		public ?string $imdbId = null,
		public ?string $country = null,
	) { }

	public static function fromFormRequest(FormRequest $request): self
	{
		return self::fromArray(
			array_merge(
				$request->validated(),
				["thumbnail" => $request->hasFile("thumbnail") ? $request->file("thumbnail") : null],
			),
		);
	}

	public static function fromArray(array $input): self
	{
		return new FilmData(
			title: $input["title"],
			slug: $input["slug"],
			duration: $input["duration"],
			year: $input["year"],
			filmmaker: $input["filmmaker"],
			thumbnail: $input["thumbnail"] ?? null,
			titleOverride: $input["title_override"] ?? null,
			synopsis: $input["synopsis"] ?? null,
			description: $input["description"] ?? null,
			productionName: $input["production_name"] ?? null,
			otherTechnicalInfos: $input["other_technical_infos"] ?? null,
			gender: $input["gender"] ?? null,
			websiteLink: $input["website_link"] ?? null,
			trailerLink: $input["trailer_link"] ?? null,
			videoLink: $input["video_link"] ?? null,
			imdbId: $input["imdb_id"] ?? null,
			country: $input["country"] ?? null,
		);
	}

	public function toAttributes(): array
	{
		return [
			"title" => $this->title,
			"slug" => $this->slug,
			"title_override" => $this->titleOverride,
			"duration" => $this->duration,
			"synopsis" => $this->synopsis,
			"description" => $this->description,
			"filmmaker" => $this->filmmaker,
			"gender" => $this->gender,
			"year" => $this->year,
			"production_name" => $this->productionName,
			"country" => $this->country,
			"other_technical_infos" => $this->otherTechnicalInfos,
			"website_link" => $this->websiteLink,
			"video_link" => $this->videoLink,
			"trailer_link" => $this->trailerLink,
			"imdb_id" => $this->imdbId,
		];
	}
}
