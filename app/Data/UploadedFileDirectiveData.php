<?php

namespace App\Data;

use Symfony\Component\HttpFoundation\File\File;

final readonly class UploadedFileDirectiveData
{
	public function __construct(
		public string $action,
		public ?File $file,
		public ?string $uid,
	)
	{
	}

	public static function fromField(array $data): static
	{
		return new UploadedFileDirectiveData(
			action: $data["action"],
			file: $data["file"],
			uid: $data["uid"],
		);
	}
}
