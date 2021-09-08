<?php

namespace App\Providers;

use App\Models\Edition;
use App\Repositories\SettingRepository;
use Carbon\CarbonInterval;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Cache;
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

		$editionList = Cache::remember("editions_list", App::environment("local") ? CarbonInterval::second(0) : CarbonInterval::minutes(30), function () {
			return Edition::published()->get(["title", "slug"]);
		});

		View::share("editions_list", $editionList);
	}
}
