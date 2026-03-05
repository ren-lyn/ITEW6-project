<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicRecord extends Model
{
    use HasFactory;
    protected $primaryKey = 'record_id';
    protected $guarded = ['record_id'];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function adviser()
    {
        return $this->belongsTo(Faculty::class, 'adviser_id');
    }
}
