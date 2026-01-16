// == DATOS DE PRUEBA ==
const USUARIO_PRUEBA = {
  nombre: "Juan Pérez",
  email: "juan@mail.com",
  password: "juan123",
  saldo: 2547.83,
  numeroCuenta: "2200-1234-5678"
};

// == AUTENTICACIÓN ==
// Crea el usuario de prueba en localStorage si no existe
function initUsuarios() {
  let usuarios = JSON.parse(localStorage.getItem("micentavito_usuarios")) || [];
  const existePrueba = usuarios.some((u) => u.email === USUARIO_PRUEBA.email);
  if (!existePrueba) {
    usuarios.push(USUARIO_PRUEBA);
    localStorage.setItem("micentavito_usuarios", JSON.stringify(usuarios));
  }
}

// Se ejecuta al cargar cada página
initUsuarios();

// Procesa el formulario de login
function iniciarSesion() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    mostrarAlertaLogin("warning", "Por favor, completa todos los campos.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("micentavito_usuarios")) || [];
  const usuario = usuarios.find((u) => u.email === email && u.password === password);

  if (usuario) {
    localStorage.setItem("micentavito_sesion", JSON.stringify({
      nombre: usuario.nombre,
      email: usuario.email,
      saldo: usuario.saldo,
      numeroCuenta: usuario.numeroCuenta,
      logueado: true
    }));
    mostrarAlertaLogin("success", "¡Bienvenido, " + usuario.nombre + "!");
    setTimeout(() => { window.location.href = "dashboard.html"; }, 1500);
  } else {
    mostrarAlertaLogin("danger", "Correo o contraseña incorrectos.");
  }
}

// Procesa el formulario de registro
function registrarUsuario() {
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!nombre || !email || !password || !confirmPassword) {
    mostrarAlertaRegister("warning", "Por favor, completa todos los campos.");
    return;
  }

  if (password.length < 6) {
    mostrarAlertaRegister("warning", "La contraseña debe tener al menos 6 caracteres.");
    return;
  }

  if (password !== confirmPassword) {
    mostrarAlertaRegister("danger", "Las contraseñas no coinciden.");
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("micentavito_usuarios")) || [];
  const existeEmail = usuarios.some((u) => u.email === email);

  if (existeEmail) {
    mostrarAlertaRegister("danger", "Este correo ya está registrado.");
    return;
  }

  // Crear usuario nuevo con saldo inicial y número de cuenta aleatorio
  const nuevoUsuario = {
    nombre,
    email,
    password,
    saldo: 500.00,
    numeroCuenta: "2200-" + Math.floor(1000 + Math.random() * 9000) + "-" + Math.floor(1000 + Math.random() * 9000)
  };

  usuarios.push(nuevoUsuario);
  localStorage.setItem("micentavito_usuarios", JSON.stringify(usuarios));
  mostrarAlertaRegister("success", "¡Cuenta creada exitosamente! Redirigiendo...");
  setTimeout(() => { window.location.href = "login.html"; }, 1500);
}

// Cierra la sesión del usuario
function cerrarSesion() {
  localStorage.removeItem("micentavito_sesion");
  mostrarAlerta("info", "Has cerrado sesión correctamente.");
  setTimeout(() => {
    // Detectar si estamos en /pages/ para la ruta correcta
    const enPagesFolder = window.location.pathname.includes("/pages/");
    window.location.href = enPagesFolder ? "../index.html" : "index.html";
  }, 1000);
}

// Verifica si el usuario está logueado
function obtenerSesion() {
  const sesion = JSON.parse(localStorage.getItem("micentavito_sesion"));
  return sesion && sesion.logueado ? sesion : null;
}

// Cambia el tipo de input entre password y text
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(inputId + "-icon");
  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

// == ALERTAS ==
// Muestra una alerta flotante en la esquina superior derecha
function mostrarAlerta(tipo, mensaje) {
  let contenedor = document.getElementById("floatingAlertContainer");
  if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.id = "floatingAlertContainer";
    contenedor.style.position = "fixed";
    contenedor.style.top = "20px";
    contenedor.style.right = "20px";
    contenedor.style.zIndex = "9999";
    contenedor.style.maxWidth = "350px";
    document.body.appendChild(contenedor);
  }
  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo} alert-dismissible fade show shadow`;
  alerta.style.animation = "fadeInUp 0.3s ease-out";
  alerta.innerHTML = `${mensaje}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  contenedor.appendChild(alerta);
  setTimeout(() => { alerta.remove(); }, 5000);
}

// Muestra alerta en la página de login
function mostrarAlertaLogin(tipo, mensaje) {
  const contenedor = document.getElementById("loginAlertContainer");
  if (contenedor) {
    contenedor.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show mt-3">${mensaje}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
  } else {
    mostrarAlerta(tipo, mensaje);
  }
}

