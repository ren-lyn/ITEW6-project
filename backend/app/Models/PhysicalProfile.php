<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhysicalProfile extends Model
{
    use HasFactory;
    protected $primaryKey = 'profile_id';
    protected $guarded = ['profile_id'];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
