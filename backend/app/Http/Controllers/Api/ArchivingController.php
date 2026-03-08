<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class ArchivingController extends Controller
{
    // List archived users
    public function index()
    {
        $archivedUsers = User::onlyTrashed()
            ->select('id', 'name', 'email', 'role', 'deleted_at')
            ->orderBy('deleted_at', 'desc')
            ->get();

        return response()->json(['archived_users' => $archivedUsers]);
    }

    // Archive a user
    public function archive($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot archive other admins.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User archived successfully.']);
    }

    // Restore an archived user
    public function restore($id)
    {
        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();

        return response()->json(['message' => 'User restored successfully.']);
    }
}
