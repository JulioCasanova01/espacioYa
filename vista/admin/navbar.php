<nav class="navbar navbar-expand-lg modern-navbar">
        <div class="container-fluid">
            <a class="navbar-brand" href="admin.php">
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
                            <li><button class="dropdown-item" href="../index.php" onclick="salir()">
                                <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión</button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>