<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RecipeController;
use Illuminate\Support\Facades\Route;

// Auth routes (public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login/guest', [AuthController::class, 'loginGuest']);

// Auth routes (protected)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Recipe routes
    Route::post('/recipes/suggestions', [RecipeController::class, 'suggestions']);
    Route::post('/recipes', [RecipeController::class, 'generate']);
    Route::post('/recipes/{recipe}/toggle-save', [RecipeController::class, 'toggleSave']);
    Route::get('/recipes/saved', [RecipeController::class, 'saved']);
    Route::get('/recipes', [RecipeController::class, 'index']);
    Route::get('/recipes/{recipe}', [RecipeController::class, 'show']);
});
