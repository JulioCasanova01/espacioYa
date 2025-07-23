import { Chart } from "@/components/ui/chart"
// Modern SpaceFlow - Advanced Space Reservation System

// Global variables
let currentDate = new Date()
let selectedDate = null
let selectedTimeSlot = null
let reservationToCancel = null
let reservationToEdit = null

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  // Initialize sample data if not exists
  initializeSampleData()

  // Check if user is logged in
  const user = getCurrentUser()
  if (user && window.location.pathname.includes("index.html")) {
    window.location.href = "dashboard.html"
  }

  // Add smooth animations
  addPageAnimations()
}

// Add smooth page animations
function addPageAnimations() {
  // Animate cards on load
  const cards = document.querySelectorAll(".modern-card, .stat-card, .auth-card")
  cards.forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(20px)"

    setTimeout(() => {
      card.style.transition = "all 0.6s ease-out"
      card.style.opacity = "1"
      card.style.transform = "translateY(0)"
    }, index * 100)
  })
}

// Authentication Functions
function initializeAuth() {
  const loginForm = document.getElementById("loginFormElement")
  const registerForm = document.getElementById("registerFormElement")
  const showRegisterLink = document.getElementById("showRegister")
  const showLoginLink = document.getElementById("showLogin")

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister)
  }

  if (showRegisterLink) {
    showRegisterLink.addEventListener("click", (e) => {
      e.preventDefault()
      switchAuthForm("register")
    })
  }

  if (showLoginLink) {
    showLoginLink.addEventListener("click", (e) => {
      e.preventDefault()
      switchAuthForm("login")
    })
  }
}

function switchAuthForm(type) {
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")

  if (type === "register") {
    loginForm.style.opacity = "0"
    setTimeout(() => {
      loginForm.style.display = "none"
      registerForm.style.display = "block"
      registerForm.style.opacity = "0"
      setTimeout(() => {
        registerForm.style.opacity = "1"
      }, 50)
    }, 300)
  } else {
    registerForm.style.opacity = "0"
    setTimeout(() => {
      registerForm.style.display = "none"
      loginForm.style.display = "block"
      loginForm.style.opacity = "0"
      setTimeout(() => {
        loginForm.style.opacity = "1"
      }, 50)
    }, 300)
  }
}

function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value

  // Validate inputs
  if (!email || !password) {
    showAlert("Por favor, completa todos los campos", "warning")
    return
  }

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    // Create session
    const session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      loginTime: new Date().toISOString(),
    }

    localStorage.setItem("currentSession", JSON.stringify(session))
    showAlert("¡Bienvenido! Iniciando sesión...", "success")

    // Add loading animation to button
    const submitBtn = e.target.querySelector('button[type="submit"]')
    const originalText = submitBtn.innerHTML
    submitBtn.innerHTML = '<div class="loading-spinner me-2"></div>Iniciando...'
    submitBtn.disabled = true

    setTimeout(() => {
      window.location.href = "dashboard.html"
    }, 1500)
  } else {
    showAlert("Credenciales incorrectas. Verifica tu email y contraseña.", "danger")
  }
}

function handleRegister(e) {
  e.preventDefault()

  const name = document.getElementById("registerName").value
  const email = document.getElementById("registerEmail").value
  const password = document.getElementById("registerPassword").value
  const phone = document.getElementById("registerPhone").value

  // Validate inputs
  if (!name || !email || !password || !phone) {
    showAlert("Por favor, completa todos los campos", "warning")
    return
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    showAlert("Por favor, ingresa un email válido", "warning")
    return
  }

  // Validate password length
  if (password.length < 6) {
    showAlert("La contraseña debe tener al menos 6 caracteres", "warning")
    return
  }

  // Get existing users
  const users = JSON.parse(localStorage.getItem("users") || "[]")

  // Check if email already exists
  if (users.find((u) => u.email === email)) {
    showAlert("Este email ya está registrado", "warning")
    return
  }

  // Create new user
  const newUser = {
    id: generateId(),
    name: name,
    email: email,
    password: password,
    phone: phone,
    role: "user",
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))

  showAlert("¡Registro exitoso! Ahora puedes iniciar sesión", "success")

  // Switch to login form
  switchAuthForm("login")

  // Clear form
  document.getElementById("registerFormElement").reset()
}

function logout() {
  localStorage.removeItem("currentSession")
  showAlert("Sesión cerrada correctamente", "info")
  setTimeout(() => {
    window.location.href = "index.html"
  }, 1000)
}

function checkAuth() {
  const session = getCurrentUser()
  if (!session) {
    window.location.href = "index.html"
    return false
  }

  // Update navigation with user info
  updateNavigation(session)
  return true
}

function checkAdminAccess() {
  const session = getCurrentUser()
  if (!session || session.role !== "admin") {
    showAlert("Acceso denegado. Solo administradores pueden acceder a esta sección", "danger")
    setTimeout(() => {
      window.location.href = "dashboard.html"
    }, 2000)
    return false
  }
  return true
}

function getCurrentUser() {
  const session = localStorage.getItem("currentSession")
  return session ? JSON.parse(session) : null
}

function updateNavigation(user) {
  const userNameElements = document.querySelectorAll("#userName, #userNameNav")
  userNameElements.forEach((element) => {
    if (element) element.textContent = user.name
  })

  // Show admin menu if user is admin
  const adminMenu = document.getElementById("adminMenu")
  if (adminMenu && user.role === "admin") {
    adminMenu.style.display = "block"
  }
}

// Dashboard Functions
function loadDashboard() {
  const user = getCurrentUser()
  if (!user) return

  updateNavigation(user)
  loadDashboardStats()
  loadRecentReservations()
  loadPopularSpaces()
}

