<?php
$host = "localhost";     
$usuario = "root";          
$contrasena = "";           
$base_de_datos = "comunespacios"; 

// Crear conexión
$conn = new mysqli($host, $usuario, $contrasena, $base_de_datos);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Establecer juego de caracteres
$conn->set_charset("utf8");

// Puedes dejar esto como comentario para pruebas
// echo "Conexión exitosa con la base de datos.";
?>
