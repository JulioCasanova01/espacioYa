<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calendario - SpaceFlow</title>
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
                        <a class="nav-link" href="dashboard.html">
                            <i class="bi bi-house-door me-2"></i>Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="calendar.html">
                            <i class="bi bi-calendar3 me-2"></i>Calendario
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="reservations.html">
                            <i class="bi bi-bookmark-check me-2"></i>Mis Reservas
                        </a>
                    </li>
                    <li class="nav-item" id="adminMenu" style="display: none;">
                        <a class="nav-link" href="admin.html">
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
            <div class="row">
                <!-- Filters Sidebar -->
                <div class="col-lg-3 mb-4">
                    <div class="modern-card sticky-top">
                        <div class="card-header">
                            <h5 class="card-title">
                                <i class="bi bi-funnel me-2"></i>
                                Filtros
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="filter-group mb-3">
                                <label class="form-label">Espacio</label>
                                <select class="form-select modern-select" id="spaceFilter">
                                    <option value="">Todos los espacios</option>
                                </select>
                            </div>
                            
                            <div class="filter-group mb-4">
                                <label class="form-label">Fecha</label>
                                <input type="date" class="form-control modern-input" id="dateFilter">
                            </div>
                            
                            <button class="btn btn-primary-gradient w-100" onclick="filterCalendar()">
                                <i class="bi bi-search me-2"></i>
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>

                    <!-- Legend -->
                    <div class="modern-card mt-4">
                        <div class="card-header">
                            <h5 class="card-title">
                                <i class="bi bi-palette me-2"></i>
                                Leyenda
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="legend-items">
                                <div class="legend-item">
                                    <div class="legend-color available"></div>
                                    <span>Disponible</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color mine"></div>
                                    <span>Mis Reservas</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color occupied"></div>
                                    <span>Ocupado</span>
                                </div>
                                <div class="legend-item">
                                    <div class="legend-color pending"></div>
                                    <span>Pendiente</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Calendar Section -->
                <div class="col-lg-9">
                    <!-- Calendar Header -->
                    <div class="modern-card mb-4">
                        <div class="card-header">
                            <div class="calendar-header-content">
                                <h5 class="card-title">
                                    <i class="bi bi-calendar3 me-2"></i>
                                    Calendario de Reservas
                                </h5>
                                <div class="calendar-controls">
                                    <button class="btn btn-outline-primary" onclick="previousMonth()">
                                        <i class="bi bi-chevron-left"></i>
                                    </button>
                                    <button class="btn btn-outline-primary current-month-btn" id="currentMonth"></button>
                                    <button class="btn btn-outline-primary" onclick="nextMonth()">
                                        <i class="bi bi-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div id="calendar" class="modern-calendar">
                                <!-- Calendar will be generated here -->
                            </div>
                        </div>
                    </div>

                    <!-- Time Slots -->
                    <div class="modern-card">
                        <div class="card-header">
                            <h5 class="card-title">
                                <i class="bi bi-clock me-2"></i>
                                Horarios Disponibles - <span id="selectedDate" class="gradient-text">Selecciona una fecha</span>
                            </h5>
                        </div>
                        <div class="card-body">
                            <div id="timeSlots" class="time-slots-container">
                                <div class="empty-state">
                                    <i class="bi bi-calendar-x"></i>
                                    <p>Selecciona una fecha para ver los horarios disponibles</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Reservation Modal -->
    <div class="modal fade" id="reservationModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modern-modal">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="bi bi-calendar-plus me-2"></i>
                        Nueva Reserva
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="reservationForm" class="modern-form">
                        <div class="form-floating mb-3">
                            <select class="form-select modern-select" id="reservationSpace" required>
                                <option value="">Selecciona un espacio</option>
                            </select>
                            <label for="reservationSpace">
                                <i class="bi bi-building me-2"></i>Espacio
                            </label>
                        </div>
                        
                        <div class="form-floating mb-3">
                            <input type="date" class="form-control modern-input" id="reservationDate" required>
                            <label for="reservationDate">
                                <i class="bi bi-calendar3 me-2"></i>Fecha
                            </label>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <select class="form-select modern-select" id="reservationStartTime" required>
                                        <option value="">Selecciona hora</option>
                                    </select>
                                    <label for="reservationStartTime">
                                        <i class="bi bi-clock me-2"></i>Hora Inicio
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <select class="form-select modern-select" id="reservationEndTime" required>
                                        <option value="">Selecciona hora</option>
                                    </select>
                                    <label for="reservationEndTime">
                                        <i class="bi bi-clock me-2"></i>Hora Fin
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-floating mb-3">
                            <textarea class="form-control modern-textarea" id="reservationPurpose" rows="3" placeholder="Describe el propósito de la reserva"></textarea>
                            <label for="reservationPurpose">
                                <i class="bi bi-chat-text me-2"></i>Propósito
                            </label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary-gradient" onclick="submitReservation()">
                        <i class="bi bi-check-circle me-2"></i>
                        Reservar
                    </button>
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
            initializeCalendar();
        });
    </script>
</body>
</html>
