<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SpaceFlow - Sistema de Reservas Inteligente</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="estilos/styles.css" rel="stylesheet">
</head>
<body class="login-page">
    <!-- Animated Background -->
    <div class="animated-bg">
        <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
            <div class="shape shape-4"></div>
            <div class="shape shape-5"></div>
        </div>
    </div>

    <div class="container-fluid h-100">
        <div class="row h-100 align-items-center">
            <!-- Login Section -->
            <div class="col-lg-5 col-md-6 mx-auto">
                <div class="auth-container">
                    <div class="auth-card glass-effect">
                        <div class="auth-header text-center mb-4">
                            <div class="logo-container">
                                <div class="logo-icon">
                                    <i class="bi bi-calendar-check"></i>
                                </div>
                                <h1 class="logo-text">SpaceFlow</h1>
                                <p class="logo-subtitle">Sistema de Reservas Inteligente</p>
                            </div>
                        </div>

                        <!-- Login Form -->
                        <div id="loginForm" class="auth-form">
                            <div class="form-header">
                                <h3>Bienvenido de vuelta</h3>
                                <p>Inicia sesión para continuar</p>
                            </div>
                            
                            <form id="loginFormElement" class="modern-form">
                                <div class="form-floating mb-3">
                                    <input type="email" class="form-control modern-input" id="loginEmail" placeholder="tu@email.com" required>
                                    <label for="loginEmail">
                                        <i class="bi bi-envelope me-2"></i>Email
                                    </label>
                                </div>
                                
                                <div class="form-floating mb-4">
                                    <input type="password" class="form-control modern-input" id="loginPassword" placeholder="Contraseña" required>
                                    <label for="loginPassword">
                                        <i class="bi bi-lock me-2"></i>Contraseña
                                    </label>
                                </div>
                                
                                <button type="submit" class="btn btn-primary-gradient w-100 mb-3">
                                    <span class="btn-text">Iniciar Sesión</span>
                                    <i class="bi bi-arrow-right btn-icon"></i>
                                </button>
                            </form>
                            
                            <div class="auth-switch text-center">
                                <p>¿No tienes cuenta? <a href="#" id="showRegister" class="auth-link">Regístrate aquí</a></p>
                            </div>
                        </div>

                        <!-- Register Form -->
                        <div id="registerForm" class="auth-form" style="display: none;">
                            <div class="form-header">
                                <h3>Crear cuenta</h3>
                                <p>Únete a nuestra plataforma</p>
                            </div>
                            
                            <form id="registerFormElement" class="modern-form">
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control modern-input" id="registerName" placeholder="Nombre completo" required>
                                    <label for="registerName">
                                        <i class="bi bi-person me-2"></i>Nombre Completo
                                    </label>
                                </div>
                                
                                <div class="form-floating mb-3">
                                    <input type="email" class="form-control modern-input" id="registerEmail" placeholder="tu@email.com" required>
                                    <label for="registerEmail">
                                        <i class="bi bi-envelope me-2"></i>Email
                                    </label>
                                </div>
                                
                                <div class="form-floating mb-3">
                                    <input type="password" class="form-control modern-input" id="registerPassword" placeholder="Contraseña" required>
                                    <label for="registerPassword">
                                        <i class="bi bi-lock me-2"></i>Contraseña
                                    </label>
                                </div>
                                
                                <div class="form-floating mb-4">
                                    <input type="tel" class="form-control modern-input" id="registerPhone" placeholder="Teléfono" required>
                                    <label for="registerPhone">
                                        <i class="bi bi-phone me-2"></i>Teléfono
                                    </label>
                                </div>
                                
                                <button type="submit" class="btn btn-success-gradient w-100 mb-3">
                                    <span class="btn-text">Crear Cuenta</span>
                                    <i class="bi bi-arrow-right btn-icon"></i>
                                </button>
                            </form>
                            
                            <div class="auth-switch text-center">
                                <p>¿Ya tienes cuenta? <a href="#" id="showLogin" class="auth-link">Inicia sesión aquí</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Info Section -->
            <div class="col-lg-7 d-none d-lg-block">
                <div class="info-section">
                    <div class="info-content">
                        <div class="info-header">
                            <h1 class="display-3 fw-bold">Reserva Espacios de Forma Inteligente</h1>
                            <p class="lead">Plataforma moderna para la gestión y reserva de espacios. Visualiza disponibilidad en tiempo real, reserva instantáneamente y gestiona todo desde un solo lugar.</p>
                        </div>
                        
                        <div class="features-grid">
                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="bi bi-calendar3"></i>
                                </div>
                                <div class="feature-content">
                                    <h5>Calendario Inteligente</h5>
                                    <p>Visualización avanzada con disponibilidad en tiempo real</p>
                                </div>
                            </div>
                            
                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="bi bi-lightning"></i>
                                </div>
                                <div class="feature-content">
                                    <h5>Reservas Instantáneas</h5>
                                    <p>Proceso de reserva rápido y sin complicaciones</p>
                                </div>
                            </div>
                            
                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="bi bi-graph-up-arrow"></i>
                                </div>
                                <div class="feature-content">
                                    <h5>Analytics Avanzados</h5>
                                    <p>Reportes detallados y estadísticas de uso</p>
                                </div>
                            </div>
                            
                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="bi bi-shield-check"></i>
                                </div>
                                <div class="feature-content">
                                    <h5>Seguro y Confiable</h5>
                                    <p>Plataforma segura con validaciones automáticas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Alert Container -->
    <div id="alertContainer" class="position-fixed top-0 end-0 p-3" style="z-index: 1060;"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/app.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            initializeAuth();
        });
    </script>
</body>
</html>
