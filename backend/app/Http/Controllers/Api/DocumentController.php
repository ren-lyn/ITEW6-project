<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DocumentType;
use App\Models\DocumentSubmission;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    // Retrieve required documents based on the user's role and their submission status
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $user->role;

        // Fetch document types required for this role or 'both'
        $requiredDocs = DocumentType::whereIn('required_for_role', [$role, 'both'])->get();

        // Fetch user's actual submissions
        $submissions = DocumentSubmission::where('user_id', $user->id)->get()->keyBy('document_type_id');

        $result = $requiredDocs->map(function ($doc) use ($submissions) {
            $submission = $submissions->get($doc->id);
            return [
                'document_type_id' => $doc->id,
                'name' => $doc->name,
                'description' => $doc->description,
                'is_mandatory' => $doc->is_mandatory,
                'requires_expiry_date' => $doc->requires_expiry_date,
                'status' => $submission ? $submission->status : 'missing',
                'submission_id' => $submission ? $submission->id : null,
                'file_path' => $submission && $submission->file_path ? url('storage/' . $submission->file_path) : null,
            ];
        });

        return response()->json(['documents' => $result]);
    }

    // Handle file upload
    public function upload(Request $request)
    {
        $request->validate([
            'document_type_id' => 'required|exists:document_types,id',
            'file' => 'required|file|mimes:pdf,jpg,png|max:5120', // 5MB limit
            'expiry_date' => 'nullable|date',
        ]);

        $user = $request->user();
        $docType = DocumentType::findOrFail($request->document_type_id);

        if ($request->file('file')) {
            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            
            // Store file in storage/app/public/documents
            $path = $file->store('documents', 'public');

            // Find existing submission or create new
            $submission = DocumentSubmission::where('user_id', $user->id)
                ->where('document_type_id', $docType->id)
                ->first();

            if ($submission) {
                // Delete old file if updating
                if ($submission->file_path) {
                    Storage::disk('public')->delete($submission->file_path);
                }
                
                $submission->update([
                    'file_path' => $path,
                    'original_filename' => $originalName,
                    'status' => 'pending', // Re-evaluate upon re-upload
                    'expiry_date' => $request->expiry_date,
                ]);
            } else {
                $submission = DocumentSubmission::create([
                    'user_id' => $user->id,
                    'document_type_id' => $docType->id,
                    'file_path' => $path,
                    'original_filename' => $originalName,
                    'status' => 'pending',
                    'expiry_date' => $request->expiry_date,
                ]);
            }

            return response()->json([
                'message' => 'Document uploaded successfully',
                'submission' => $submission
            ], 200);
        }

        return response()->json(['message' => 'No file uploaded'], 400);
    }
}
