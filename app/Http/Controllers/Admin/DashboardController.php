<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
	public function content(): array
	{
		return [
			"supportEmail" => env("SUPPORT_EMAIL"),
			"analyticsUrl" => env("ANALYTICS_URL"),
		];
	}
}