function loadDashboardStats() {
  const user = getCurrentUser()
  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")
  const spaces = JSON.parse(localStorage.getItem("spaces") || "[]")

  const userReservations = reservations.filter((r) => r.userId === user.userId)
  const activeReservations = userReservations.filter((r) => r.status === "approved" && new Date(r.date) >= new Date())
  const upcomingReservations = userReservations.filter(
    (r) =>
      r.status === "approved" &&
      new Date(r.date) >= new Date() &&
      new Date(r.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  )

  // Animate counter updates
  animateCounter("activeReservations", activeReservations.length)
  animateCounter("totalReservations", userReservations.length)
  animateCounter("availableSpaces", spaces.filter((s) => s.active).length)
  animateCounter("upcomingReservations", upcomingReservations.length)
}

function animateCounter(elementId, targetValue) {
  const element = document.getElementById(elementId)
  if (!element) return

  let currentValue = 0
  const increment = targetValue / 30
  const timer = setInterval(() => {
    currentValue += increment
    if (currentValue >= targetValue) {
      element.textContent = targetValue
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(currentValue)
    }
  }, 50)
}

function loadRecentReservations() {
  const user = getCurrentUser()
  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")
  const spaces = JSON.parse(localStorage.getItem("spaces") || "[]")

  const userReservations = reservations
    .filter((r) => r.userId === user.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const container = document.getElementById("recentReservations")
  if (!container) return

  if (userReservations.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-calendar-x"></i>
        <p>No hay reservas recientes</p>
      </div>
    `
    return
  }

  container.innerHTML = userReservations
    .map((reservation) => {
      const space = spaces.find((s) => s.id === reservation.spaceId)
      return `
        <div class="reservation-item animate-slide-up">
          <div class="reservation-info">
            <h6>${space ? space.name : "Espacio no encontrado"}</h6>
            <small class="text-muted">${formatDate(reservation.date)} - ${reservation.startTime} a ${reservation.endTime}</small>
          </div>
          <span class="status-badge status-${reservation.status}">${getStatusText(reservation.status)}</span>
        </div>
      `
    })
    .join("")
}

function loadPopularSpaces() {
  const spaces = JSON.parse(localStorage.getItem("spaces") || "[]")
  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")

  // Calculate popularity based on reservation count
  const spacePopularity = spaces
    .map((space) => {
      const reservationCount = reservations.filter((r) => r.spaceId === space.id).length
      return { ...space, reservationCount }
    })
    .sort((a, b) => b.reservationCount - a.reservationCount)
    .slice(0, 3)

  const container = document.getElementById("popularSpaces")
  if (!container) return

  if (spacePopularity.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-building"></i>
        <p>No hay espacios disponibles</p>
      </div>
    `
    return
  }

  container.innerHTML = spacePopularity
    .map(
      (space, index) => `
        <div class="space-item animate-slide-right" style="animation-delay: ${index * 0.1}s">
          <div class="space-info">
            <h6>${space.name}</h6>
            <small class="text-muted">Capacidad: ${space.capacity} personas</small>
          </div>
          <span class="badge bg-primary rounded-pill">${space.reservationCount}</span>
        </div>
      `,
    )
    .join("")
}

// Calendar Functions
function initializeCalendar() {
  const user = getCurrentUser()
  if (!user) return

  updateNavigation(user)
  loadSpaceFilters()
  generateCalendar()
  generateTimeOptions()

  // Set default date filter to today
  const today = new Date().toISOString().split("T")[0]
  const dateFilter = document.getElementById("dateFilter")
  if (dateFilter) {
    dateFilter.value = today
  }
}

function loadSpaceFilters() {
  const spaces = JSON.parse(localStorage.getItem("spaces") || "[]")
  const activeSpaces = spaces.filter((s) => s.active)

  const spaceFilter = document.getElementById("spaceFilter")
  const reservationSpace = document.getElementById("reservationSpace")
  const editReservationSpace = document.getElementById("editReservationSpace")

  const optionsHTML = activeSpaces.map((space) => `<option value="${space.id}">${space.name}</option>`).join("")

  if (spaceFilter) {
    spaceFilter.innerHTML = '<option value="">Todos los espacios</option>' + optionsHTML
  }

  if (reservationSpace) {
    reservationSpace.innerHTML = '<option value="">Selecciona un espacio</option>' + optionsHTML
  }

  if (editReservationSpace) {
    editReservationSpace.innerHTML = '<option value="">Selecciona un espacio</option>' + optionsHTML
  }
}

function generateCalendar() {
  const calendar = document.getElementById("calendar")
  const currentMonthElement = document.getElementById("currentMonth")

  if (!calendar || !currentMonthElement) return

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  currentMonthElement.textContent = currentDate.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  })

  // Clear calendar
  calendar.innerHTML = ""

  // Add day headers
  const dayHeaders = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  dayHeaders.forEach((day) => {
    const header = document.createElement("div")
    header.className = "calendar-day-header"
    header.textContent = day
    calendar.appendChild(header)
  })

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    const emptyDay = document.createElement("div")
    emptyDay.className = "calendar-day other-month"
    calendar.appendChild(emptyDay)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div")
    dayElement.className = "calendar-day"
    dayElement.textContent = day

    const dayDate = new Date(year, month, day)
    const today = new Date()

    // Add today class
    if (dayDate.toDateString() === today.toDateString()) {
      dayElement.classList.add("today")
    }

    // Add click event
    dayElement.addEventListener("click", (event) => selectDate(dayDate, event))

    // Add reservation indicators
    addReservationIndicators(dayElement, dayDate)

    calendar.appendChild(dayElement)
  }
}

function addReservationIndicators(dayElement, date) {
  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")
  const user = getCurrentUser()
  const dateString = date.toISOString().split("T")[0]

  const dayReservations = reservations.filter((r) => r.date === dateString)

  if (dayReservations.length > 0) {
    const indicator = document.createElement("div")
    indicator.className = "reservation-indicator"

    // Determine indicator color based on reservation status
    const hasMyReservation = dayReservations.some((r) => r.userId === user.userId)
    const hasPendingReservation = dayReservations.some((r) => r.status === "pending")
    const hasApprovedReservation = dayReservations.some((r) => r.status === "approved")

    if (hasMyReservation) {
      indicator.classList.add("mine")
    } else if (hasPendingReservation) {
      indicator.classList.add("pending")
    } else if (hasApprovedReservation) {
      indicator.classList.add("occupied")
    } else {
      indicator.classList.add("available")
    }

    dayElement.appendChild(indicator)
  }
}

