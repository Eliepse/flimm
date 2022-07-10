<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class EditorJsRule implements Rule
{
	private string $errorMessage;


	/**
	 * Create a new rule instance.
	 *
	 * @return void
	 */
	public function __construct(private bool $nullable = true) { }


	/**
	 * Determine if the validation rule passes.
	 *
	 * @param string $attribute
	 * @param mixed $value
	 *
	 * @return bool
	 */
	public function passes($attribute, $value): bool
	{
		if ($this->nullable && empty($value)) {
			return true;
		}

		if (! is_array($value)) {
			$this->errorMessage = "The value should be an array.";
			return false;
		}

		if (! is_numeric($value["time"])) {
			$this->errorMessage = "The time should be an number.";
			return false;
		}

		if (! is_array($value["blocks"])) {
			$this->errorMessage = "The blocks should be an array.";
			return false;
		}

		if (! is_string($value["version"])) {
			$this->errorMessage = "The version should be a string.";
			return false;
		}

		return true;
	}


	/**
	 * Get the validation error message.
	 *
	 * @return string
	 */
	public function message(): string
	{
		return $this->errorMessage ?? 'Le champs n\'est pas valide.';
	}
}
