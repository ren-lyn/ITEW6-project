<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Faculty;

$f = Faculty::find(1);
echo "DEBUG. employee_id: '" . $f->employee_id . "' Length: " . strlen($f->employee_id) . "\n";
