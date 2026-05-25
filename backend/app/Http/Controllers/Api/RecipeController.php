<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Services\GoogleAIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RecipeController extends Controller
{
    public function __construct(
        private GoogleAIService $aiService,
    ) {}

    /**
     * Step 1: Get 3 recipe suggestions from AI.
     */
    public function suggestions(Request $request): JsonResponse
    {
        $request->validate([
            'ingredients' => 'required|string|min:2|max:500',
        ]);

        try {
            $suggestions = $this->aiService->generateSuggestions($request->input('ingredients'));

            return response()->json([
                'success' => true,
                'data'    => $suggestions,
            ]);

        } catch (\RuntimeException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);

        } catch (\Throwable $e) {
            Log::error('Suggestions generation failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server. Coba lagi.',
            ], 500);
        }
    }

    /**
     * Step 2: Generate full recipe for the selected suggestion.
     */
    public function generate(Request $request): JsonResponse
    {
        $request->validate([
            'ingredients' => 'required|string|min:2|max:500',
            'title'       => 'required|string|min:2|max:200',
        ]);

        try {
            $recipeData = $this->aiService->generateRecipe(
                $request->input('ingredients'),
                $request->input('title')
            );

            $recipeData['user_id'] = auth()->id();
            $recipeData['is_saved'] = false;
            $recipe = Recipe::create($recipeData);

            return response()->json([
                'success' => true,
                'data'    => $recipe,
            ], 201);

        } catch (\RuntimeException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);

        } catch (\Throwable $e) {
            Log::error('Recipe generation failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server. Coba lagi.',
            ], 500);
        }
    }

    /**
     * Toggle the saved status of a recipe.
     */
    public function toggleSave(Recipe $recipe): JsonResponse
    {
        if ($recipe->user_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $recipe->is_saved = !$recipe->is_saved;
        $recipe->save();

        return response()->json([
            'success' => true,
            'data'    => $recipe,
        ]);
    }

    /**
     * Get all saved recipes for the authenticated user.
     */
    public function saved(): JsonResponse
    {
        $recipes = Recipe::where('user_id', auth()->id())
            ->where('is_saved', true)
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $recipes,
        ]);
    }

    /**
     * Get all recipes (history) for the authenticated user.
     */
    public function index(): JsonResponse
    {
        $recipes = Recipe::where('user_id', auth()->id())
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $recipes,
        ]);
    }

    /**
     * Get a single recipe by ID.
     */
    public function show(Recipe $recipe): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $recipe,
        ]);
    }
}
