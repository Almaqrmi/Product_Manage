
<?php
$host = 'localhost';
$dbname = 'almaqrmi_phone';
$username = 'root'; // تغيير هذه القيم حسب إعداداتك
$password = ''; // تغيير هذه القيم حسب إعداداتك

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>
