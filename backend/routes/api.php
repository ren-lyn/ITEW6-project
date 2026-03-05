<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\ResearchController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\DashboardController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Modules
    Route::apiResource('students', StudentController::class);
    Route::post('students/{student}/violations', [StudentController::class, 'addViolation']);
    Route::apiResource('faculties', FacultyController::class);
    Route::apiResource('events', EventController::class);
    Route::apiResource('schedules', ScheduleController::class);
    Route::apiResource('research', ResearchController::class);
    Route::apiResource('materials', MaterialController::class);
});
