<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Faculty;

$faculties = Faculty::all(['faculty_id', 'employee_id', 'first_name', 'last_name']);
foreach ($faculties as $f) {
    echo "ID: {$f->faculty_id}, Employee ID: {$f->employee_id}, Name: {$f->first_name} {$f->last_name}\n";
}