// Muestra alerta en la página de registro
function mostrarAlertaRegister(tipo, mensaje) {
  const contenedor = document.getElementById("registerAlertContainer");
  if (contenedor) {
    contenedor.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show mt-3">${mensaje}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
  } else {
    mostrarAlerta(tipo, mensaje);
  }
}

// Muestra alerta debajo del formulario de contacto
function mostrarAlertaFormulario(tipo, mensaje) {
  let contenedor = document.getElementById("formAlertContainer");
  if (!contenedor) {
    mostrarAlerta(tipo, mensaje);
    return;
  }
  contenedor.innerHTML = "";
  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo} alert-dismissible fade show shadow mt-3`;
  alerta.innerHTML = `${mensaje}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  contenedor.appendChild(alerta);
  setTimeout(() => { alerta.remove(); }, 5000);
}

// == FORMULARIO DE CONTACTO ==
// Procesa el envío del formulario
function enviarFormulario() {
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  if (!nombre || !email || !mensaje) {
    mostrarAlertaFormulario("warning", "Por favor, completa todos los campos requeridos.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    mostrarAlertaFormulario("danger", "Por favor, ingresa un correo electrónico válido.");
    return;
  }

  mostrarAlertaFormulario("success", "¡Mensaje enviado exitosamente! Te contactaremos pronto.");
  document.getElementById("nombre").value = "";
  document.getElementById("email").value = "";
  document.getElementById("mensaje").value = "";
}

// == ANIMACIÓN DE CONTADORES ==
/**
 * Anima un número desde 0 hasta el valor final
 * @param {HTMLElement} elemento - Elemento donde mostrar el número
 * @param {number} valorFinal - Número final a mostrar
 * @param {number} duracion - Duración de la animación en ms
 * @param {string} prefijo - Texto antes del número (ej: "$")
 * @param {string} sufijo - Texto después del número (ej: "+")
 */
function animarContador(elemento, valorFinal, duracion, prefijo = "", sufijo = "") {
  let inicio = 0;
  const incremento = valorFinal / (duracion / 16);
  const timer = setInterval(() => {
    inicio += incremento;
    if (inicio >= valorFinal) {
      elemento.textContent = prefijo + valorFinal.toLocaleString() + sufijo;
      clearInterval(timer);
    } else {
      elemento.textContent = prefijo + Math.floor(inicio).toLocaleString() + sufijo;
    }
  }, 16);
}

// Inicia las animaciones de contadores cuando son visibles
function initContadores() {
  const contadores = document.querySelectorAll("[data-contador]");
  if (contadores.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const elemento = entry.target;
        const valor = parseInt(elemento.dataset.contador);
        const prefijo = elemento.dataset.prefijo || "";
        const sufijo = elemento.dataset.sufijo || "";
        animarContador(elemento, valor, 2000, prefijo, sufijo);
        observer.unobserve(elemento);
      }
    });
  }, { threshold: 0.5 });

  contadores.forEach((contador) => observer.observe(contador));
}

// == DASHBOARD ==
// Carga los datos del usuario en el dashboard
function cargarDashboard() {
  const sesion = obtenerSesion();
  if (!sesion) {
    window.location.href = "login.html";
    return;
  }

  // Mostrar nombre
  const nombreElement = document.getElementById("nombreUsuario");
  if (nombreElement) {
    nombreElement.textContent = sesion.nombre;
  }

  // Mostrar saldo
  const saldoElement = document.getElementById("saldoUsuario");
  if (saldoElement) {
    saldoElement.textContent = "$" + sesion.saldo.toLocaleString("es-EC", { minimumFractionDigits: 2 });
  }

  // Mostrar número de cuenta
  const cuentaElement = document.getElementById("numeroCuenta");
  if (cuentaElement) {
    cuentaElement.textContent = sesion.numeroCuenta;
  }

  // Cargar movimientos según el tipo de usuario
  cargarMovimientos(sesion);
}