function selectDate(date, event) {
  selectedDate = date

  // Update selected date display
  const selectedDateElement = document.getElementById("selectedDate")
  if (selectedDateElement) {
    selectedDateElement.textContent = date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Update visual selection
  document.querySelectorAll(".calendar-day").forEach((day) => {
    day.classList.remove("selected")
  })
  event.target.classList.add("selected")

  // Load time slots for selected date
  loadTimeSlots(date)

  // Update reservation form date
  const reservationDate = document.getElementById("reservationDate")
  if (reservationDate) {
    reservationDate.value = date.toISOString().split("T")[0]
  }
}

function loadTimeSlots(date) {
  const timeSlotsContainer = document.getElementById("timeSlots")
  if (!timeSlotsContainer) return

  const spaces = JSON.parse(localStorage.getItem("spaces") || "[]")
  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")
  const user = getCurrentUser()
  const dateString = date.toISOString().split("T")[0]

  const activeSpaces = spaces.filter((s) => s.active)
  const dayReservations = reservations.filter((r) => r.date === dateString)

  if (activeSpaces.length === 0) {
    timeSlotsContainer.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-building-x"></i>
        <p>No hay espacios disponibles</p>
      </div>
    `
    return
  }

  const timeSlots = generateTimeSlots()

  timeSlotsContainer.innerHTML = activeSpaces
    .map((space) => {
      const spaceReservations = dayReservations.filter((r) => r.spaceId === space.id)

      return `
        <div class="space-section animate-fade-in">
          <h6 class="space-title">${space.name} <small class="text-muted">(Capacidad: ${space.capacity})</small></h6>
          <div class="time-slots-grid">
            ${timeSlots
              .map((slot) => {
                const isOccupied = spaceReservations.some(
                  (r) => r.status === "approved" && isTimeOverlap(slot.start, slot.end, r.startTime, r.endTime),
                )
                const isMine = spaceReservations.some(
                  (r) => r.userId === user.userId && isTimeOverlap(slot.start, slot.end, r.startTime, r.endTime),
                )

                let slotClass = "available"
                if (isMine) slotClass = "mine"
                else if (isOccupied) slotClass = "occupied"

                return `
                  <div class="time-slot ${slotClass}" 
                       onclick="selectTimeSlot('${space.id}', '${slot.start}', '${slot.end}', '${slotClass}')"
                       data-space="${space.id}" 
                       data-start="${slot.start}" 
                       data-end="${slot.end}">
                    ${slot.start} - ${slot.end}
                  </div>
                `
              })
              .join("")}
          </div>
        </div>
      `
    })
    .join("")
}

function generateTimeSlots() {
  const slots = []
  for (let hour = 8; hour < 20; hour++) {
    const startTime = `${hour.toString().padStart(2, "0")}:00`
    const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`
    slots.push({ start: startTime, end: endTime })
  }
  return slots
}

function selectTimeSlot(spaceId, startTime, endTime, status) {
  if (status === "occupied") {
    showAlert("Este horario ya está ocupado", "warning")
    return
  }

  selectedTimeSlot = { spaceId, startTime, endTime }

  // Update visual selection
  document.querySelectorAll(".time-slot").forEach((slot) => {
    slot.classList.remove("selected")
  })
  event.target.classList.add("selected")

  // Open reservation modal
  const modal = new bootstrap.Modal(document.getElementById("reservationModal"))

  // Pre-fill form
  document.getElementById("reservationSpace").value = spaceId
  document.getElementById("reservationDate").value = selectedDate.toISOString().split("T")[0]
  document.getElementById("reservationStartTime").value = startTime
  document.getElementById("reservationEndTime").value = endTime

  modal.show()
}

function generateTimeOptions() {
  const startTimeSelect = document.getElementById("reservationStartTime")
  const endTimeSelect = document.getElementById("reservationEndTime")
  const editStartTimeSelect = document.getElementById("editReservationStartTime")
  const editEndTimeSelect = document.getElementById("editReservationEndTime")

  const timeOptions = []
  for (let hour = 8; hour < 21; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`
    timeOptions.push(`<option value="${time}">${time}</option>`)
  }

  const optionsHTML = '<option value="">Selecciona hora</option>' + timeOptions.join("")

  if (startTimeSelect) startTimeSelect.innerHTML = optionsHTML
  if (endTimeSelect) endTimeSelect.innerHTML = optionsHTML
  if (editStartTimeSelect) editStartTimeSelect.innerHTML = optionsHTML
  if (editEndTimeSelect) editEndTimeSelect.innerHTML = optionsHTML
}

function submitReservation() {
  const spaceId = document.getElementById("reservationSpace").value
  const date = document.getElementById("reservationDate").value
  const startTime = document.getElementById("reservationStartTime").value
  const endTime = document.getElementById("reservationEndTime").value
  const purpose = document.getElementById("reservationPurpose").value

  // Validate inputs
  if (!spaceId || !date || !startTime || !endTime) {
    showAlert("Por favor, completa todos los campos obligatorios", "warning")
    return
  }

  // Validate time range
  if (startTime >= endTime) {
    showAlert("La hora de fin debe ser posterior a la hora de inicio", "warning")
    return
  }

  // Check for conflicts
  if (hasReservationConflict(spaceId, date, startTime, endTime)) {
    showAlert("Ya existe una reserva en este horario", "warning")
    return
  }

  // Create reservation
  const user = getCurrentUser()
  const reservation = {
    id: generateId(),
    userId: user.userId,
    spaceId: spaceId,
    date: date,
    startTime: startTime,
    endTime: endTime,
    purpose: purpose,
    status: "approved", // Auto-approve for simplicity
    createdAt: new Date().toISOString(),
  }

  // Save reservation
  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")
  reservations.push(reservation)
  localStorage.setItem("reservations", JSON.stringify(reservations))

  showAlert("¡Reserva creada exitosamente!", "success")

  // Close modal and refresh calendar
  const modal = bootstrap.Modal.getInstance(document.getElementById("reservationModal"))
  modal.hide()

  // Clear form
  document.getElementById("reservationForm").reset()

  // Refresh calendar if on calendar page
  if (selectedDate) {
    loadTimeSlots(selectedDate)
    generateCalendar()
  }
}

function hasReservationConflict(spaceId, date, startTime, endTime, excludeId = null) {
  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")

  return reservations.some(
    (r) =>
      r.id !== excludeId &&
      r.spaceId === spaceId &&
      r.date === date &&
      r.status === "approved" &&
      isTimeOverlap(startTime, endTime, r.startTime, r.endTime),
  )
}

function isTimeOverlap(start1, end1, start2, end2) {
  return start1 < end2 && end1 > start2
}

function previousMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1)
  generateCalendar()
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1)
  generateCalendar()
}

function filterCalendar() {
  const spaceFilter = document.getElementById("spaceFilter").value
  const dateFilter = document.getElementById("dateFilter").value

  if (dateFilter) {
    const filterDate = new Date(dateFilter)
    currentDate = new Date(filterDate.getFullYear(), filterDate.getMonth(), 1)
    generateCalendar()
    selectDate(filterDate)
  }

  // Apply space filter to time slots if date is selected
  if (selectedDate) {
    loadTimeSlots(selectedDate)
  }
}

// Reservations Functions
function loadReservations() {
  const user = getCurrentUser()
  if (!user) return

  updateNavigation(user)
  displayReservations()
  loadSpaceOptions()
}

function displayReservations(filter = "all") {
  const user = getCurrentUser()
  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")
  const spaces = JSON.parse(localStorage.getItem("spaces") || "[]")

  let userReservations = reservations.filter((r) => r.userId === user.userId)

  // Apply filter
  if (filter !== "all") {
    userReservations = userReservations.filter((r) => {
      switch (filter) {
        case "active":
          return r.status === "approved" && new Date(r.date) >= new Date()
        case "pending":
          return r.status === "pending"
        case "completed":
          return r.status === "approved" && new Date(r.date) < new Date()
        case "cancelled":
          return r.status === "cancelled"
        default:
          return true
      }
    })
  }

  // Sort by date (newest first)
  userReservations.sort((a, b) => new Date(b.date) - new Date(a.date))

  const tableBody = document.getElementById("reservationsTable")
  if (!tableBody) return

  if (userReservations.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-5">
          <div class="empty-state">
            <i class="bi bi-calendar-x"></i>
            <p>No hay reservas para mostrar</p>
          </div>
        </td>
      </tr>
    `
    return
  }

  tableBody.innerHTML = userReservations
    .map((reservation) => {
      const space = spaces.find((s) => s.id === reservation.spaceId)
      const canEdit =
        reservation.status === "pending" ||
        (reservation.status === "approved" && new Date(reservation.date) > new Date())
      const canCancel = reservation.status !== "cancelled" && new Date(reservation.date) > new Date()

      return `
        <tr class="animate-fade-in">
          <td>
            <div class="d-flex align-items-center">
              <div class="space-icon me-3">
                <i class="bi bi-building"></i>
              </div>
              <div>
                <strong>${space ? space.name : "Espacio no encontrado"}</strong>
                <br><small class="text-muted">${space ? space.location : ""}</small>
              </div>
            </div>
          </td>
          <td>
            <strong>${formatDate(reservation.date)}</strong>
          </td>
          <td>
            <span class="badge bg-light text-dark">${reservation.startTime} - ${reservation.endTime}</span>
          </td>
          <td>
            <span class="text-muted">${reservation.purpose || "-"}</span>
          </td>
          <td>
            <span class="status-badge status-${reservation.status}">${getStatusText(reservation.status)}</span>
          </td>
          <td>
            <div class="btn-group">
              ${
                canEdit
                  ? `<button class="btn btn-sm btn-outline-primary" onclick="editReservation('${reservation.id}')" title="Editar">
                      <i class="bi bi-pencil"></i>
                    </button>`
                  : ""
              }
              ${
                canCancel
                  ? `<button class="btn btn-sm btn-outline-danger" onclick="cancelReservation('${reservation.id}')" title="Cancelar">
                      <i class="bi bi-trash"></i>
                    </button>`
                  : ""
              }
            </div>
          </td>
        </tr>
      `
    })
    .join("")
}

function filterReservations(filter) {
  // Update active button
  document.querySelectorAll(".filter-buttons .btn").forEach((btn) => {
    btn.classList.remove("active")
  })
  event.target.classList.add("active")

  displayReservations(filter)
}

function editReservation(reservationId) {
  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")
  const reservation = reservations.find((r) => r.id === reservationId)

  if (!reservation) {
    showAlert("Reserva no encontrada", "danger")
    return
  }

  reservationToEdit = reservationId

  // Fill edit form
  document.getElementById("editReservationId").value = reservation.id
  document.getElementById("editReservationSpace").value = reservation.spaceId
  document.getElementById("editReservationDate").value = reservation.date
  document.getElementById("editReservationStartTime").value = reservation.startTime
  document.getElementById("editReservationEndTime").value = reservation.endTime
  document.getElementById("editReservationPurpose").value = reservation.purpose || ""

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById("editReservationModal"))
  modal.show()
}

