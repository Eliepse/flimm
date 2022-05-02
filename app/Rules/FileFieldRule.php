<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class FileFieldRule implements Rule
{
	const ACTION_UPLOAD = "UPLOAD";
	const ACTION_UPDATE = "UPDATE";
	const ACTION_DELETE = "DELETE";

	private static array $ACTIONS = [self::ACTION_UPLOAD, self::ACTION_UPDATE, self::ACTION_DELETE];

	private string $error;


	public function __construct() { }


	public function passes($attribute, $value): bool
	{
		if (! is_array($value)) {
			$this->error = "Le champ doit être une liste de fichier (array).";
			return false;
		}

		foreach ($value as $key => $payload) {
			if (! $this->validatePayload($key, $payload)) {
				return false;
			}
		}

		return true;
	}


	private function validatePayload($key, $payload): bool
	{
		if (! is_array($payload)) {
			$this->error = "Le fichier n. $key doit être une liste de paramètres.";
			return false;
		}

		$action = $payload["action"] ?? "";

		if (! $action || ! in_array($action, self::$ACTIONS, true)) {
			$this->error = "Action '$action' invalide pour le fichier n. $key";
			return false;
		}

		if (self::ACTION_UPLOAD === $action && ! is_file($payload["file"])) {
			$this->error = "Le fichier n. $key à enregistrer est manquant.";
			return false;
		}

		if (self::ACTION_UPDATE === $action && empty($payload["uid"])) {
			$this->error = "Identifiant manquant pour le fichier n. $key mettre à jour.";
			return false;
		}

		return true;
	}


	public function message(): string
	{
		if ($this->error) {
			return $this->error;
		}

		return "Le champ n'est pas valide.";
	}
}
