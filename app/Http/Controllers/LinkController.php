<?php

namespace App\Http\Controllers;

use App\Models\Link;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class LinkController extends Controller
{
    public function expand(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
            'length' => 'required|integer|min:5|max:1000', // User must enter a length
        ]);

        $serverUrl = url('/');

        // Use user-defined length (default 100 if empty)
        $length = $request->length ?? 100;

        // Generate random string
        $randomString = Str::random($length);
        $expandedUrl = $serverUrl . '/' . $randomString;

        // Check if the short URL already exists
        $link = Link::where('short_url', $request->url)->first();

        if ($link) {
            $link->expanded_url = $expandedUrl;
            $link->save();
        } else {
            $link = Link::create([
                'short_url' => $request->url,
                'expanded_url' => $expandedUrl,
                'description' => "Generated secure URL with $length-character string.",
            ]);
        }

        return Inertia::render('home', [
            'expandedUrl' => $link->expanded_url,
        ]);
    }
    public function redirect($code)
    {
        $link = Link::where('expanded_url', url('/') . '/' . $code)->first();

        if ($link) {
            return redirect()->away($link->short_url);
        }

        return abort(404);
    }
}
