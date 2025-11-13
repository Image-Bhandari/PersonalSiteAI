<?php
session_start();

$valid_user = 'admin';
$valid_pass = 'password123'; // Replace with hashed value in production

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST["username"] ?? '';
    $password = $_POST["password"] ?? '';
    if ($username === $valid_user && $password === $valid_pass) {
        $_SESSION["logged_in"] = true;
        header("Location: index.html");
        exit();
    } else {
        echo "<p style='color:red;text-align:center;'>Invalid credentials. <a href=\"javascript:history.back()\">Go back</a></p>";
    }
} else {
    header("Location: index.html");
    exit();
}
?>
