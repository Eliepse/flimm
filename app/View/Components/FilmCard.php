<?php
/** @noinspection PhpPropertyOnlyWrittenInspection */

namespace App\View\Components;

use App\Models\Film;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class FilmCard extends Component
{
	public string $title;
	public string $url;
	public string $filmmaker;
	public int $duration;
	public ?string $thumbnail;
	public ?string $description;


	/**
	 * Create a new component instance.
	 */
	public function __construct(private Film $film, public string $classes = "")
	{
		$this->title = $this->film->title;
		$this->url = route("film", $this->film);
		$this->filmmaker = $this->film->filmmaker;
		$this->duration = $this->film->duration;
		$this->thumbnail = $this->film->thumbnail?->getUrl();
		$this->description = $this->film->description;
	}


	/**
	 * Get the view / contents that represent the component.
	 */
	public function render(): View
	{
		return view('components.film-card');
	}
}
