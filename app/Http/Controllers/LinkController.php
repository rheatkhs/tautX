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
        ]);

        // Check if the short URL already exists in the database
        $existingLink = Link::where('short_url', $request->url)->first();

        if ($existingLink) {
            // If it exists, update the expanded URL with a new random string
            $randomString = Str::random(100);
            $serverUrl = url('/'); // e.g., "http://127.0.0.1:8000"
            $expandedUrl = $serverUrl . '/' . $randomString;

            $existingLink->update([
                'expanded_url' => $expandedUrl,
            ]);
        } else {
            // Generate a new secure expanded URL for a new entry
            $randomString = Str::random(100);
            $serverUrl = url('/');
            $expandedUrl = $serverUrl . '/' . $randomString;

            // Generate description (optional)
            $description = "Generated secure URL using a 100-character random string.";

            // Save new link entry
            $existingLink = Link::create([
                'short_url' => $request->url,
                'expanded_url' => $expandedUrl,
                'description' => $description,
            ]);
        }

        // Return response via Inertia
        return Inertia::render('home', [
            'expandedUrl' => $existingLink->expanded_url, // Pass the updated/generated URL to the frontend
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
