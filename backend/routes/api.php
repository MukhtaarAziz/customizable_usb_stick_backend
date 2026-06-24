<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\PlatformController;
use App\Http\Controllers\GameImageController;
use App\Http\Controllers\UsbStickController;
use App\Http\Controllers\CustomerController;
use App\Http\Middleware\EnsureAdmin;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');

Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('platforms', PlatformController::class)->only(['index', 'show']);
Route::apiResource('games', GameController::class)->only(['index', 'show']);
Route::apiResource('usb-sticks', UsbStickController::class)->only(['index', 'show']);

// Customer routes - public register and view
Route::post('customers', [CustomerController::class, 'store']);
Route::get('customers/{customer}', [CustomerController::class, 'show']);
Route::get('governorates', [CustomerController::class, 'governorates']);

// Public access to an image via request (served from storage)
Route::get('games/{game}/images/{image}', [GameImageController::class, 'show']);
Route::get('games/{game}/images/{image}/thumbnail', [GameImageController::class, 'showThumbnail']);

Route::middleware(['auth:sanctum', EnsureAdmin::class])->group(function () {
    Route::apiResource('categories', CategoryController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('platforms', PlatformController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('games', GameController::class)->only(['store', 'update', 'destroy']);
    // Admin: upload and delete images for a game
    Route::post('games/{game}/images', [GameImageController::class, 'store']);
    Route::delete('games/{game}/images/{image}', [GameImageController::class, 'destroy']);
    // Admin: CRUD for usb sticks
    Route::post('usb-sticks', [UsbStickController::class, 'store']);
    Route::put('usb-sticks/{usb_stick}', [UsbStickController::class, 'update']);
    Route::delete('usb-sticks/{usb_stick}', [UsbStickController::class, 'destroy']);
    // Admin: Customer management
    Route::get('customers', [CustomerController::class, 'index']);
    Route::put('customers/{customer}', [CustomerController::class, 'update']);
    Route::delete('customers/{customer}', [CustomerController::class, 'destroy']);
});
