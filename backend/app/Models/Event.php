<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;
    protected $primaryKey = 'event_id';
    protected $guarded = ['event_id'];

    public function participants()
    {
        return $this->belongsToMany(Student::class, 'event_participants', 'event_id', 'student_id')
            ->withPivot('participant_id', 'role')
            ->withTimestamps();
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'event_id');
    }
}
