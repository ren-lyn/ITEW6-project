<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Research extends Model
{
    use HasFactory;
    protected $table = 'research';
    protected $primaryKey = 'research_id';
    protected $guarded = ['research_id'];

    public function authors()
    {
        return $this->belongsToMany(Student::class, 'research_authors', 'research_id', 'student_id')
            ->withPivot('author_id')
            ->withTimestamps();
    }

    public function adviser()
    {
        return $this->belongsTo(Faculty::class, 'adviser_id');
    }
}
