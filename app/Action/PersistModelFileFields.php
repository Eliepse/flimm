<?php

namespace App\Action;

use App\FileField;
use App\Models\HasFileFields;

final readonly class PersistModelFileFields
{
	public function __construct(private PersistModelFileField $persistModelFileFieldAction) { }

	/**
	 * @param  HasFileFields  $model
	 * @param  array<string, array<FileField>>  $fileDirectivesPerAttribute
	 *
	 * @return void
	 */
	public function execute(HasFileFields $model, array $fileDirectivesPerAttribute): void
	{
		foreach ($fileDirectivesPerAttribute as $attribute => $fileDirectives) {
			$this->persistModelFileFieldAction->execute($model, $attribute, $fileDirectives);
		}
	}
}
