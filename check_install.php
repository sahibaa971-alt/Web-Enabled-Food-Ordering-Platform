<?php
// check_install.php
echo "<h1>QuickBite Installation Check</h1>";

// 1. PHP Version
echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";

// 2. Database Connection
require_once 'api/db_connect.php';

if ($conn) {
    echo "<p style='color:green'><strong>✅ Database Connection:</strong> Success (Connected to 'quickbite_db')</p>";
} else {
    echo "<p style='color:red'><strong>❌ Database Connection:</strong> Failed</p>";
}

// 3. Rewrite/Access Check
echo "<p><strong>Server Software:</strong> " . $_SERVER['SERVER_SOFTWARE'] . "</p>";
echo "<p><strong>Document Root:</strong> " . $_SERVER['DOCUMENT_ROOT'] . "</p>";
echo "<p><strong>Current Folder:</strong> " . getcwd() . "</p>";

echo "<hr>";
echo "<h3>If you see this page, PHP is working!</h3>";
echo "<p><a href='index.html'>Go to Home Page</a></p>";
?>
