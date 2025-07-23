<?php
function login($conn, $data) {
    session_start();
    $correo = $data['correo'];
    $clave = $data['clave'];

    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE correo = ?");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        $row = $resultado->fetch_assoc();

        if (password_verify($clave, $row['clave'])) {
            $_SESSION['id_usuario'] = $row['id'];
            $_SESSION['nombre'] = $row['nombre'];
            $_SESSION['correo'] = $row['correo'];
            $_SESSION['rol'] = $row['rol'];

            $nombre = addslashes($_SESSION["nombre"]);
            $rol = addslashes($_SESSION["rol"]);
            $mensaje = "Bienvenido $nombre ($rol)";

            echo "
                <script src='../vista/alertasweet/sweetalert2.all.min.js'></script>
                <script src='../vista/alertasweet/funcionesalert.js'></script>
                <body>
                    <script>
                        informar('$mensaje', 'ACEPTAR', '../vista/admin/vista_general.php', 'success');
                    </script>
                </body>";
            exit();
        } else {
            echo "
                <script src='../vista/alertasweet/sweetalert2.all.min.js'></script>
                <script src='../vista/alertasweet/funcionesalert.js'></script>
                <body>
                    <script>
                        informar('CLAVE INCORRECTA, Por favor, verifica tu contraseña.', 'REINTENTAR', '../vista/admin/login_admin.php', 'warning');
                    </script>
                </body>";
            exit();
        }
    } else {
        echo "
            <script src='../vista/alertasweet/sweetalert2.all.min.js'></script>
            <script src='../vista/alertasweet/funcionesalert.js'></script>
                <body>
                    <script>
                        informar('USUARIO NO ENCONTRADO', 'REINTENTAR', '../vista/admin/login_admin.php', 'error');
                    </script>
                </body>";
        exit();
    }
}

function salir(){
    session_start();
    session_unset();
    session_destroy();
    header("Location: ../vista/login.php");
    exit();
}

function registrar($conn, $data) {
    $clave_cifrada = password_hash($data['clave'], PASSWORD_DEFAULT);
    $sql= "INSERT INTO usuarios VALUES (NULL, '{$data['nombre']}', '{$data['UserEmail']}', '{$data['rolUsuario']}', '{$data['contacto1']}', '{$data['contacto2']}', '$clave_cifrada')";
    mysqli_query($conn, $sql);
    $_SESSION['nombre'] = $data['nombre'];
    $_SESSION['rol'] = $data['rolUsuario'];

    header("Location: ../vista/admin/usuarios.php");
}

function obtenerUsuarios($conn) {
    $result = mysqli_query($conn, "SELECT * FROM usuarios");
    return mysqli_fetch_all($result, MYSQLI_ASSOC);
}

function eliminar($conn, $id) {
   
    mysqli_query($conn, "DELETE FROM usuarios WHERE id=$id");
    header("Location: ../vista/admin/usuarios.php");
}

function actualizar($conn, $data) {
    $sql = "UPDATE usuarios SET nombre='{$data['nombre']}', correo='{$data['UserEmail']}', rol='{$data['rolUsuario']}', contacto_1='{$data['contacto1']}', contacto_2='{$data['contacto2']}'  WHERE id={$data['id']}";
    mysqli_query($conn, $sql);
    header("Location: ../vista/admin/usuarios.php");
}
?>