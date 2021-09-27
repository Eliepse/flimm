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
		$response->headers->set("Content-Security-Policy", "default-src 'self' 'unsafe-inline' https://unpkg.com https://fonts.gstatic.com " . env("CSP_DEFAULT_SRC", "") . "; child-src 'none';");
		return $response;
	}
}
