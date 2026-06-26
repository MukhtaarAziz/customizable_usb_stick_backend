<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\Customer;

class AuthController extends Controller
{
    //

    public function login(Request $request)
    {
        // Accept either email or phone for identifier
        $data = $request->validate([
            'password' => ['required', 'string'],
        ]);

        $identifier = $request->input('email') ?? $request->input('phone') ?? null;

        if (! $identifier) {
            return response()->json(['message' => 'Identifier (email or phone) is required.'], 422);
        }

        // Determine identifier type: email vs phone
        $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL) !== false;

        $user = null;

        if ($isEmail) {
            // try users by email
            $user = User::where('email', $identifier)->first();
            // fallback to customers by email
            if (! $user) {
                $user = Customer::where('email', $identifier)->first();
            }
        } else {
            // phone identifier: prefer customers table
            $user = Customer::where('phone', $identifier)->first();

            // if users table actually has phone column, optionally check it
            if (! $user && Schema::hasColumn('users', 'phone')) {
                $user = User::where('phone', $identifier)->first();
            }
        }

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user('sanctum');

        if ($user && $request->user('sanctum')->currentAccessToken()) {
            $request->user('sanctum')->currentAccessToken()->delete();
        }

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user('sanctum'));
    }
}
