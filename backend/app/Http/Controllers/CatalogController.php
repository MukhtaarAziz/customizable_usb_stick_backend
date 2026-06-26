<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Program;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);
        $type = $request->query('type', 'all');
        $search = $request->query('search');

        $items = collect();

        if (in_array($type, ['all', 'game'])) {
            $query = Game::with(['category', 'platform', 'images']);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name_en', 'like', "%{$search}%")
                        ->orWhere('name_ar', 'like', "%{$search}%")
                        ->orWhere('tags', 'like', "%{$search}%");
                });
            }

            if ($platformId = $request->query('platform_id')) {
                $query->where('game_platform_id', $platformId);
            }

            if ($categoryId = $request->query('category_id')) {
                $query->where('category_id', $categoryId);
            }

            $query->orderBy('name_en');

            $games = $query->get()->map(function ($game) {
                $data = $game->toArray();
                $data['type'] = 'game';
                return $data;
            });

            $items = $items->concat($games);
        }

        if (in_array($type, ['all', 'program'])) {
            $query = Program::with(['category', 'platform', 'images']);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name_en', 'like', "%{$search}%")
                        ->orWhere('name_ar', 'like', "%{$search}%")
                        ->orWhere('tags', 'like', "%{$search}%");
                });
            }

            if ($platformId = $request->query('platform_id')) {
                $query->where('program_platform_id', $platformId);
            }

            if ($categoryId = $request->query('category_id')) {
                $query->where('category_id', $categoryId);
            }

            $query->orderBy('name_en');

            $programs = $query->get()->map(function ($program) {
                $data = $program->toArray();
                $data['type'] = 'program';
                return $data;
            });

            $items = $items->concat($programs);
        }

        $items = $items->sortBy('name_en')->values();

        $total = $items->count();
        $page = (int) $request->query('page', 1);
        $itemsForPage = $items->forPage($page, $perPage)->values();

        return response()->json([
            'data' => $itemsForPage,
            'meta' => [
                'current_page' => $page,
                'last_page' => max((int) ceil($total / $perPage), 1),
                'per_page' => $perPage,
                'total' => $total,
            ],
        ]);
    }
}
