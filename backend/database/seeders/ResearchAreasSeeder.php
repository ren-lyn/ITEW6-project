<?php

namespace Database\Seeders;

use App\Models\Faculty;
use Illuminate\Database\Seeder;

class ResearchAreasSeeder extends Seeder
{
    public function run(): void
    {
        $faculties = Faculty::all();
        foreach ($faculties as $f) {
            $f->research_areas_json = ['Artificial Intelligence', 'Data Science', 'Machine Learning'];
            $f->save();
        }
    }
}
