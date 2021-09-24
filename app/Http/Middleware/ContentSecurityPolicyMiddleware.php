<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ContentSecurityPolicyMiddleware
{
	/**
	 * Handle an incoming request.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @param \Closure $next
	 *
	 * @return mixed
	 */
	public function handle(Request $request, Closure $next)
	{
		/** @var Response $response */
		$response = $next($request);
		$response->header("Content-Security-Policy", "default-src 'self' " . env("CSP_DEFAULT_SRC", ""));
		return $response;
	}
}
