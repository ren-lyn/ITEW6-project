<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;

$table = $argv[1] ?? 'faculty';
$columns = Schema::getColumnListing($table);
foreach ($columns as $c) { echo "$c\n"; }