// Carga los movimientos según si es usuario demo o nuevo
function cargarMovimientos(sesion) {
  const contenedor = document.getElementById("listaMovimientos");
  if (!contenedor) return;

  // Si es el usuario de prueba (Juan Pérez), mostrar historial completo
  if (sesion.email === "juan@mail.com") {
    contenedor.innerHTML = `
      <div class="movement-item">
        <div class="movement-info">
          <h6>Depósito en efectivo</h6>
          <small>05 Ene 2026 - Sucursal Centro</small>
        </div>
        <span class="movement-amount positive">+$500.00</span>
      </div>
      <div class="movement-item">
        <div class="movement-info">
          <h6>Pago servicios básicos</h6>
          <small>03 Ene 2026 - Banca Virtual</small>
        </div>
        <span class="movement-amount negative">-$45.80</span>
      </div>
      <div class="movement-item">
        <div class="movement-info">
          <h6>Compra SuperMaxi</h6>
          <small>02 Ene 2026 - Tarjeta Débito</small>
        </div>
        <span class="movement-amount negative">-$87.50</span>
      </div>
      <div class="movement-item">
        <div class="movement-info">
          <h6>Transferencia recibida</h6>
          <small>01 Ene 2026 - María García</small>
        </div>
        <span class="movement-amount positive">+$150.00</span>
      </div>
    `;
  } else {
    // Usuario nuevo - solo mostrar depósito inicial de bienvenida
    const hoy = new Date();
    const fechaFormato = hoy.toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" });
    contenedor.innerHTML = `
      <div class="movement-item">
        <div class="movement-info">
          <h6>Depósito de bienvenida</h6>
          <small>${fechaFormato} - Apertura de cuenta</small>
        </div>
        <span class="movement-amount positive">+$500.00</span>
      </div>
      <div class="text-center text-muted py-3">
        <i class="fas fa-info-circle me-2"></i>Aún no tienes más movimientos
      </div>
    `;
  }
}

// Muestra mensaje de función no disponible
function funcionNoDisponible() {
  mostrarAlerta("info", "Esta función estará disponible próximamente.");
}

// == NAVBAR ==
// Actualiza el botón de usuario en el navbar
function actualizarNavUsuario() {
  const sesion = obtenerSesion();
  const userArea = document.getElementById("userNavArea");
  if (!userArea) return;

  if (sesion) {
    const iniciales = sesion.nombre.split(" ").map(n => n[0]).join("").toUpperCase();
    userArea.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-outline-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
          <span class="me-1">${iniciales}</span> ${sesion.nombre.split(" ")[0]}
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="pages/dashboard.html"><i class="fas fa-chart-line me-2"></i>Mi Banca</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" onclick="cerrarSesion()"><i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión</a></li>
        </ul>
      </div>
    `;
  } else {
    userArea.innerHTML = `<a href="pages/login.html" class="btn btn-outline-light btn-sm"><i class="fas fa-user me-1"></i> Banca en Línea</a>`;
  }
}

// Para páginas dentro de /pages/
function actualizarNavUsuarioPages() {
  const sesion = obtenerSesion();
  const userArea = document.getElementById("userNavArea");
  if (!userArea) return;

  if (sesion) {
    const iniciales = sesion.nombre.split(" ").map(n => n[0]).join("").toUpperCase();
    userArea.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-outline-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
          <span class="me-1">${iniciales}</span> ${sesion.nombre.split(" ")[0]}
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="dashboard.html"><i class="fas fa-chart-line me-2"></i>Mi Banca</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" onclick="cerrarSesion()"><i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión</a></li>
        </ul>
      </div>
    `;
  } else {
    userArea.innerHTML = `<a href="login.html" class="btn btn-outline-light btn-sm"><i class="fas fa-user me-1"></i> Banca en Línea</a>`;
  }
}

// == ANIMACIONES DE SCROLL ==
// Activa animaciones cuando los elementos son visibles
function initScrollAnimations() {
  const elementos = document.querySelectorAll(".card, .product-card, .section-title");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  elementos.forEach((el) => observer.observe(el));
}

// == FRASES MOTIVACIONALES ==
// Array de frases célebres sobre finanzas y ahorro con sus autores
const FRASES_MOTIVACIONALES = [
  { frase: "No ahorres lo que te queda después de gastar, gasta lo que te queda después de ahorrar.", autor: "Warren Buffett" },
  { frase: "El dinero es un buen sirviente, pero un mal amo.", autor: "Francis Bacon" },
  { frase: "La riqueza no consiste en tener grandes posesiones, sino en tener pocas necesidades.", autor: "Epicteto" },
  { frase: "Una inversión en conocimiento paga el mejor interés.", autor: "Benjamin Franklin" },
  { frase: "El hábito del ahorro es en sí mismo una educación.", autor: "George S. Clason" }
];

// Muestra una frase aleatoria en el elemento con id fraseMotivacional
function mostrarFraseMotivacional() {
  const elemento = document.getElementById("fraseMotivacional");
  if (elemento) {
    const indiceAleatorio = Math.floor(Math.random() * FRASES_MOTIVACIONALES.length);
    const cita = FRASES_MOTIVACIONALES[indiceAleatorio];
    elemento.innerHTML = `"${cita.frase}" <strong>— ${cita.autor}</strong>`;
  }
}

// == INICIALIZACIÓN ==
// Se ejecuta cuando la página termina de cargar
document.addEventListener("DOMContentLoaded", function() {
  initScrollAnimations();
  initContadores();
  mostrarFraseMotivacional();
  
  // Detectar si estamos en una página dentro de /pages/
  const enPagesFolder = window.location.pathname.includes("/pages/");
  if (enPagesFolder) {
    actualizarNavUsuarioPages();
  } else {
    actualizarNavUsuario();
  }
});
