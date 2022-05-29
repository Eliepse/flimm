<?php

namespace App\View\Components;

use Illuminate\View\Component;

class Breadcrumb extends Component
{
	/**
	 * Create a new component instance.
	 *
	 * @param array $items
	 */
    public function __construct(public array $items = [])
    {
        //
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {
        return view('components.breadcrumb');
    }
}
