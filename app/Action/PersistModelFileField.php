<?php

namespace App\Action;

use App\FileField;
use App\Models\HasFileFields;

final readonly class PersistModelFileField
{
	/**
	 * @param  HasFileFields  $model
	 * @param  string  $modelProperty
	 * @param  Array<FileField>  $fileDirectives
	 *
	 * @return void
	 */
	public function execute(HasFileFields $model, string $modelProperty, array $fileDirectives): void
	{
		if (empty($fileDirectives)) {
			$model->removeFieldFiles($modelProperty);
			return;
		}

		$filesToUpload = array_filter($fileDirectives, fn($file) => $file->isUpload());

		if (! empty($filesToUpload)) {
			$model->uploadFieldFiles($modelProperty, $filesToUpload);
		}
	}
}
