<?php

namespace App;

use App\Http\Requests\RequestWithFileFields;
use App\Models\HasFileFields;

class FileFieldHandler
{
	/**
	 * @param Array<String, String> $fieldToPropertyMap
	 */
	public function __construct(private array $fieldToPropertyMap) { }


	public function updateModel(RequestWithFileFields $request, HasFileFields $model)
	{
		foreach ($this->fieldToPropertyMap as $fieldName => $propertyName) {
			if (! $request->has($fieldName)) {
				continue;
			}

			$this->updateModelFileProperty($request->getFileField($fieldName), $model, $propertyName);
		}
	}


	/**
	 * @param FileField[] $files
	 * @param HasFileFields $model
	 * @param string $property
	 */
	private function updateModelFileProperty(array $files, HasFileFields $model, string $property): void
	{
		if (empty($files)) {
			$model->removeFieldFiles($property);
			return;
		}

//		$filesToDelete = array_filter($files, fn($file) => $file->isDelete());
		$filesToUpload = array_filter($files, fn($file) => $file->isUpload());

		if (! empty($filesToUpload)) {
			$model->uploadFieldFiles($property, $filesToUpload);
		}
	}
}