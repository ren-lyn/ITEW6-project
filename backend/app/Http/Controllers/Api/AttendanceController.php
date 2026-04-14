<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with(['student', 'schedule']);

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('schedule_id')) {
            $query->where('schedule_id', $request->schedule_id);
        }

        if ($request->has('subject')) {
            $query->where('subject', 'like', '%' . $request->subject . '%');
        }

        if ($request->has('section')) {
            // First try filtering by the dedicated section column
            $section = $request->section;
            $query->where(function($q) use ($section) {
                $q->where('section', $section)
                  ->orWhereHas('student.academicRecords', function($sq) use ($section) {
                      $sq->where('section', $section);
                  });
            });
        }

        return response()->json($query->orderBy('date', 'desc')->get());
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
            'schedule_id' => 'nullable|exists:schedules,schedule_id',
            'section' => 'nullable|string',
            'subject' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date'
        ]);

        $file = $request->file('file');
        $scheduleId = $request->input('schedule_id');
        $sectionImport = $request->input('section');
        $subject = $request->input('subject');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        
        $handle = fopen($file->getRealPath(), 'r');
        
        // Skip header if exists
        $header = fgetcsv($handle, 1000, ',');
        
        $imported = 0;
        $errors = [];
        $line = 2; // Starting from second line (after header)

        DB::beginTransaction();
        try {
            while (($data = fgetcsv($handle, 1000, ',')) !== FALSE) {
                // Expected format: student_id_number, date, status, remarks
                if (count($data) < 3) {
                    $errors[] = "Line $line: Invalid format (requires ID, Date, Status).";
                    $line++;
                    continue;
                }

                $idOrName = trim($data[0]);
                $dateString = trim($data[1]);
                $status = trim($data[2]);
                $remarks = isset($data[3]) ? trim($data[3]) : null;

                if (empty($idOrName)) {
                    $errors[] = "Line $line: Student ID/Name is empty.";
                    $line++;
                    continue;
                }

                // Robust Date Parsing
                try {
                    $formattedDate = Carbon::parse($dateString)->format('Y-m-d');
                } catch (\Exception $e) {
                    $errors[] = "Line $line: Invalid date format '$dateString'. Use YYYY-MM-DD.";
                    $line++;
                    continue;
                }

                // Find Student (Try ID first, then Name)
                $student = Student::where('id_number', $idOrName)
                    ->whereNotNull('id_number')
                    ->where('id_number', '!=', '')
                    ->first();
                
                if (!$student) {
                    // Robust Name Matching (Portable across DBs)
                    $student = Student::all()->first(function($s) use ($idOrName) {
                        $fn = trim($s->first_name);
                        $ln = trim($s->last_name);
                        return strcasecmp($fn . ' ' . $ln, $idOrName) === 0;
                    });
                }
                
                if (!$student) {
                    $errors[] = "Line $line: Student '$idOrName' not found in records.";
                    $line++;
                    continue;
                }

                // Validate Date Range if provided
                if ($startDate && $formattedDate < $startDate) {
                    $errors[] = "Line $line: Date $formattedDate is before the specified start date $startDate.";
                    $line++;
                    continue;
                }
                if ($endDate && $formattedDate > $endDate) {
                    $errors[] = "Line $line: Date $formattedDate is after the specified end date $endDate.";
                    $line++;
                    continue;
                }

                Attendance::create([
                    'student_id' => $student->student_id,
                    'schedule_id' => $scheduleId,
                    'subject' => $subject,
                    'section' => $sectionImport,
                    'date' => $formattedDate,
                    'status' => $status ?: 'Present',
                    'remarks' => $remarks
                ]);

                $imported++;
                $line++;
            }
            
            DB::commit();
            fclose($handle);

            return response()->json([
                'message' => "Successfully imported $imported records.",
                'errors' => $errors
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            if ($handle) fclose($handle);
            return response()->json(['message' => 'Failed to import attendance.', 'error' => $e->getMessage()], 500);
        }
    }

    public function getStudentAttendance(Request $request)
    {
        $student = auth()->user()->student;
        if (!$student) return response()->json(['message' => 'Student record not found'], 404);

        $attendance = Attendance::with(['schedule'])
            ->where('student_id', $student->student_id)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($attendance);
    }

    public function getRiskAnalytics(Request $request)
    {
        $request->validate([
            'section' => 'required|string',
            'subject' => 'nullable|string'
        ]);

        $section = $request->section;
        $subject = $request->subject;

        $query = Attendance::where('section', $section);
        if ($subject) {
            $query->where('subject', $subject);
        }

        $allAttendance = $query->with('student')->get();

        $analytics = $allAttendance->groupBy('student_id')->map(function ($attendances) {
            $student = $attendances->first()->student;
            $total = $attendances->count();
            $absent = $attendances->where('status', 'Absent')->count();
            $late = $attendances->where('status', 'Late')->count();
            
            $absenceRate = ($total > 0) ? ($absent / $total) * 100 : 0;
            
            $status = 'Low Risk';
            $color = 'success';
            
            if ($absenceRate >= 20 || $absent >= 3) {
                $status = 'Critical';
                $color = 'danger';
            } elseif ($absenceRate >= 15 || $absent >= 2) {
                $status = 'High Risk';
                $color = 'warning';
            } elseif ($absenceRate >= 5 || $absent >= 1 || $late >= 2) {
                $status = 'Medium Risk';
                $color = 'warning'; // Both use warning for now, I'll differentiate in CSS
            }

            return [
                'student_id' => $student->student_id,
                'name' => $student->first_name . ' ' . $student->last_name,
                'id_number' => $student->id_number,
                'total_sessions' => $total,
                'absent_count' => $absent,
                'late_count' => $late,
                'absence_rate' => round($absenceRate, 1),
                'risk_status' => $status,
                'risk_color' => $color
            ];
        })->sortByDesc('absent_count')->values();

        return response()->json($analytics);
    }
}
