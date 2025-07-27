<?php
// app/Http/Middleware/CheckPermission.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckPermission
{
    public function handle(Request $req, Closure $next, $permission)
    {
        $user = $req->user();
        if (! $user || ! $user->hasPermission($permission)) {
            return response()->json(['error' => 'Forbidden'], 403);
        }
        return $next($req);
    }
}
