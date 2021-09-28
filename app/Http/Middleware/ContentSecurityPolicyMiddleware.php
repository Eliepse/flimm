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
		$response->headers->set("Content-Security-Policy", "default-src 'self' 'unsafe-inline' https://unpkg.com https://fonts.gstatic.com " . env("CSP_DEFAULT_SRC", "") . "; frame-src https:;");
		return $response;
	}
}
