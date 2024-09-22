<?php

namespace App\Observers;

use App\Models\Edition;

class EditionObserver
{
	/**
	 * Handle the Edition "created" event.
	 *
	 * @param Edition $edition
	 *
	 * @return void
	 */
	public function created(Edition $edition)
	{
		//
	}


	/**
	 * Handle the Edition "updated" event.
	 *
	 * @param Edition $edition
	 *
	 * @return void
	 */
	public function updated(Edition $edition)
	{
		$edition->clearStaleContentImages();
	}


	/**
	 * Handle the Edition "deleted" event.
	 *
	 * @param Edition $edition
	 *
	 * @return void
	 */
	public function deleted(Edition $edition)
	{
		$edition->clearAllContentImages();
		$edition->removeBrochure();
		$edition->removeFlyer();
		$edition->removePoster();
		$edition->removeThumbnail();
	}


	/**
	 * Handle the Edition "restored" event.
	 *
	 * @param Edition $edition
	 *
	 * @return void
	 */
	public function restored(Edition $edition)
	{
		//
	}


	/**
	 * Handle the Edition "force deleted" event.
	 *
	 * @param Edition $edition
	 *
	 * @return void
	 */
	public function forceDeleted(Edition $edition)
	{
		$edition->clearAllContentImages();
		$edition->removeBrochure();
		$edition->removeFlyer();
		$edition->removePoster();
		$edition->removeThumbnail();
	}
}
