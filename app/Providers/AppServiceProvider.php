<?php

namespace App\Providers;

use App\Models\Edition;
use App\Repositories\SettingRepository;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
	/**
	 * Register any application services.
	 *
	 * @return void
	 */
	public function register()
	{
		$this->app->singleton(SettingRepository::class);
	}


	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot()
	{
		Blade::directive('nl2br', function (string $expression) {
			return "<?php echo nl2br(e($expression)) ?>";
		});

		// Skip on console because the database is not yet migrated on first installation
		View::share("editions_list", App::runningInConsole() ? [] : Edition::published()->orderByDesc("open_at")->get(["id", "title", "slug"]));
	}
}
