<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    use HasFactory;
    protected $primaryKey = 'achievement_id';
    protected $guarded = ['achievement_id'];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
