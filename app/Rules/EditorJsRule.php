<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class EditorJsRule implements Rule
{
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

		// Non nullable, or not empty
		return is_array($value) && is_int($value["time"]) && is_array($value["blocks"]) && is_string($value["version"]);
	}


	/**
	 * Get the validation error message.
	 *
	 * @return string
	 */
	public function message(): string
	{
		return 'Le champs n\'est pas valide.';
	}
}
