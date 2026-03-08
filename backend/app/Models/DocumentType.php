<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'required_for_role',
        'is_mandatory',
        'requires_expiry_date',
    ];

    public function submissions()
    {
        return $this->hasMany(DocumentSubmission::class);
    }
}
