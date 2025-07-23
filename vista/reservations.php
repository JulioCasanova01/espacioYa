<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis Reservas - SpaceFlow</title>
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
                        <a class="nav-link" href="calendar.html">
                            <i class="bi bi-calendar3 me-2"></i>Calendario
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="reservations.html">
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
            <div class="modern-card">
                <div class="card-header">
                    <div class="header-content">
                        <h5 class="card-title">
                            <i class="bi bi-bookmark-check me-2"></i>
                            Mis Reservas
                        </h5>
                        <div class="filter-buttons">
                            <div class="btn-group" role="group">
                                <button class="btn btn-outline-primary active" onclick="filterReservations('all')">Todas</button>
                                <button class="btn btn-outline-primary" onclick="filterReservations('active')">Activas</button>
                                <button class="btn btn-outline-primary" onclick="filterReservations('pending')">Pendientes</button>
                                <button class="btn btn-outline-primary" onclick="filterReservations('completed')">Completadas</button>
                                <button class="btn btn-outline-primary" onclick="filterReservations('cancelled')">Canceladas</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Espacio</th>
                                    <th>Fecha</th>
                                    <th>Horario</th>
                                    <th>Propósito</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="reservationsTable">
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
        </div>
    </div>

    <!-- Edit Reservation Modal -->
    <div class="modal fade" id="editReservationModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modern-modal">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="bi bi-pencil me-2"></i>
                        Editar Reserva
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="editReservationForm" class="modern-form">
                        <input type="hidden" id="editReservationId">
                        
                        <div class="form-floating mb-3">
                            <select class="form-select modern-select" id="editReservationSpace" required>
                                <option value="">Selecciona un espacio</option>
                            </select>
                            <label for="editReservationSpace">
                                <i class="bi bi-building me-2"></i>Espacio
                            </label>
                        </div>
                        
                        <div class="form-floating mb-3">
                            <input type="date" class="form-control modern-input" id="editReservationDate" required>
                            <label for="editReservationDate">
                                <i class="bi bi-calendar3 me-2"></i>Fecha
                            </label>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <select class="form-select modern-select" id="editReservationStartTime" required>
                                        <option value="">Selecciona hora</option>
                                    </select>
                                    <label for="editReservationStartTime">
                                        <i class="bi bi-clock me-2"></i>Hora Inicio
                                    </label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating mb-3">
                                    <select class="form-select modern-select" id="editReservationEndTime" required>
                                        <option value="">Selecciona hora</option>
                                    </select>
                                    <label for="editReservationEndTime">
                                        <i class="bi bi-clock me-2"></i>Hora Fin
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-floating mb-3">
                            <textarea class="form-control modern-textarea" id="editReservationPurpose" rows="3"></textarea>
                            <label for="editReservationPurpose">
                                <i class="bi bi-chat-text me-2"></i>Propósito
                            </label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary-gradient" onclick="updateReservation()">
                        <i class="bi bi-check-circle me-2"></i>
                        Actualizar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Cancel Confirmation Modal -->
    <div class="modal fade" id="cancelReservationModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content modern-modal">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        Cancelar Reserva
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p class="mb-3">¿Estás seguro de que deseas cancelar esta reserva?</p>
                    <div class="alert alert-warning">
                        <i class="bi bi-info-circle me-2"></i>
                        <strong>Nota:</strong> Esta acción no se puede deshacer.
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No, mantener</button>
                    <button type="button" class="btn btn-danger" onclick="confirmCancelReservation()">
                        <i class="bi bi-trash me-2"></i>
                        Sí, cancelar
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
            loadReservations();
        });
    </script>
</body>
</html>
