<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Syllabus extends Model
{
    use HasFactory;
    protected $table = 'syllabus';
    protected $primaryKey = 'syllabus_id';
    protected $guarded = ['syllabus_id'];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function faculty()
    {
        return $this->belongsTo(Faculty::class, 'faculty_id');
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class, 'syllabus_id');
    }
}
