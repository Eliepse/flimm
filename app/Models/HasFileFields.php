<?php

namespace App\Models;

use App\FileField;

interface HasFileFields
{
	/**
	 * @param string $property
	 * @param FileField[] $files
	 */
	public function uploadFieldFiles(string $property, array $files): void;


	/**
	 * @param string $property
	 * @param FileField[]|null $files - The property should be cleared when $files is ommited.
	 */
	public function removeFieldFiles(string $property, array $files = null): void;
}