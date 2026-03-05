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
            'subject' => 'Advanced Database Systems',
            'day' => 'MWF',
            'start_time' => '08:00:00',
            'end_time' => '10:00:00',
            'room' => 'CCS Lab 1'
        ]);

        Schedule::create([
            'event_id' => $event ? $event->event_id : null,
            'subject' => $event ? $event->event_name : 'Search for Mr. and Ms. CCS',
            'room' => 'University Gym',
            'day' => 'Sunday',
            'start_time' => '13:00:00',
            'end_time' => '17:00:00'
        ]);
    }
}
