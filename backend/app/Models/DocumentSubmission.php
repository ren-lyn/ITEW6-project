<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'document_type_id',
        'file_path',
        'original_filename',
        'status',
        'expiry_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function type()
    {
        return $this->belongsTo(DocumentType::class, 'document_type_id');
    }

    public function verificationLogs()
    {
        return $this->hasMany(VerificationLog::class);
    }
}
