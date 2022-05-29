<?php

namespace App\Http\Requests;

use App\FileField;

interface RequestWithFileFields
{
	/**
	 * @param string|array $key
	 *
	 * @return bool
	 * @noinspection PhpMissingReturnTypeInspection
	 * @noinspection PhpMissingParamTypeInspection
	 */
	public function has($key);


	/**
	 * @param string $fieldName
	 *
	 * @return FileField[]
	 */
	public function getFileField(string $fieldName): array;
}