<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    protected $table = 'faculty';
    protected $primaryKey = 'faculty_id';
    protected $guarded = ['faculty_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function academicRecords()
    {
        return $this->hasMany(AcademicRecord::class, 'adviser_id');
    }

    public function research()
    {
        return $this->hasMany(Research::class, 'adviser_id');
    }

    public function syllabuses()
    {
        return $this->hasMany(Syllabus::class, 'faculty_id');
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'faculty_id');
    }
}
