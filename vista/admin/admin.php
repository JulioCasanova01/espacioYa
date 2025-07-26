<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administración - SpaceFlow</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="../estilos/styles.css" rel="stylesheet">
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
                    <span class="badge bg-warning ms-2">Admin</span>
                </div>
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="dashboard.php">
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
                    <li class="nav-item">
                        <a class="nav-link active" href="admin.php">
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
            <!-- Admin Tabs -->
            <div class="modern-card mb-4">
                <div class="card-header p-0">
                    <ul class="nav nav-tabs admin-tabs" id="adminTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="spaces-tab" data-bs-toggle="tab" data-bs-target="#spaces" type="button" role="tab">
                                <i class="bi bi-building me-2"></i>Espacios
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="reservations-tab" data-bs-toggle="tab" data-bs-target="#reservations" type="button" role="tab">
                                <i class="bi bi-calendar-check me-2"></i>Reservas
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="reports-tab" data-bs-toggle="tab" data-bs-target="#reports" type="button" role="tab">
                                <i class="bi bi-graph-up me-2"></i>Reportes
                            </button>
                        </li>
                    </ul>
                </div>

                <div class="tab-content" id="adminTabContent">
                    <!-- Spaces Tab -->
                    <div class="tab-pane fade show active" id="spaces" role="tabpanel">
                        <div class="card-header">
                            <div class="header-content">
                                <h5 class="card-title">
                                    <i class="bi bi-building me-2"></i>
                                    Gestión de Espacios
                                </h5>
                                <button class="btn btn-primary-gradient" data-bs-toggle="modal" data-bs-target="#spaceModal">
                                    <i class="bi bi-plus-circle me-2"></i>Nuevo Espacio
                                </button>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Capacidad</th>
                                            <th>Ubicación</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="spacesTable">
                                        <tr>
                                            <td colspan="5" class="text-center py-5">
                                                <div class="loading-spinner mx-auto mb-3"></div>
                                                <p class="text-muted">Cargando espacios...</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Reservations Tab -->
                    <div class="tab-pane fade" id="reservations" role="tabpanel">
                        <div class="card-header">
                            <h5 class="card-title">
                                <i class="bi bi-calendar-check me-2"></i>
                                Gestión de Reservas
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="row mb-4">
                                <div class="col-md-3">
                                    <select class="form-select modern-select" id="reservationStatusFilter">
                                        <option value="">Todos los estados</option>
                                        <option value="pending">Pendientes</option>
                                        <option value="approved">Aprobadas</option>
                                        <option value="rejected">Rechazadas</option>
                                        <option value="cancelled">Canceladas</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <select class="form-select modern-select" id="reservationSpaceFilter">
                                        <option value="">Todos los espacios</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <input type="date" class="form-control modern-input" id="reservationDateFilter">
                                </div>
                                <div class="col-md-3">
                                    <button class="btn btn-primary-gradient w-100" onclick="filterAdminReservations()">
                                        <i class="bi bi-funnel me-2"></i>Filtrar
                                    </button>
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Usuario</th>
                                            <th>Espacio</th>
                                            <th>Fecha</th>
                                            <th>Horario</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="adminReservationsTable">
                                        <tr>
                                            <td colspan="6" class="text-center py-5">
                                                <div class="loading-spinner mx-auto mb-3"></div>
                                                <p class="text-muted">Cargando reservas...</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Reports Tab -->
                    <div class="tab-pane fade" id="reports" role="tabpanel">
                        <div class="card-body">
                            <!-- Stats Cards -->
                            <div class="stats-grid mb-5">
                                <div class="stat-card stat-card-primary">
                                    <div class="stat-icon">
                                        <i class="bi bi-people"></i>
                                    </div>
                                    <div class="stat-content">
                                        <h3 id="totalUsers" class="stat-number">0</h3>
                                        <p class="stat-label">Total Usuarios</p>
                                    </div>
                                    <div class="stat-decoration"></div>
                                </div>
                                
                                <div class="stat-card stat-card-success">
                                    <div class="stat-icon">
                                        <i class="bi bi-calendar-check"></i>
                                    </div>
                                    <div class="stat-content">
                                        <h3 id="totalReservationsAdmin" class="stat-number">0</h3>
                                        <p class="stat-label">Total Reservas</p>
                                    </div>
                                    <div class="stat-decoration"></div>
                                </div>
                                
                                <div class="stat-card stat-card-info">
                                    <div class="stat-icon">
                                        <i class="bi bi-building"></i>
                                    </div>
                                    <div class="stat-content">
                                        <h3 id="totalSpacesAdmin" class="stat-number">0</h3>
                                        <p class="stat-label">Total Espacios</p>
                                    </div>
                                    <div class="stat-decoration"></div>
                                </div>
                                
                                <div class="stat-card stat-card-warning">
                                    <div class="stat-icon">
                                        <i class="bi bi-clock"></i>
                                    </div>
                                    <div class="stat-content">
                                        <h3 id="totalHours" class="stat-number">0</h3>
                                        <p class="stat-label">Horas Reservadas</p>
                                    </div>
                                    <div class="stat-decoration"></div>
                                </div>
                            </div>

                            <!-- Reports -->
                            <div class="row">
                                <div class="col-md-6 mb-4">
                                    <div class="modern-card">
                                        <div class="card-header">
                                            <h5 class="card-title">
                                                <i class="bi bi-star me-2"></i>
                                                Espacios Más Utilizados
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <div id="popularSpacesReport">
                                                <div class="empty-state">
                                                    <i class="bi bi-building"></i>
                                                    <p>Cargando datos...</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6 mb-4">
                                    <div class="modern-card">
                                        <div class="card-header">
                                            <h5 class="card-title">
                                                <i class="bi bi-person-check me-2"></i>
                                                Usuarios Más Activos
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <div id="activeUsersReport">
                                                <div class="empty-state">
                                                    <i class="bi bi-people"></i>
                                                    <p>Cargando datos...</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-12">
                                    <div class="modern-card">
                                        <div class="card-header">
                                            <h5 class="card-title">
                                                <i class="bi bi-graph-up me-2"></i>
                                                Reservas por Mes
                                            </h5>
                                        </div>
                                        <div class="card-body">
                                            <canvas id="reservationsChart" height="100"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Space Modal -->
    <div class="modal fade" id="spaceModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content modern-modal">
                <div class="modal-header">
                    <h5 class="modal-title" id="spaceModalTitle">
                        <i class="bi bi-building me-2"></i>
                        Nuevo Espacio
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="spaceForm" class="modern-form">
                        <input type="hidden" id="spaceId">
                        
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control modern-input" id="spaceName" required>
                                    <label for="spaceName">
                                        <i class="bi bi-building me-2"></i>Nombre
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <input type="number" class="form-control modern-input" id="spaceCapacity" required>
                                    <label for="spaceCapacity">
                                        <i class="bi bi-people me-2"></i>Capacidad
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control modern-input" id="spaceLocation" required>
                            <label for="spaceLocation">
                                <i class="bi bi-geo-alt me-2"></i>Ubicación
                            </label>
                        </div>
                        
                        <div class="form-floating mb-3">
                            <textarea class="form-control modern-textarea" id="spaceDescription" rows="3"></textarea>
                            <label for="spaceDescription">
                                <i class="bi bi-chat-text me-2"></i>Descripción
                            </label>
                        </div>
                        
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control modern-input" id="spaceEquipment" placeholder="Ej: Proyector, WiFi, Aire acondicionado">
                            <label for="spaceEquipment">
                                <i class="bi bi-tools me-2"></i>Equipamiento
                            </label>
                        </div>
                        
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="spaceActive" checked>
                            <label class="form-check-label" for="spaceActive">
                                Espacio activo
                            </label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary-gradient" onclick="saveSpace()">
                        <i class="bi bi-check-circle me-2"></i>
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Alert Container -->
    <div id="alertContainer" class="position-fixed top-0 end-0 p-3" style="z-index: 1060;"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="js/app.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            checkAuth();
            checkAdminAccess();
            loadAdminData();
        });
    </script>
</body>
</html>
