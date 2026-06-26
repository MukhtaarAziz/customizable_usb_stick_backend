<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameCategoryController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\GamePlatformController;
use App\Http\Controllers\GameImageController;
use App\Http\Controllers\GamePackageController;
use App\Http\Controllers\UsbStickController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\UsbStickOrderController;
use App\Http\Controllers\ProgramCategoryController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ProgramPlatformController;
use App\Http\Controllers\ProgramImageController;
use App\Http\Controllers\ProgramPackageController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CategoryController;
use App\Http\Middleware\EnsureAdmin;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');

Route::apiResource('game-categories', GameCategoryController::class)->only(['index', 'show']);
Route::apiResource('game-platforms', GamePlatformController::class)->only(['index', 'show']);
Route::apiResource('games', GameController::class)->only(['index', 'show']);
Route::apiResource('game-packages', GamePackageController::class)->only(['index', 'show']);
Route::apiResource('program-categories', ProgramCategoryController::class)->only(['index', 'show']);
Route::apiResource('program-platforms', ProgramPlatformController::class)->only(['index', 'show']);
Route::apiResource('programs', ProgramController::class)->only(['index', 'show']);
Route::apiResource('program-packages', ProgramPackageController::class)->only(['index', 'show']);
Route::get('catalog', [CatalogController::class, 'index']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('usb-sticks', UsbStickController::class)->only(['index', 'show']);

// Customer routes - public register and view
Route::post('customers', [CustomerController::class, 'store']);
Route::get('customers/{customer}', [CustomerController::class, 'show']);
Route::get('governorates', [CustomerController::class, 'governorates']);

// USB Stick Order routes (authenticated customers)
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('usb-stick-orders', UsbStickOrderController::class);
});

// Public access to images via request (served from storage)
Route::get('games/{game}/images/{game_image}', [GameImageController::class, 'show']);
Route::get('games/{game}/images/{game_image}/thumbnail', [GameImageController::class, 'showThumbnail']);
Route::get('programs/{program}/images/{program_image}', [ProgramImageController::class, 'show']);
Route::get('programs/{program}/images/{program_image}/thumbnail', [ProgramImageController::class, 'showThumbnail']);

Route::middleware(['auth:sanctum', EnsureAdmin::class])->group(function () {
    Route::apiResource('game-categories', GameCategoryController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('game-platforms', GamePlatformController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('games', GameController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('game-packages', GamePackageController::class)->only(['store', 'update', 'destroy']);
    // Admin: increment views and orders for packages
    Route::post('game-packages/{game_package}/views', [GamePackageController::class, 'incrementViews']);
    Route::post('game-packages/{game_package}/orders', [GamePackageController::class, 'incrementOrders']);
    // Admin: upload and delete images for a game
    Route::post('games/{game}/images', [GameImageController::class, 'store']);
    Route::delete('games/{game}/images/{game_image}', [GameImageController::class, 'destroy']);
    // Admin: program CRUD
    Route::apiResource('categories', CategoryController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('program-categories', ProgramCategoryController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('program-platforms', ProgramPlatformController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('programs', ProgramController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('program-packages', ProgramPackageController::class)->only(['store', 'update', 'destroy']);
    Route::post('program-packages/{program_package}/views', [ProgramPackageController::class, 'incrementViews']);
    Route::post('program-packages/{program_package}/orders', [ProgramPackageController::class, 'incrementOrders']);
    Route::post('programs/{program}/images', [ProgramImageController::class, 'store']);
    Route::delete('programs/{program}/images/{program_image}', [ProgramImageController::class, 'destroy']);
    // Admin: CRUD for usb sticks
    Route::post('usb-sticks', [UsbStickController::class, 'store']);
    Route::put('usb-sticks/{usb_stick}', [UsbStickController::class, 'update']);
    Route::delete('usb-sticks/{usb_stick}', [UsbStickController::class, 'destroy']);
    // Admin: Customer management
    Route::get('customers', [CustomerController::class, 'index']);
    Route::put('customers/{customer}', [CustomerController::class, 'update']);
    Route::delete('customers/{customer}', [CustomerController::class, 'destroy']);
});
