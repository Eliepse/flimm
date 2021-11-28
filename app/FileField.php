<?php

namespace App;

use Symfony\Component\HttpFoundation\File\UploadedFile;

class FileField
{
	public const ACTION_DELETE = -1;
	public const ACTION_IDLE = 0;
	public const ACTION_UPDATE = 1;
	public const ACTION_UPLOAD = 2;
	private string $uid;
	private string $name;
	private ?UploadedFile $file;
	private int $action;


	public function __construct(array $data)
	{
		$this->uid = $data["uid"];
		$this->name = $data["name"];
		$this->file = $data["file"] ?? null;
		$this->action = match ($data["action"]) {
			"DELETE" => self::ACTION_DELETE,
			"UPDATE" => self::ACTION_UPDATE,
			"UPLOAD" => self::ACTION_UPLOAD,
			default => self::ACTION_IDLE,
		};
	}


	public function isUpload(): bool
	{
		return self::ACTION_UPLOAD === $this->action;
	}


	public function isDelete(): bool
	{
		return self::ACTION_DELETE === $this->action;
	}


	public function getFile(): UploadedFile
	{
		return $this->file;
	}
}