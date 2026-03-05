<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;
    protected $primaryKey = 'org_id';
    protected $guarded = ['org_id'];

    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_organizations', 'org_id', 'student_id')
            ->withPivot('student_org_id', 'position', 'years_active')
            ->withTimestamps();
    }
}
