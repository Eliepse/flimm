<?php

namespace App\Data;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;

final readonly class ArticleData
{
	public function __construct(
		public string $title,
		public ?array $excerpt = null,
		public ?string $slug = null,
		public ?array $content = null,
		public ?Carbon $publishedAt = null,
		public UploadedFile|null|false $thumbnail = null,
	) {
	}

	public static function fromFormRequest(FormRequest $request): self
	{
		$hasThumbnailField = $request->has("thumbnail");
		$thumbnail = $request->file("thumbnail");

		return self::fromArray(
			array_merge(
				$request->validated(),
				["thumbnail" => $hasThumbnailField && null === $thumbnail ? false : $thumbnail],
			),
		);
	}

	public static function fromArray(array $input): self
	{
		$publishedAt = $input["published_at"] ?? null;

		if (null !== $publishedAt && ! ($publishedAt instanceof Carbon)) {
			$publishedAt = Carbon::make($input["published_at"]);
		}

		return new ArticleData(
			title: $input["title"],
			excerpt: $input["excerpt"] ?? null,
			slug: $input["slug"] ?? null,
			content: $input["content"] ?? null,
			publishedAt: $publishedAt,
			thumbnail: $input["thumbnail"] ?? null,
		);
	}

	public function toAttributes(): array
	{
		return [
			"title" => $this->title,
			"excerpt" => $this->excerpt,
			"slug" => $this->slug,
			"content" => $this->content,
			"published_at" => $this->publishedAt,
		];
	}
}
