<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - SpaceFlow</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="estilos/styles.css" rel="stylesheet">
</head>
<body class="dashboard-page">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg modern-navbar">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <div class="brand-container">
                    <div class="brand-icon">
                        <i class="bi bi-calendar-check"></i>
                    </div>
                    <span class="brand-text">SpaceFlow</span>
                </div>
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="dashboard.php">
                            <i class="bi bi-house-door me-2"></i>Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="calendar.php">
                            <i class="bi bi-calendar3 me-2"></i>Calendario
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="reservations.php">
                            <i class="bi bi-bookmark-check me-2"></i>Mis Reservas
                        </a>
                    </li>
                    <li class="nav-item" id="adminMenu" style="display: none;">
                        <a class="nav-link" href="admin.php">
                            <i class="bi bi-gear me-2"></i>Administración
                        </a>
                    </li>
                </ul>
                
                <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle user-menu" href="#" role="button" data-bs-toggle="dropdown">
                            <div class="user-avatar">
                                <i class="bi bi-person-circle"></i>
                            </div>
                            <span id="userNameNav" class="user-name"></span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end modern-dropdown">
                            <li><a class="dropdown-item" href="#" onclick="logout()">
                                <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                            </a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="main-content">
        <div class="container-fluid">
            <!-- Welcome Section -->
            <div class="welcome-section mb-5">
                <div class="welcome-card glass-effect">
                    <div class="welcome-content">
                        <div class="welcome-text">
                            <h1 class="welcome-title">¡Hola, <span id="userName" class="gradient-text"></span>!</h1>
                            <p class="welcome-subtitle">Gestiona tus reservas de espacios de manera inteligente y eficiente.</p>
                        </div>
                        <div class="welcome-illustration">
                            <div class="floating-icon">
                                <i class="bi bi-calendar-heart"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="stats-grid mb-5">
                <div class="stat-card stat-card-primary">
                    <div class="stat-icon">
                        <i class="bi bi-calendar-check"></i>
                    </div>
                    <div class="stat-content">
                        <h3 id="activeReservations" class="stat-number">0</h3>
                        <p class="stat-label">Reservas Activas</p>
                    </div>
                    <div class="stat-decoration"></div>
                </div>
                
                <div class="stat-card stat-card-info">
                    <div class="stat-icon">
                        <i class="bi bi-clock-history"></i>
                    </div>
                    <div class="stat-content">
                        <h3 id="totalReservations" class="stat-number">0</h3>
                        <p class="stat-label">Total Reservas</p>
                    </div>
                    <div class="stat-decoration"></div>
                </div>
                
                <div class="stat-card stat-card-success">
                    <div class="stat-icon">
                        <i class="bi bi-building"></i>
                    </div>
                    <div class="stat-content">
                        <h3 id="availableSpaces" class="stat-number">0</h3>
                        <p class="stat-label">Espacios Disponibles</p>
                    </div>
                    <div class="stat-decoration"></div>
                </div>
                
                <div class="stat-card stat-card-warning">
                    <div class="stat-icon">
                        <i class="bi bi-calendar-event"></i>
                    </div>
                    <div class="stat-content">
                        <h3 id="upcomingReservations" class="stat-number">0</h3>
                        <p class="stat-label">Próximas Reservas</p>
                    </div>
                    <div class="stat-decoration"></div>
                </div>
            </div>

            <div class="row">
                <!-- Recent Reservations -->
                <div class="col-lg-8 mb-4">
                    <div class="modern-card">
                        <div class="card-header">
                            <div class="header-content">
                                <h5 class="card-title">
                                    <i class="bi bi-clock-history me-2"></i>
                                    Reservas Recientes
                                </h5>
                                <a href="reservations.php" class="btn btn-outline-primary btn-sm">
                                    Ver Todas
                                    <i class="bi bi-arrow-right ms-1"></i>
                                </a>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="recentReservations" class="reservations-list">
                                <div class="empty-state">
                                    <i class="bi bi-calendar-x"></i>
                                    <p>No hay reservas recientes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions & Popular Spaces -->
                <div class="col-lg-4">
                    <!-- Quick Actions -->
                    <div class="modern-card mb-4">
                        <div class="card-header">
                            <h5 class="card-title">
                                <i class="bi bi-lightning me-2"></i>
                                Acciones Rápidas
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="quick-actions">
                                <a href="calendar.php" class="quick-action-btn primary">
                                    <div class="action-icon">
                                        <i class="bi bi-calendar-plus"></i>
                                    </div>
                                    <span>Nueva Reserva</span>
                                </a>
                                
                                <a href="calendar.php" class="quick-action-btn secondary">
                                    <div class="action-icon">
                                        <i class="bi bi-calendar3"></i>
                                    </div>
                                    <span>Ver Calendario</span>
                                </a>
                                
                                <a href="reservations.php" class="quick-action-btn tertiary">
                                    <div class="action-icon">
                                        <i class="bi bi-list-ul"></i>
                                    </div>
                                    <span>Mis Reservas</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Popular Spaces -->
                    <div class="modern-card">
                        <div class="card-header">
                            <h5 class="card-title">
                                <i class="bi bi-star me-2"></i>
                                Espacios Populares
                            </h5>
                        </div>
                        <div class="card-body">
                            <div id="popularSpaces" class="popular-spaces">
                                <div class="empty-state">
                                    <i class="bi bi-building"></i>
                                    <p>Cargando espacios...</p>
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
            checkAuth();
            loadDashboard();
        });
    </script>
</body>
</html>
