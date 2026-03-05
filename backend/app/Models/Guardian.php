<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guardian extends Model
{
    protected $primaryKey = 'guardian_id';
    protected $guarded = ['guardian_id'];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
