<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerificationLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_submission_id',
        'admin_id',
        'action',
        'remarks',
    ];

    public function submission()
    {
        return $this->belongsTo(DocumentSubmission::class, 'document_submission_id');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
