<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BehavioralProfile extends Model
{
    use HasFactory;
    protected $primaryKey = 'behavior_id';
    protected $guarded = ['behavior_id'];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
