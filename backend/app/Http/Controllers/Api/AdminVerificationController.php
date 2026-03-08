<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DocumentSubmission;
use App\Models\VerificationLog;
use Illuminate\Support\Facades\DB;

class AdminVerificationController extends Controller
{
    // List all pending documents
    public function index()
    {
        $pendingDocs = DocumentSubmission::with(['user:id,name,role', 'type:id,name,is_mandatory'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['pending_documents' => $pendingDocs]);
    }

    // Approve a document
    public function approve(Request $request, $id)
    {
        $submission = DocumentSubmission::findOrFail($id);
        
        DB::transaction(function () use ($submission, $request) {
            $submission->update(['status' => 'approved']);

            VerificationLog::create([
                'document_submission_id' => $submission->id,
                'admin_id' => $request->user()->id,
                'action' => 'approved',
                'remarks' => $request->remarks ?? 'Document verified and approved',
            ]);
        });

        // Add logic here to re-calculate "Profile Completion Score" if needed

        return response()->json(['message' => 'Document approved successfully']);
    }

    // Reject a document
    public function reject(Request $request, $id)
    {
        $request->validate([
            'remarks' => 'required|string|max:500'
        ]);

        $submission = DocumentSubmission::findOrFail($id);

        DB::transaction(function () use ($submission, $request) {
            $submission->update(['status' => 'rejected']);

            VerificationLog::create([
                'document_submission_id' => $submission->id,
                'admin_id' => $request->user()->id,
                'action' => 'rejected',
                'remarks' => $request->remarks,
            ]);
        });

        return response()->json(['message' => 'Document rejected successfully']);
    }
}
