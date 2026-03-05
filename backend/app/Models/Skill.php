<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;
    protected $primaryKey = 'skill_id';
    protected $guarded = ['skill_id'];

    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_skills', 'skill_id', 'student_id')
            ->withPivot('student_skill_id', 'proficiency_level')
            ->withTimestamps();
    }
}
