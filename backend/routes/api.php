<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\PlatformController;
use App\Http\Controllers\PackageCategoryTypeController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CategoryTypeController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\UsbStickController;
use App\Http\Controllers\PackageOrderController;
use App\Http\Controllers\UsbStickOrderController;
use App\Http\Controllers\StorageDeviceOrderController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\StorageDeviceController;
use App\Http\Controllers\StorageDeviceTypeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication endpoints (login, logout, me)
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);

// Public API endpoints expected by the frontend
Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{id}', [GameController::class, 'show']);

Route::get('/programs', [ProgramController::class, 'index']);
Route::get('/programs/{id}', [ProgramController::class, 'show']);

Route::get('/platforms', [PlatformController::class, 'index']);
Route::get('/game-platforms', [PlatformController::class, 'index']);
Route::get('/program-platforms', [PlatformController::class, 'index']);

Route::get('/package-category-types', [PackageCategoryTypeController::class, 'index']);

Route::get('/packages', [PackageController::class, 'index']);
Route::get('/packages/{id}', [PackageController::class, 'show']);
Route::get('/game-packages', [PackageController::class, 'index']);
Route::get('/game-packages/{id}', [PackageController::class, 'show']);

Route::get('/categories', [CategoryController::class, 'index']);
// Convenience endpoints returning categories filtered by type
Route::get('/game-categories', function (Request $request) {
    $request->merge(['category_type_id' => 1]);
    return app(CategoryController::class)->index($request);
});
Route::get('/program-categories', function (Request $request) {
    $request->merge(['category_type_id' => 2]);
    return app(CategoryController::class)->index($request);
});
Route::get('/category-types', [CategoryTypeController::class, 'index']);

Route::get('/governorates', [CustomerController::class, 'governorates']);

// Customer registration (public)
Route::post('/customers', [CustomerController::class, 'store']);

Route::get('/usb-sticks', [UsbStickController::class, 'index']);

// Storage device types and devices
Route::get('/storage-device-types', [StorageDeviceTypeController::class, 'index']);
Route::get('/storage-devices', [StorageDeviceController::class, 'index']);
Route::get('/storage-devices/{id}', [StorageDeviceController::class, 'show']);

// Orders (some endpoints may require authentication in production)
Route::get('/package-orders', [PackageOrderController::class, 'index']);
Route::post('/package-orders', [PackageOrderController::class, 'store']);
Route::get('/usb-stick-orders', [UsbStickOrderController::class, 'index']);
Route::post('/usb-stick-orders', [UsbStickOrderController::class, 'store']);
Route::get('/storage-device-orders', [StorageDeviceOrderController::class, 'index']);
Route::post('/storage-device-orders', [StorageDeviceOrderController::class, 'store']);

// Catalog endpoints
Route::get('/catalog', [CatalogController::class, 'index']);

// Cart endpoints (authenticated customers)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart', [CartController::class, 'show']);
    Route::post('/cart/sync', [CartController::class, 'sync']);
    Route::delete('/cart', [CartController::class, 'destroy']);
});

// User management and admin endpoints
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::apiResource('users', UserController::class);
    Route::patch('/users/{user}/role', [UserController::class, 'updateRole']);

    // Admin customer management
    Route::get('/customers', [CustomerController::class, 'index']);
    Route::get('/customers/{customer}', [CustomerController::class, 'show']);
    Route::put('/customers/{customer}', [CustomerController::class, 'update']);
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy']);

    // Admin dashboard and management endpoints used by the frontend
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/admin/orders', [AdminController::class, 'orders']);
    Route::patch('/admin/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);
    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::patch('/admin/users/{id}/role', [AdminController::class, 'updateUserRole']);
    Route::post('/admin/users', [AdminController::class, 'storeUser']);
    Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'destroyUser']);
    Route::get('/admin/settings', [AdminController::class, 'settings']);
    Route::post('/admin/settings', [AdminController::class, 'updateSettings']);

    // Admin package management
    Route::post('/packages', [PackageController::class, 'store']);
    Route::put('/packages/{id}', [PackageController::class, 'update']);
    Route::delete('/packages/{id}', [PackageController::class, 'destroy']);

    // Admin storage device management
    Route::post('/storage-devices', [StorageDeviceController::class, 'store']);
    Route::put('/storage-devices/{id}', [StorageDeviceController::class, 'update']);
    Route::delete('/storage-devices/{id}', [StorageDeviceController::class, 'destroy']);
});
