<?php
/** @noinspection PhpPropertyOnlyWrittenInspection */

namespace App\View\Components;

use App\Models\Film;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class FilmCard extends Component
{
	public string $title;
	public string $url;
	public string $filmmaker;
	public int $duration;
	public ?string $thumbnail;


	/**
	 * Create a new component instance.
	 *
	 * @param Film $film
	 */
	public function __construct(private Film $film)
	{
		$this->title = $this->film->title;
		$this->url = route("film", $this->film);
		$this->filmmaker = $this->film->filmmaker;
		$this->duration = $this->film->duration;
		$this->thumbnail = $this->film->thumbnail?->getUrl();
	}


	/**
	 * Get the view / contents that represent the component.
	 */
	public function render(): View
	{
		return view('components.film-card');
	}
}
