<?php
function login($conn, $data) {
    session_start();
    $correo = $data['correo'];
    $contrasena = $data['contrasena'];

    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE correo = ?");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        $row = $resultado->fetch_assoc();

        if (password_verify($contrasena, $row['contrasena'])) {
            $_SESSION['id_usuario'] = $row['id'];
            $_SESSION['nombre'] = $row['nombre'];
            $_SESSION['correo'] = $row['correo'];
            $_SESSION['rol'] = $row['rol'];

            $nombre = addslashes($_SESSION["nombre"]);
            $rol = addslashes($_SESSION["rol"]);
            $mensaje = "Bienvenido";

            if ($rol == "admin") {
                $mensaje = "Bienvenido, Administrador $nombre";
                echo "
                    <script src='../vista/alertasweet/sweetalert2.all.min.js'></script>
                    <script src='../vista/alertasweet/funcionesalert.js'></script>
                    <body>
                        <script>
                            informar('$mensaje', 'ACEPTAR', '../vista/admin/admin.php', 'success');
                        </script>
                    </body>";
                exit();
            } elseif ($rol == "usuario") {
                echo "
                    <script src='../vista/alertasweet/sweetalert2.all.min.js'></script>
                    <script src='../vista/alertasweet/funcionesalert.js'></script>
                    <body>
                        <script>
                            informar('$mensaje', 'ACEPTAR', '../vista/dashboard.php', 'success');
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
                        informar('contrasena INCORRECTA, Por favor, verifica tu contraseña.', 'REINTENTAR', '../vista/index.php', 'warning');
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
                        informar('USUARIO NO ENCONTRADO', 'REINTENTAR', '../vista/index.php', 'error');
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
   $contrasena_cifrada = password_hash($data['contrasena'], PASSWORD_DEFAULT);
    $rol= $data['rol'] == '' ? 'usuario' : 'admin';
    date_default_timezone_set('America/Bogota');
    $fecha_registro= date('Y-m-d H:i:s');

    $sql = "INSERT INTO usuarios 
    VALUES (NULL, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("Error al preparar la consulta: " . $conn->error);
    }

    $stmt->bind_param(
        "ssssss",
        $data['nombre'],
        $data['correo'],
        $contrasena_cifrada,
        $rol,
        $fecha_registro,
        $data['telefono']
    );

    try {
    if ($stmt->execute()) {
        $_SESSION['nombre'] = $data['nombre'];
        $_SESSION['rol'] = $rol;
        
        echo "
        <script src='../vista/alertasweet/sweetalert2.all.min.js'></script>
        <script src='../vista/alertasweet/funcionesalert.js'></script>
        <body>
                <script>
                    informar('USUARIO REGISTRADO EXITÓSAMENTE.','Ok.', '../vista/index.php', 'success');
                </script>
        </body>";
        
        exit();
    }
    } catch (mysqli_sql_exception $e) {
        // Verificamos si es error por duplicado
        if ($e->getCode() === 1062) {
            // die("Error: Ya existe un registro con este número de documento o correo electrónico.");
            
            echo "
                <script src='../vista/alertasweet/sweetalert2.all.min.js'></script>
                <script src='../vista/alertasweet/funcionesalert.js'></script>
                <body>
                        <script>
                            informar('El Correo ya está registrado. Por favor, verifica los datos ingresados.','Ok.', '../vista/index.php', 'error');
                        </script>
                </body>";
        } else {
            die("Error al registrar cliente: " . $e->getMessage());
        }
        }


    $stmt->close();
}

function obtenerUsuarios($conn) {
    $result = mysqli_query($conn, "SELECT * FROM usuarios");
    return mysqli_fetch_all($result, MYSQLI_ASSOC);
}

function eliminar($conn, $id) {
   
    mysqli_query($conn, "DELETE FROM usuarios WHERE id=$id");
    header("Location: ../vista/admin/usuarios.php");
}
function logout() {
    session_start();
    session_unset();
    session_destroy();
    header("Location: ../vista/index.php");
    exit();
}

function actualizar($conn, $data) {
    $sql = "UPDATE usuarios SET nombre='{$data['nombre']}', correo='{$data['correo']}', rol='{$data['rol']}', contacto_1='{$data['telefono']}', contacto_2='{$data['contacto2']}'  WHERE id={$data['id']}";
    mysqli_query($conn, $sql);
    header("Location: ../vista/admin/usuarios.php");
}
?>