function updateReservation() {
  const reservationId = document.getElementById("editReservationId").value
  const spaceId = document.getElementById("editReservationSpace").value
  const date = document.getElementById("editReservationDate").value
  const startTime = document.getElementById("editReservationStartTime").value
  const endTime = document.getElementById("editReservationEndTime").value
  const purpose = document.getElementById("editReservationPurpose").value

  // Validate inputs
  if (!spaceId || !date || !startTime || !endTime) {
    showAlert("Por favor, completa todos los campos obligatorios", "warning")
    return
  }

  // Validate time range
  if (startTime >= endTime) {
    showAlert("La hora de fin debe ser posterior a la hora de inicio", "warning")
    return
  }

  // Check for conflicts (excluding current reservation)
  if (hasReservationConflict(spaceId, date, startTime, endTime, reservationId)) {
    showAlert("Ya existe una reserva en este horario", "warning")
    return
  }

  // Update reservation
  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")
  const reservationIndex = reservations.findIndex((r) => r.id === reservationId)

  if (reservationIndex !== -1) {
    reservations[reservationIndex] = {
      ...reservations[reservationIndex],
      spaceId: spaceId,
      date: date,
      startTime: startTime,
      endTime: endTime,
      purpose: purpose,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem("reservations", JSON.stringify(reservations))
    showAlert("¡Reserva actualizada exitosamente!", "success")

    // Close modal and refresh table
    const modal = bootstrap.Modal.getInstance(document.getElementById("editReservationModal"))
    modal.hide()

    displayReservations()
  } else {
    showAlert("Error al actualizar la reserva", "danger")
  }
}

function cancelReservation(reservationId) {
  reservationToCancel = reservationId
  const modal = new bootstrap.Modal(document.getElementById("cancelReservationModal"))
  modal.show()
}

function confirmCancelReservation() {
  if (!reservationToCancel) return

  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")
  const reservationIndex = reservations.findIndex((r) => r.id === reservationToCancel)

  if (reservationIndex !== -1) {
    reservations[reservationIndex].status = "cancelled"
    reservations[reservationIndex].cancelledAt = new Date().toISOString()

    localStorage.setItem("reservations", JSON.stringify(reservations))
    showAlert("Reserva cancelada exitosamente", "success")

    // Close modal and refresh table
    const modal = bootstrap.Modal.getInstance(document.getElementById("cancelReservationModal"))
    modal.hide()

    displayReservations()
  } else {
    showAlert("Error al cancelar la reserva", "danger")
  }

  reservationToCancel = null
}

function loadSpaceOptions() {
  const spaces = JSON.parse(localStorage.getItem("spaces") || "[]")
  const activeSpaces = spaces.filter((s) => s.active)

  const editReservationSpace = document.getElementById("editReservationSpace")
  if (editReservationSpace) {
    editReservationSpace.innerHTML =
      '<option value="">Selecciona un espacio</option>' +
      activeSpaces.map((space) => `<option value="${space.id}">${space.name}</option>`).join("")
  }
}

// Admin Functions
function loadAdminData() {
  const user = getCurrentUser()
  if (!user || user.role !== "admin") return

  updateNavigation(user)
  loadSpaces()
  loadAdminReservations()
  loadReports()
  loadAdminFilters()
}

function loadSpaces() {
  const spaces = JSON.parse(localStorage.getItem("spaces") || "[]")
  const tableBody = document.getElementById("spacesTable")

  if (!tableBody) return

  if (spaces.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-5">
          <div class="empty-state">
            <i class="bi bi-building-x"></i>
            <p>No hay espacios registrados</p>
          </div>
        </td>
      </tr>
    `
    return
  }

  tableBody.innerHTML = spaces
    .map(
      (space) => `
        <tr class="animate-fade-in">
          <td>
            <div class="d-flex align-items-center">
              <div class="space-icon me-3">
                <i class="bi bi-building"></i>
              </div>
              <div>
                <strong>${space.name}</strong>
                <br><small class="text-muted">${space.description || ""}</small>
              </div>
            </div>
          </td>
          <td>
            <span class="badge bg-light text-dark">${space.capacity} personas</span>
          </td>
          <td>
            <i class="bi bi-geo-alt me-1"></i>${space.location}
          </td>
          <td>
            <span class="status-badge status-${space.active ? "active" : "cancelled"}">
              ${space.active ? "Activo" : "Inactivo"}
            </span>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-sm btn-outline-primary" onclick="editSpace('${space.id}')" title="Editar">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="deleteSpace('${space.id}')" title="Eliminar">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `,
    )
    .join("")
}

function editSpace(spaceId) {
  const spaces = JSON.parse(localStorage.getItem("spaces") || "[]")
  const space = spaces.find((s) => s.id === spaceId)

  if (!space) {
    showAlert("Espacio no encontrado", "danger")
    return
  }

  // Fill form
  document.getElementById("spaceId").value = space.id
  document.getElementById("spaceName").value = space.name
  document.getElementById("spaceCapacity").value = space.capacity
  document.getElementById("spaceLocation").value = space.location
  document.getElementById("spaceDescription").value = space.description || ""
  document.getElementById("spaceEquipment").value = space.equipment || ""
  document.getElementById("spaceActive").checked = space.active

  // Update modal title
  document.getElementById("spaceModalTitle").innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Espacio'

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById("spaceModal"))
  modal.show()
}

