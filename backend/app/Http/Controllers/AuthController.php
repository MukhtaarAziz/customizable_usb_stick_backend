<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\Customer;

/**
 * @group Authentication
 *
 * Endpoints for authenticating users and customers.
 */
class AuthController extends Controller
{
    /**
     * Login
     *
     * Authenticate using email or phone with a password. Returns a Sanctum token and user data.
     * Works for both admin users and customers.
     *
     * @subgroup Login & Registration
     * @unauthenticated
     *
     * @bodyParam email string The email address (required if phone is not provided). Example: user@example.com
     * @bodyParam phone string The phone number (required if email is not provided). Example: 07701234567
     * @bodyParam password string required The account password. Example: secret123
     *
     * @responseField user object The authenticated user or customer object.
     * @responseField token string The Sanctum plain-text token.
     *
     * @response status=200 {
     *   "user": {"id": 1, "name": "John", "email": "user@example.com", "role": "customer"},
     *   "token": "1|abc123..."
     * }
     * @response status=422 {"message": "Identifier (email or phone) is required."}
     * @response status=401 {"message": "Invalid credentials."}
     */
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

    /**
     * Logout
     *
     * Revoke the current Sanctum access token.
     *
     * @subgroup Session Management
     * @authenticated
     *
     * @response status=200 {"message": "Logged out successfully."}
     */
    public function logout(Request $request)
    {
        $user = $request->user('sanctum');

        if ($user && $request->user('sanctum')->currentAccessToken()) {
            $request->user('sanctum')->currentAccessToken()->delete();
        }

        return response()->json(['message' => 'Logged out successfully.']);
    }

    /**
     * Get current user
     *
     * Return the authenticated user's information.
     *
     * @subgroup Session Management
     * @authenticated
     *
     * @responseField id int The user ID.
     * @responseField name string The user's name.
     * @responseField email string The user's email.
     *
     * @response status=200 {"id": 1, "name": "John", "email": "user@example.com", "role": "customer"}
     */
    public function me(Request $request)
    {
        return response()->json($request->user('sanctum'));
    }
}
