<?php

namespace App\Action;

use App\Data\EditionData;
use App\Models\Edition;

final readonly class PersistEdition
{
	public function __construct(private PersistModelFileFields $persistModelFileFieldsAction) { }

	public function execute(Edition $edition, EditionData $data): Edition
	{
		$edition->fill($data->toAttributes());
		$edition->saveOrFail();

		$this->persistModelFileFieldsAction->execute($edition, [
			"thumbnail" => $data->thumbnail,
			"program" => $data->program,
			"poster" => $data->poster,
			"brochure" => $data->brochure,
			"flyer" => $data->flyer,
		]);

		return $edition;
	}
}
