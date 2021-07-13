<?php


namespace App;


use App\Casts\ArticleContentCast;
use Carbon\Carbon;
use Illuminate\Contracts\Database\Eloquent\Castable;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Jsonable;
use Illuminate\Support\Collection;

class ArticleContent implements Jsonable, Arrayable, Castable
{
	private Carbon $time;
	private array $blocks;
	private string $version;


	public function __construct(private array $raw)
	{
		if (empty($this->raw["time"])) {
			throw new \InvalidArgumentException('Invalid time for ArticleContent.');
		}

		if (! isset($this->raw["version"]) || ! is_array($this->raw["blocks"])) {
			throw new \InvalidArgumentException('Invalid blocks for ArticleContent.');
		}

		if (! is_string($this->raw["version"]) || empty($this->raw["version"])) {
			throw new \InvalidArgumentException('Invalid version for ArticleContent.');
		}

		$this->time = Carbon::createFromTimestamp($this->raw["time"]);
		$this->blocks = $this->raw["blocks"];
		$this->version = $this->raw["version"];
	}


	/**
	 * @return Carbon
	 */
	public function getTime(): Carbon
	{
		return $this->time;
	}


	/**
	 * @return array
	 */
	public function getBlocks(): array
	{
		return $this->blocks;
	}


	/**
	 * @return string
	 */
	public function getVersion(): string
	{
		return $this->version;
	}


	public function getBlocksByType(string $type): Collection
	{
		return collect($this->getBlocks())->filter(fn($block) => $block["type"] === $type);
	}


	public function toJson($options = 0): string
	{
		return json_encode($this->toArray(), $options | JSON_FORCE_OBJECT);
	}


	public function toArray(): array
	{
		return $this->raw;
	}


	public static function castUsing(array $arguments)
	{
		return ArticleContentCast::class;
	}
}