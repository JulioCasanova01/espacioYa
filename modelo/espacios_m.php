<?php
function salir(){
    session_start();
    session_unset();
    session_destroy();
    header("Location: ../vista/login.php");
    exit();
}


function registrar($conn, $data) {
    $nombre = $data['nombre'];
    $descripcion = $data['descripcion'];
    $capacidad = $data['capacidad'];
    $ubicacion = $data['ubicacion'];
    date_default_timezone_set('America/bogota');
    $creado_en = date('Y-m-d H:i:s');
    $estado = ($data['estado'] ?? '') == 'on' ? 'activo' : 'inactivo';
    $sql = "INSERT INTO espacios (nombre, descripcion, capacidad, ubicacion, creado_en, estado) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("Error al preparar la consulta: " . $conn->error);
    }    

    $stmt->bind_param("ssisss", $nombre, $descripcion, $capacidad, $ubicacion, $creado_en, $estado);
    $stmt->execute();   
    $stmt->close();
    $_SESSION['nombre'] = $nombre;
    $_SESSION['capacidad'] = $capacidad;
    echo "
        <script src='../vista/alertasweet/sweetalert2.all.min.js'></script>
        <script src='../vista/alertasweet/funcionesalert.js'></script>
        <body>
            <script>
                informar('ESPACIO REGISTRADO', 'CONTINUAR', '../vista/admin/admin.php', 'success');
            </script>
        </body>";
    exit();
}
    
   

function obtenerespacios($conn) {
    $result = mysqli_query($conn, "SELECT * FROM espacios");
    return mysqli_fetch_all($result, MYSQLI_ASSOC);
}

function eliminar($conn, $id) {
   
    mysqli_query($conn, "DELETE FROM espacios WHERE id=$id");
    header("Location: ../vista/admin/admin.php");
}
function logout() {
    session_start();
    session_unset();
    session_destroy();
    header("Location: ../vista/index.php");
    exit();
}

function actualizar($conn, $data) {
    // Validar estado correctamente
    $estado = isset($data['estado']) && $data['estado'] == 'activo' ? 'activo' : 'inactivo';

    $id = (int) $data['id'];
    $nombre = mysqli_real_escape_string($conn, $data['nombre']);
    $descripcion = mysqli_real_escape_string($conn, $data['descripcion']);
    $capacidad = (int) $data['capacidad'];
    $ubicacion = mysqli_real_escape_string($conn, $data['ubicacion']);

    $sql = "UPDATE espacios 
            SET nombre='$nombre', 
                descripcion='$descripcion', 
                capacidad=$capacidad, 
                ubicacion='$ubicacion', 
                estado='$estado' 
            WHERE id=$id";

    if (mysqli_query($conn, $sql)) {
        header("Location: ../vista/admin/admin.php");
        exit();
    } else {
        echo "Error al actualizar el espacio: " . mysqli_error($conn);
    }
}

?>