function deleteSpace(spaceId) {
  if (confirm("¿Estás seguro de que deseas eliminar este espacio?")) {
    const spaces = JSON.parse(localStorage.getItem("spaces") || "[]")
    const filteredSpaces = spaces.filter((s) => s.id !== spaceId)

    localStorage.setItem("spaces", JSON.stringify(filteredSpaces))
    showAlert("Espacio eliminado exitosamente", "success")
    loadSpaces()
  }
}

function saveSpace() {
  const spaceId = document.getElementById("spaceId").value
  const name = document.getElementById("spaceName").value
  const capacity = Number.parseInt(document.getElementById("spaceCapacity").value)
  const location = document.getElementById("spaceLocation").value
  const description = document.getElementById("spaceDescription").value
  const equipment = document.getElementById("spaceEquipment").value
  const active = document.getElementById("spaceActive").checked

  // Validate inputs
  if (!name || !capacity || !location) {
    showAlert("Por favor, completa todos los campos obligatorios", "warning")
    return
  }

  const spaces = JSON.parse(localStorage.getItem("spaces") || "[]")

  if (spaceId) {
    // Update existing space
    const spaceIndex = spaces.findIndex((s) => s.id === spaceId)
    if (spaceIndex !== -1) {
      spaces[spaceIndex] = {
        ...spaces[spaceIndex],
        name,
        capacity,
        location,
        description,
        equipment,
        active,
        updatedAt: new Date().toISOString(),
      }
    }
  } else {
    // Create new space
    const newSpace = {
      id: generateId(),
      name,
      capacity,
      location,
      description,
      equipment,
      active,
      createdAt: new Date().toISOString(),
    }
    spaces.push(newSpace)
  }

  localStorage.setItem("spaces", JSON.stringify(spaces))
  showAlert(spaceId ? "Espacio actualizado exitosamente" : "Espacio creado exitosamente", "success")

  // Close modal and refresh table
  const modal = bootstrap.Modal.getInstance(document.getElementById("spaceModal"))
  modal.hide()

  // Clear form
  document.getElementById("spaceForm").reset()
  document.getElementById("spaceId").value = ""
  document.getElementById("spaceModalTitle").innerHTML = '<i class="bi bi-building me-2"></i>Nuevo Espacio'

  loadSpaces()
}

