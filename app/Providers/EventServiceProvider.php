<?php

namespace App\Providers;

use App\Models\Article;
use App\Models\Edition;
use App\Models\Film;
use App\Observers\ArticleObserver;
use App\Observers\EditionObserver;
use App\Observers\FilmObserver;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        Article::observe(ArticleObserver::class);
		Edition::observe(EditionObserver::class);
		Film::observe(FilmObserver::class);
    }
}
