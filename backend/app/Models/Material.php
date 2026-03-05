<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    protected $casts = [
        'syllabus_json' => 'array',
        'curriculum_json' => 'array',
        'lesson_json' => 'array',
    ];

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }
}