function loadAdminReservations() {
  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")
  const spaces = JSON.parse(localStorage.getItem("spaces") || "[]")
  const users = JSON.parse(localStorage.getItem("users") || "[]")

  // Sort by date (newest first)
  reservations.sort((a, b) => new Date(b.date) - new Date(a.date))

  const tableBody = document.getElementById("adminReservationsTable")
  if (!tableBody) return

  if (reservations.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-5">
          <div class="empty-state">
            <i class="bi bi-calendar-x"></i>
            <p>No hay reservas para mostrar</p>
          </div>
        </td>
      </tr>
    `
    return
  }

  tableBody.innerHTML = reservations
    .map((reservation) => {
      const space = spaces.find((s) => s.id === reservation.spaceId)
      const user = users.find((u) => u.id === reservation.userId)

      return `
        <tr class="animate-fade-in">
          <td>
            <div class="d-flex align-items-center">
              <div class="user-avatar me-3">
                <i class="bi bi-person-circle"></i>
              </div>
              <div>
                <strong>${user ? user.name : "Usuario no encontrado"}</strong>
                <br><small class="text-muted">${user ? user.email : ""}</small>
              </div>
            </div>
          </td>
          <td>
            <div class="d-flex align-items-center">
              <div class="space-icon me-3">
                <i class="bi bi-building"></i>
              </div>
              <strong>${space ? space.name : "Espacio no encontrado"}</strong>
            </div>
          </td>
          <td><strong>${formatDate(reservation.date)}</strong></td>
          <td><span class="badge bg-light text-dark">${reservation.startTime} - ${reservation.endTime}</span></td>
          <td><span class="status-badge status-${reservation.status}">${getStatusText(reservation.status)}</span></td>
          <td>
            ${
              reservation.status === "pending"
                ? `
                  <div class="btn-group">
                    <button class="btn btn-sm btn-success" onclick="approveReservation('${reservation.id}')" title="Aprobar">
                      <i class="bi bi-check"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="rejectReservation('${reservation.id}')" title="Rechazar">
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                `
                : '<span class="text-muted">-</span>'
            }
          </td>
        </tr>
      `
    })
    .join("")
}

function approveReservation(reservationId) {
  updateReservationStatus(reservationId, "approved")
}

function rejectReservation(reservationId) {
  updateReservationStatus(reservationId, "rejected")
}

function updateReservationStatus(reservationId, status) {
  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")
  const reservationIndex = reservations.findIndex((r) => r.id === reservationId)

  if (reservationIndex !== -1) {
    reservations[reservationIndex].status = status
    reservations[reservationIndex].updatedAt = new Date().toISOString()

    localStorage.setItem("reservations", JSON.stringify(reservations))
    showAlert(`Reserva ${status === "approved" ? "aprobada" : "rechazada"} exitosamente`, "success")

    loadAdminReservations()
  } else {
    showAlert("Error al actualizar la reserva", "danger")
  }
}

function loadAdminFilters() {
  const spaces = JSON.parse(localStorage.getItem("spaces") || "[]")

  const spaceFilter = document.getElementById("reservationSpaceFilter")
  if (spaceFilter) {
    spaceFilter.innerHTML =
      '<option value="">Todos los espacios</option>' +
      spaces.map((space) => `<option value="${space.id}">${space.name}</option>`).join("")
  }
}

function filterAdminReservations() {
  const statusFilter = document.getElementById("reservationStatusFilter").value
  const spaceFilter = document.getElementById("reservationSpaceFilter").value
  const dateFilter = document.getElementById("reservationDateFilter").value

  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")
  const spaces = JSON.parse(localStorage.getItem("spaces") || "[]")
  const users = JSON.parse(localStorage.getItem("users") || "[]")

  let filteredReservations = reservations

  // Apply filters
  if (statusFilter) {
    filteredReservations = filteredReservations.filter((r) => r.status === statusFilter)
  }

  if (spaceFilter) {
    filteredReservations = filteredReservations.filter((r) => r.spaceId === spaceFilter)
  }

  if (dateFilter) {
    filteredReservations = filteredReservations.filter((r) => r.date === dateFilter)
  }

  // Sort by date (newest first)
  filteredReservations.sort((a, b) => new Date(b.date) - new Date(a.date))

  const tableBody = document.getElementById("adminReservationsTable")
  if (!tableBody) return

  if (filteredReservations.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-5">
          <div class="empty-state">
            <i class="bi bi-search"></i>
            <p>No hay reservas que coincidan con los filtros</p>
          </div>
        </td>
      </tr>
    `
    return
  }

  tableBody.innerHTML = filteredReservations
    .map((reservation) => {
      const space = spaces.find((s) => s.id === reservation.spaceId)
      const user = users.find((u) => u.id === reservation.userId)

      return `
        <tr class="animate-fade-in">
          <td>
            <div class="d-flex align-items-center">
              <div class="user-avatar me-3">
                <i class="bi bi-person-circle"></i>
              </div>
              <div>
                <strong>${user ? user.name : "Usuario no encontrado"}</strong>
                <br><small class="text-muted">${user ? user.email : ""}</small>
              </div>
            </div>
          </td>
          <td>
            <div class="d-flex align-items-center">
              <div class="space-icon me-3">
                <i class="bi bi-building"></i>
              </div>
              <strong>${space ? space.name : "Espacio no encontrado"}</strong>
            </div>
          </td>
          <td><strong>${formatDate(reservation.date)}</strong></td>
          <td><span class="badge bg-light text-dark">${reservation.startTime} - ${reservation.endTime}</span></td>
          <td><span class="status-badge status-${reservation.status}">${getStatusText(reservation.status)}</span></td>
          <td>
            ${
              reservation.status === "pending"
                ? `
                  <div class="btn-group">
                    <button class="btn btn-sm btn-success" onclick="approveReservation('${reservation.id}')" title="Aprobar">
                      <i class="bi bi-check"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="rejectReservation('${reservation.id}')" title="Rechazar">
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                `
                : '<span class="text-muted">-</span>'
            }
          </td>
        </tr>
      `
    })
    .join("")
}

function loadReports() {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")
  const spaces = JSON.parse(localStorage.getItem("spaces") || "[]")

  // Update stats with animation
  animateCounter("totalUsers", users.length)
  animateCounter("totalReservationsAdmin", reservations.length)
  animateCounter("totalSpacesAdmin", spaces.length)

  // Calculate total hours
  const totalHours = reservations.reduce((total, reservation) => {
    const start = new Date(`2000-01-01 ${reservation.startTime}`)
    const end = new Date(`2000-01-01 ${reservation.endTime}`)
    const hours = (end - start) / (1000 * 60 * 60)
    return total + hours
  }, 0)

  animateCounter("totalHours", Math.round(totalHours))

  // Load reports
  loadPopularSpacesReport()
  loadActiveUsersReport()
  loadReservationsChart()
}

function loadPopularSpacesReport() {
  const spaces = JSON.parse(localStorage.getItem("spaces") || "[]")
  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")

  const spaceStats = spaces
    .map((space) => {
      const spaceReservations = reservations.filter((r) => r.spaceId === space.id)
      return {
        name: space.name,
        reservations: spaceReservations.length,
        hours: spaceReservations.reduce((total, r) => {
          const start = new Date(`2000-01-01 ${r.startTime}`)
          const end = new Date(`2000-01-01 ${r.endTime}`)
          return total + (end - start) / (1000 * 60 * 60)
        }, 0),
      }
    })
    .sort((a, b) => b.reservations - a.reservations)
    .slice(0, 5)

  const container = document.getElementById("popularSpacesReport")
  if (!container) return

  if (spaceStats.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-building"></i>
        <p>No hay datos disponibles</p>
      </div>
    `
    return
  }

  container.innerHTML = spaceStats
    .map(
      (stat, index) => `
        <div class="space-item animate-slide-right" style="animation-delay: ${index * 0.1}s">
          <div class="space-info">
            <h6>${stat.name}</h6>
            <small class="text-muted">${Math.round(stat.hours)} horas utilizadas</small>
          </div>
          <span class="badge bg-primary rounded-pill">${stat.reservations}</span>
        </div>
      `,
    )
    .join("")
}

function loadActiveUsersReport() {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")

  const userStats = users
    .filter((user) => user.role !== "admin")
    .map((user) => {
      const userReservations = reservations.filter((r) => r.userId === user.id)
      return {
        name: user.name,
        reservations: userReservations.length,
        hours: userReservations.reduce((total, r) => {
          const start = new Date(`2000-01-01 ${r.startTime}`)
          const end = new Date(`2000-01-01 ${r.endTime}`)
          return total + (end - start) / (1000 * 60 * 60)
        }, 0),
      }
    })
    .sort((a, b) => b.reservations - a.reservations)
    .slice(0, 5)

  const container = document.getElementById("activeUsersReport")
  if (!container) return

  if (userStats.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-people"></i>
        <p>No hay datos disponibles</p>
      </div>
    `
    return
  }

  container.innerHTML = userStats
    .map(
      (stat, index) => `
        <div class="space-item animate-slide-right" style="animation-delay: ${index * 0.1}s">
          <div class="space-info">
            <h6>${stat.name}</h6>
            <small class="text-muted">${Math.round(stat.hours)} horas reservadas</small>
          </div>
          <span class="badge bg-success rounded-pill">${stat.reservations}</span>
        </div>
      `,
    )
    .join("")
}

