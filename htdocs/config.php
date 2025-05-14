<?php
// Database configuration
$config = [
'host' => 'localhost',
'dbname' => 'campus_hub',
'username' => 'campus_admin',
'password' => 'Campus123',
'options' => [
PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
PDO::ATTR_EMULATE_PREPARES => false,
]
]; 
?>                                                   