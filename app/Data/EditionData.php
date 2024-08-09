<?php

namespace App\Data;

use App\FileField;
use App\Http\Requests\RequestWithFileFields;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

final readonly class EditionData
{
	/**
	 * @param  string  $title
	 * @param  string  $slug
	 * @param  array<FileField>  $thumbnail
	 * @param  array|null  $presentation
	 * @param  array<FileField>|null  $program
	 * @param  array<FileField>|null  $poster
	 * @param  array<FileField>|null  $brochure
	 * @param  array<FileField>|null  $flyer
	 * @param  string|null  $teaserLink
	 * @param  Carbon|null  $publishedAt
	 * @param  Carbon|null  $openAt
	 * @param  Carbon|null  $closeAt
	 */
	public function __construct(
		public string $title,
		public string $slug,
		public array $thumbnail,
		public ?array $presentation = null,
		public array|null $program = null,
		public array|null $poster = null,
		public array|null $brochure = null,
		public array|null $flyer = null,
		public ?string $teaserLink = null,
		public ?Carbon $publishedAt = null,
		public ?Carbon $openAt = null,
		public ?Carbon $closeAt = null,
	) {
	}

	public static function fromFormRequest(FormRequest&RequestWithFileFields $request): self
	{
		return self::fromArray(
			array_merge(
				$request->validated(),
				[
					"thumbnail" => $request->getFileField("thumbnail"),
					"program" => $request->getFileField("program"),
					"poster" => $request->getFileField("poster"),
					"brochure" => $request->getFileField("brochure"),
					"flyer" => $request->getFileField("flyer"),
				],
			),
		);
	}

	public static function fromArray(array $input): self
	{
		return new EditionData(
			title: $input["title"],
			slug: $input["slug"],
			thumbnail: $input["thumbnail"],
			presentation: $input["presentation"] ?? null,
			program: $input["program"] ?? null,
			poster: $input["poster"] ?? null,
			brochure: $input["brochure"] ?? null,
			flyer: $input["flyer"] ?? null,
			teaserLink: $input["teaser_link"] ?? null,
			publishedAt: ! empty($input["published_at"]) ? Carbon::make($input["published_at"]) : null,
			openAt: ! empty($input["open_at"]) ? Carbon::make($input["open_at"]) : null,
			closeAt: ! empty($input["close_at"]) ? Carbon::make($input["close_at"]) : null,
		);
	}

	public function toAttributes(): array
	{
		return [
			"title" => $this->title,
			"slug" => $this->slug,
			"presentation" => $this->presentation,
			"teaserLink" => $this->teaserLink,
			"published_at" => $this->publishedAt,
			"open_at" => $this->openAt,
			"close_at" => $this->closeAt,
		];
	}
}