function loadReservationsChart() {
  const canvas = document.getElementById("reservationsChart")
  if (!canvas) return

  const reservations = JSON.parse(localStorage.getItem("reservations") || "[]")

  // Group reservations by month
  const monthlyData = {}
  const currentYear = new Date().getFullYear()

  // Initialize last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`
    monthlyData[key] = 0
  }

  // Count reservations by month
  reservations.forEach((reservation) => {
    const date = new Date(reservation.date)
    const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`
    if (monthlyData.hasOwnProperty(key)) {
      monthlyData[key]++
    }
  })

  const labels = Object.keys(monthlyData).map((key) => {
    const [year, month] = key.split("-")
    const date = new Date(year, month - 1)
    return date.toLocaleDateString("es-ES", { month: "short", year: "numeric" })
  })

  const data = Object.values(monthlyData)

  const ctx = canvas.getContext("2d")

  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, "rgba(102, 126, 234, 0.3)")
  gradient.addColorStop(1, "rgba(102, 126, 234, 0.05)")

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Reservas por Mes",
          data: data,
          borderColor: "#667eea",
          backgroundColor: gradient,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#667eea",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: "#64748b",
          },
          grid: {
            color: "#e2e8f0",
          },
        },
        x: {
          ticks: {
            color: "#64748b",
          },
          grid: {
            color: "#e2e8f0",
          },
        },
      },
      elements: {
        point: {
          hoverBackgroundColor: "#667eea",
        },
      },
    },
  })
}

// Utility Functions
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function getStatusText(status) {
  const statusTexts = {
    pending: "Pendiente",
    approved: "Aprobada",
    active: "Activa",
    completed: "Completada",
    cancelled: "Cancelada",
    rejected: "Rechazada",
  }
  return statusTexts[status] || status
}

function showAlert(message, type = "info") {
  const alertContainer = document.getElementById("alertContainer")
  if (!alertContainer) return

  const alertId = "alert-" + Date.now()
  const alertHTML = `
    <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show animate-slide-right" role="alert">
      <div class="d-flex align-items-center">
        <i class="bi bi-${getAlertIcon(type)} me-2"></i>
        <span>${message}</span>
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `

  alertContainer.insertAdjacentHTML("beforeend", alertHTML)

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    const alert = document.getElementById(alertId)
    if (alert) {
      const bsAlert = new bootstrap.Alert(alert)
      bsAlert.close()
    }
  }, 5000)
}

function getAlertIcon(type) {
  const icons = {
    success: "check-circle",
    danger: "exclamation-triangle",
    warning: "exclamation-triangle",
    info: "info-circle",
  }
  return icons[type] || "info-circle"
}

// Initialize sample data
function initializeSampleData() {
  // Check if data already exists
  if (localStorage.getItem("dataInitialized")) return

  // Sample users
  const users = [
    {
      id: "admin-1",
      name: "Administrador",
      email: "admin@spaceflow.com",
      password: "admin123",
      phone: "+1234567890",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-1",
      name: "Juan Pérez",
      email: "juan@email.com",
      password: "user123",
      phone: "+1234567891",
      role: "user",
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-2",
      name: "María García",
      email: "maria@email.com",
      password: "user123",
      phone: "+1234567892",
      role: "user",
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-3",
      name: "Carlos López",
      email: "carlos@email.com",
      password: "user123",
      phone: "+1234567893",
      role: "user",
      createdAt: new Date().toISOString(),
    },
  ]

  // Sample spaces
  const spaces = [
    {
      id: "space-1",
      name: "Sala de Conferencias Alpha",
      capacity: 25,
      location: "Piso 1, Ala Norte",
      description: "Sala amplia con vista panorámica, ideal para presentaciones importantes",
      equipment: "Proyector 4K, Sistema de audio profesional, WiFi, Aire acondicionado, Pizarra inteligente",
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "space-2",
      name: "Sala de Reuniones Beta",
      capacity: 10,
      location: "Piso 2, Ala Sur",
      description: "Espacio íntimo perfecto para reuniones de equipo y brainstorming",
      equipment: "TV 55', WiFi, Pizarra, Mesa redonda, Cafetera",
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "space-3",
      name: "Auditorio Principal",
      capacity: 150,
      location: "Planta Baja, Entrada Principal",
      description: "Auditorio moderno con tecnología de punta para eventos corporativos",
      equipment: "Proyector láser, Sistema de sonido 7.1, Micrófono inalámbrico, Iluminación LED, WiFi",
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "space-4",
      name: "Sala de Capacitación Gamma",
      capacity: 20,
      location: "Piso 3, Ala Este",
      description: "Sala equipada especialmente para formación y desarrollo profesional",
      equipment: "Proyector, Computadoras individuales, WiFi, Aire acondicionado, Material didáctico",
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "space-5",
      name: "Sala Creativa Delta",
      capacity: 8,
      location: "Piso 4, Ala Oeste",
      description: "Espacio diseñado para sesiones creativas y trabajo colaborativo",
      equipment: "Pizarras móviles, Post-its, Marcadores, WiFi, Música ambiental, Sofás cómodos",
      active: true,
      createdAt: new Date().toISOString(),
    },
  ]

  // Sample reservations
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  const lastWeek = new Date(today)
  lastWeek.setDate(lastWeek.getDate() - 7)

  const reservations = [
    {
      id: "res-1",
      userId: "user-1",
      spaceId: "space-1",
      date: tomorrow.toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "11:00",
      purpose: "Reunión de planificación mensual con el equipo directivo",
      status: "approved",
      createdAt: new Date().toISOString(),
    },
    {
      id: "res-2",
      userId: "user-2",
      spaceId: "space-2",
      date: nextWeek.toISOString().split("T")[0],
      startTime: "14:00",
      endTime: "16:00",
      purpose: "Sesión de brainstorming para nuevo producto",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "res-3",
      userId: "user-3",
      spaceId: "space-3",
      date: lastWeek.toISOString().split("T")[0],
      startTime: "10:00",
      endTime: "12:00",
      purpose: "Presentación anual de resultados",
      status: "approved",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "res-4",
      userId: "user-1",
      spaceId: "space-4",
      date: today.toISOString().split("T")[0],
      startTime: "15:00",
      endTime: "17:00",
      purpose: "Capacitación en nuevas tecnologías",
      status: "approved",
      createdAt: new Date().toISOString(),
    },
  ]

  // Save to localStorage
  localStorage.setItem("users", JSON.stringify(users))
  localStorage.setItem("spaces", JSON.stringify(spaces))
  localStorage.setItem("reservations", JSON.stringify(reservations))
  localStorage.setItem("dataInitialized", "true")
}

// Event listeners for modal cleanup
document.addEventListener("DOMContentLoaded", () => {
  // Clear space form when modal is hidden
  const spaceModal = document.getElementById("spaceModal")
  if (spaceModal) {
    spaceModal.addEventListener("hidden.bs.modal", () => {
      document.getElementById("spaceForm").reset()
      document.getElementById("spaceId").value = ""
      document.getElementById("spaceModalTitle").innerHTML = '<i class="bi bi-building me-2"></i>Nuevo Espacio'
    })
  }

  // Clear reservation form when modal is hidden
  const reservationModal = document.getElementById("reservationModal")
  if (reservationModal) {
    reservationModal.addEventListener("hidden.bs.modal", () => {
      document.getElementById("reservationForm").reset()
    })
  }

  // Clear edit reservation form when modal is hidden
  const editReservationModal = document.getElementById("editReservationModal")
  if (editReservationModal) {
    editReservationModal.addEventListener("hidden.bs.modal", () => {
      document.getElementById("editReservationForm").reset()
      document.getElementById("editReservationId").value = ""
    })
  }

  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = "smooth"

  // Add loading states to forms
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const submitBtn = form.querySelector('button[type="submit"]')
      if (submitBtn && !submitBtn.disabled) {
        const originalText = submitBtn.innerHTML
        submitBtn.innerHTML = '<div class="loading-spinner me-2"></div>Procesando...'
        submitBtn.disabled = true

        // Re-enable after 3 seconds (fallback)
        setTimeout(() => {
          submitBtn.innerHTML = originalText
          submitBtn.disabled = false
        }, 3000)
      }
    })
  })

  // Add hover effects to cards
  const cards = document.querySelectorAll(".modern-card, .stat-card")
  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

  // Add ripple effect to buttons
  const buttons = document.querySelectorAll(".btn")
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.classList.add("ripple")

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
})

// Add CSS for ripple effect
const rippleCSS = `
.btn {
  position: relative;
  overflow: hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  transform: scale(0);
  animation: ripple-animation 0.6s linear;
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.space-icon, .user-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

.admin-tabs .nav-link {
  border: none;
  border-radius: 0;
  padding: 1rem 1.5rem;
  font-weight: 600;
  color: var(--gray-600);
  background: transparent;
  transition: all var(--transition-normal);
}

.admin-tabs .nav-link:hover {
  color: var(--gray-900);
  background: var(--gray-50);
}

.admin-tabs .nav-link.active {
  color: #667eea;
  background: linear-gradient(135deg, #667eea10, #764ba210);
  border-bottom: 3px solid #667eea;
}

.filter-buttons .btn-group .btn {
  border-radius: 0;
  border-right: none;
}

.filter-buttons .btn-group .btn:first-child {
  border-top-left-radius: var(--radius-md);
  border-bottom-left-radius: var(--radius-md);
}

.filter-buttons .btn-group .btn:last-child {
  border-top-right-radius: var(--radius-md);
  border-bottom-right-radius: var(--radius-md);
  border-right: 1px solid #dee2e6;
}

.filter-buttons .btn-group .btn.active {
  background: var(--primary-gradient);
  border-color: #667eea;
  color: white;
}

/* Enhanced mobile responsiveness */
@media (max-width: 768px) {
  .filter-buttons .btn-group {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
  
  .filter-buttons .btn-group .btn {
    flex: 1;
    min-width: 0;
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .calendar-controls {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}

@media (max-width: 576px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .welcome-title {
    font-size: 1.75rem;
  }
  
  .info-header h1 {
    font-size: 2.5rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .feature-card {
    padding: 1rem;
  }
  
  .time-slots-grid {
    grid-template-columns: 1fr;
  }
  
  .modern-modal .modal-body,
  .modern-modal .modal-header,
  .modern-modal .modal-footer {
    padding: 1rem;
  }
}

/* Dark mode support (optional) */
@media (prefers-color-scheme: dark) {
  :root {
    --gray-50: #0f172a;
    --gray-100: #1e293b;
    --gray-200: #334155;
    --gray-300: #475569;
    --gray-400: #64748b;
    --gray-500: #94a3b8;
    --gray-600: #cbd5e1;
    --gray-700: #e2e8f0;
    --gray-800: #f1f5f9;
    --gray-900: #f8fafc;
    --white: #0f172a;
  }
  
  .dashboard-page {
    background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
  }
  
  .modern-navbar {
    background: var(--gray-100);
    border-bottom-color: var(--gray-200);
  }
  
  .modern-card {
    background: var(--gray-100);
    border-color: var(--gray-200);
  }
  
  .modern-card .card-header {
    background: var(--gray-200);
    border-bottom-color: var(--gray-300);
  }
}

/* Print optimizations */
@media print {
  .animated-bg,
  .floating-shapes,
  .modern-navbar,
  .welcome-illustration,
  .quick-actions,
  .btn,
  .user-menu,
  .filter-buttons {
    display: none !important;
  }
  
  .main-content {
    padding: 0 !important;
  }
  
  .modern-card {
    box-shadow: none !important;
    border: 1px solid #000 !important;
    break-inside: avoid;
  }
  
  .stat-card {
    border: 1px solid #000 !important;
    box-shadow: none !important;
  }
  
  .table {
    border-collapse: collapse !important;
  }
  
  .table th,
  .table td {
    border: 1px solid #000 !important;
    padding: 0.5rem !important;
  }
  
  .status-badge {
    border: 1px solid #000 !important;
    background: white !important;
    color: black !important;
  }
  
  .gradient-text {
    color: #000 !important;
    -webkit-text-fill-color: unset !important;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .floating-icon {
    animation: none !important;
  }
  
  .shape {
    animation: none !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .modern-card {
    border: 2px solid #000;
  }
  
  .btn-primary-gradient {
    background: #000 !important;
    border: 2px solid #000 !important;
    color: #fff !important;
  }
  
  .status-badge {
    border: 2px solid #000 !important;
    font-weight: bold !important;
  }
}
`

// Inject the additional CSS
const style = document.createElement("style")
style.textContent = rippleCSS
document.head.appendChild(style)

// Performance optimization: Lazy load images
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]")
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Initialize lazy loading when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", lazyLoadImages)
} else {
  lazyLoadImages()
}

// Service Worker registration for offline support (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}

// Export functions for testing (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    generateId,
    formatDate,
    getStatusText,
    isTimeOverlap,
    hasReservationConflict,
  }
}
