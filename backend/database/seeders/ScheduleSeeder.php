<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Schedule;
use App\Models\Faculty;
use App\Models\Event;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $faculty = Faculty::first();
        $event = Event::first();

        Schedule::create([
            'faculty_id' => $faculty ? $faculty->faculty_id : null,
            'title' => 'Advanced Database Systems',
            'subject_code' => 'CS311',
            'days_of_week' => 'MW',
            'start_time' => '08:00:00',
            'end_time' => '10:00:00',
            'room_assignment' => 'CCS Lab 1',
            'section' => 'A',
            'year_level' => '3',
            'schedule_type' => 'Class'
        ]);

        Schedule::create([
            'faculty_id' => $faculty ? $faculty->faculty_id : null,
            'title' => 'Web Development 2',
            'subject_code' => 'IT222',
            'days_of_week' => 'TTh',
            'start_time' => '13:00:00',
            'end_time' => '15:30:00',
            'room_assignment' => 'CCS Lab 2',
            'section' => 'A',
            'year_level' => '3',
            'schedule_type' => 'Class'
        ]);

        Schedule::create([
            'event_id' => $event ? $event->event_id : null,
            'title' => $event ? $event->event_name : 'Search for Mr. and Ms. CCS',
            'room_assignment' => 'University Gym',
            'days_of_week' => 'Sunday',
            'start_time' => '13:00:00',
            'end_time' => '17:00:00',
            'schedule_type' => 'Event'
        ]);
    }
}
