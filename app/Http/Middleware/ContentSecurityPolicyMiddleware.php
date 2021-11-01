<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ContentSecurityPolicyMiddleware
{
	/**
	 * Handle an incoming request.
	 */
	public function handle(Request $request, Closure $next): Response
	{
		/** @var Response $response */
		$response = $next($request);
		$env_csp = env("CSP_DEFAULT_SRC", "");

		$csps = [
			"default-src" => "'self' 'unsafe-inline' blob: data: https://unpkg.com https://fonts.gstatic.com $env_csp",
			"frame-src" => "frame-src https:",
		];

		$csp_segments = array_map(fn($key, $val) => "$key $val", array_keys($csps), array_values($csps));

		$response->headers->set("Content-Security-Policy", join("; ", $csp_segments));
		return $response;
	}
}
