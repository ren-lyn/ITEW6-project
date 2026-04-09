<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DocumentSubmission;
use App\Models\VerificationLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminVerificationController extends Controller
{
    /**
     * List all pending verifications (Documents & User Accounts)
     */
    public function index()
    {
        // Fetch pending documents
        $pendingDocs = DocumentSubmission::with(['user:id,name,role', 'type:id,name,is_mandatory'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => "doc_{$doc->id}",
                    'original_id' => $doc->id,
                    'type' => 'document',
                    'user' => $doc->user,
                    'document_type' => $doc->type->name,
                    'file_path' => $doc->file_path,
                    'created_at' => $doc->created_at,
                    'is_mandatory' => $doc->type->is_mandatory
                ];
            });

        // Fetch pending user registrations
        $pendingUsers = User::where('status', 'pending')
            ->whereIn('role', ['student', 'faculty'])
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => "user_{$user->id}",
                    'original_id' => $user->id,
                    'type' => 'account',
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'role' => $user->role
                    ],
                    'document_type' => 'Account Registration',
                    'file_path' => null,
                    'created_at' => $user->created_at,
                    'is_mandatory' => true
                ];
            });

        // Combine and return
        return response()->json([
            'verifications' => $pendingDocs->concat($pendingUsers)->sortBy('created_at')->values()
        ]);
    }

    /**
     * Approve a verification item
     */
    public function approve(Request $request, $prefixedId)
    {
        $id = str_replace(['doc_', 'user_'], '', $prefixedId);
        $isUser = str_starts_with($prefixedId, 'user_');

        DB::transaction(function () use ($id, $isUser, $request) {
            if ($isUser) {
                $user = User::findOrFail($id);
                $user->update(['status' => 'approved']);

                VerificationLog::create([
                    'user_id' => $user->id,
                    'admin_id' => $request->user()->id,
                    'action' => 'approved',
                    'remarks' => $request->remarks ?? 'Account registration approved',
                ]);
            } else {
                $submission = DocumentSubmission::findOrFail($id);
                $submission->update(['status' => 'approved']);

                VerificationLog::create([
                    'document_submission_id' => $submission->id,
                    'admin_id' => $request->user()->id,
                    'action' => 'approved',
                    'remarks' => $request->remarks ?? 'Document verified and approved',
                ]);
            }
        });

        return response()->json(['message' => ($isUser ? 'Account' : 'Document') . ' approved successfully']);
    }

    /**
     * Reject a verification item
     */
    public function reject(Request $request, $prefixedId)
    {
        $request->validate([
            'remarks' => 'required|string|max:500'
        ]);

        $id = str_replace(['doc_', 'user_'], '', $prefixedId);
        $isUser = str_starts_with($prefixedId, 'user_');

        DB::transaction(function () use ($id, $isUser, $request) {
            if ($isUser) {
                $user = User::findOrFail($id);
                $user->update(['status' => 'rejected']);

                VerificationLog::create([
                    'user_id' => $user->id,
                    'admin_id' => $request->user()->id,
                    'action' => 'rejected',
                    'remarks' => $request->remarks,
                ]);
            } else {
                $submission = DocumentSubmission::findOrFail($id);
                $submission->update(['status' => 'rejected']);

                VerificationLog::create([
                    'document_submission_id' => $submission->id,
                    'admin_id' => $request->user()->id,
                    'action' => 'rejected',
                    'remarks' => $request->remarks,
                ]);
            }
        });

        return response()->json(['message' => ($isUser ? 'Account' : 'Document') . ' rejected successfully']);
    }
}
