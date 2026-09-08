// Cargar o inicializar los precios en localStorage si no existen
if (!localStorage.getItem("precioPelo")) localStorage.setItem("precioPelo", "10000");
if (!localStorage.getItem("precioBarba")) localStorage.setItem("precioBarba", "15000");

function inyectarFooter() {
    const footerElem = document.getElementById("footer");
    if (footerElem) {
        // Usamos comillas invertidas (`) para poder escribir en varias líneas sin usar signos +
        footerElem.innerHTML = `
            <div class='footer-contenido'>
                <p>2026 Barbería Glow Up. Todos los derechos reservados.</p>
                <p>Contacto: +56 9 1234 5678 | Correo: contacto@glowup.cl</p>
            </div>`;
    }
}

function inyectarHeader() {
const headerElem = document.getElementById("header");
    if (!headerElem) return;

    const usuarioActual = localStorage.getItem("usuarioActual");
    let navHTML = `<a href='index.html' class='nav-inicio'>Inicio</a>`;
    if (usuarioActual === "admin") {
        navHTML += `<div><a href='admin.html' class='btn-header'>Panel Admin</a></div>`;
    } else {
        navHTML += `<div><a href='reserva.html' class='btn-header'>Reserva Tu hora</a></div>`;
    }
    if (usuarioActual) {
        navHTML += `<a href='#' onclick='cerrarSesion()'>Cerrar Sesión</a>`;
    } else {
        navHTML += `<a href='inicio_sesion.html'>Inicio de sesión</a>`;
    }
    headerElem.innerHTML = `<div class='titulo'>Glow Up</div><nav class='nav-header'>${navHTML}</nav>`;
}

function iniciarSesion(event) {
    if (event) event.preventDefault();

    const userInput = document.getElementById("loginEmail").value.trim();
    const passInput = document.getElementById("loginPassword").value;

    if (userInput === "admin" && passInput === "1234") {
        localStorage.setItem("usuarioActual", "admin");
        alert("Bienvenido Administrador");
        return verificarReservaPendiente("index.html");
    }

    const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
    let encontrado = false;

    for (let u of usuarios) {
        if ((u.email === userInput || u.username === userInput) && u.password === passInput) {
            encontrado = true;
            break;
        }
    }

    if (encontrado) {
        localStorage.setItem("usuarioActual", userInput);
        alert("Sesión iniciada con éxito");
        verificarReservaPendiente("index.html");
    } else {
        alert("Error: El usuario o la contraseña son incorrectos.");
    }
}

function registrarUsuario(event) {
    if (event) event.preventDefault();

    const regEmail = document.getElementById("regEmail").value.trim();
    const regUser = document.getElementById("regUser").value.trim();
    const regFecha = document.getElementById("regFecha").value;
    const regPass = document.getElementById("regPassword").value;
    const regConfirmPass = document.getElementById("regConfirmPassword").value;

    // Ahorramos líneas combinando el return con el alert
    if (!regEmail || !regUser || !regPass || !regConfirmPass) return alert("Por favor completa todos los campos obligatorios.");
    if (!regEmail.includes("@")) return alert("Error: Es obligatorio incluir el '@' en el correo electrónico.");
    if (regPass !== regConfirmPass) return alert("Error: Las contraseñas no coinciden.");

    const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

    for (let u of usuarios) {
        if (u.email.toLowerCase() === regEmail.toLowerCase()) return alert("Error: Ya existe un usuario registrado con este correo.");
        if (u.username.toLowerCase() === regUser.toLowerCase()) return alert("Error: El nombre de usuario ya está en uso.");
    }

    usuarios.push({ email: regEmail, username: regUser, fechaNacimiento: regFecha, password: regPass });
    localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActual", regUser);

    alert("¡Cuenta creada con éxito!");
    verificarReservaPendiente("index.html");
}

function verificarReservaPendiente(destinoPorDefecto) {
    if (localStorage.getItem("reservaPendiente") === "true") {
        localStorage.removeItem("reservaPendiente");
        alert("Su cita ha sido realizada");
        window.location.href = "index.html";
    } else {
        window.location.href = destinoPorDefecto;
    }
}

function procesarReserva(event) {
    if (event) event.preventDefault();

    if (!localStorage.getItem("usuarioActual")) {
        alert("Debes iniciar sesión o registrarte para confirmar tu reserva.");
        localStorage.setItem("reservaPendiente", "true");
        window.location.href = "inicio_sesion.html";
    } else {
        alert("Su cita ha sido realizada");
        window.location.href = "index.html";
    }
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActual");
    alert("Has cerrado sesión.");
    window.location.href = "index.html";
}

function guardarPrecios(event) {
    if (event) event.preventDefault();

    const nuevoPrecioPelo = document.getElementById("precioPelo").value;
    const nuevoPrecioBarba = document.getElementById("precioBarba").value;

    if (nuevoPrecioPelo && nuevoPrecioBarba) {
        localStorage.setItem("precioPelo", nuevoPrecioPelo);
        localStorage.setItem("precioBarba", nuevoPrecioBarba);
        alert("Precios actualizados con éxito.");
    } else {
        alert("Por favor ingresa ambos precios.");
    }
}

function cargarPrecios() {
    const selectServicio = document.getElementById("servicio");
    const pPelo = localStorage.getItem("precioPelo") || "10000";
    const pBarba = localStorage.getItem("precioBarba") || "15000";

    if (selectServicio) {
        selectServicio.innerHTML = '<option value="" disabled selected>Seleccioná un servicio</option>';

        selectServicio.options.add(new Option(`Corte de Pelo - $${pPelo}`, "corte"));
        selectServicio.options.add(new Option(`Corte de Pelo + Barba - $${pBarba}`, "corte-barba"));

        const serviciosExtra = JSON.parse(localStorage.getItem("serviciosExtra")) || [];
        for (let servicio of serviciosExtra) {
            const nuevaOpcion = new Option(`${servicio.nombre} - $${servicio.precio}`, servicio.nombre);
            selectServicio.options.add(nuevaOpcion);
        }
    }

    const inputPelo = document.getElementById("precioPelo");
    const inputBarba = document.getElementById("precioBarba");
    if (inputPelo && inputBarba) {
        inputPelo.value = pPelo;
        inputBarba.value = pBarba;
    }
}

document.addEventListener("DOMContentLoaded", cargarPrecios);

function mostrarRegistro() {
    document.getElementById("formLoginBox").style.display = "none";
    document.getElementById("formRegistroBox").style.display = "block";
}

function mostrarLogin() {
    document.getElementById("formRegistroBox").style.display = "none";
    document.getElementById("formLoginBox").style.display = "block";
}

function agregarServicio(event) {
    if (event) event.preventDefault();

    const nombreServicio = document.getElementById("nombreServicio").value.trim();
    const precioServicio = document.getElementById("descripcionServicio").value.trim();

    if (!nombreServicio || !precioServicio) {
        return alert("Por favor, ingresa el nombre y el precio del servicio.");
    }

    // Obtener la lista guardada o crear una nueva
    const serviciosExtra = JSON.parse(localStorage.getItem("serviciosExtra")) || [];
    
    // Guardar el nuevo servicio
    serviciosExtra.push({ nombre: nombreServicio, precio: precioServicio });
    localStorage.setItem("serviciosExtra", JSON.stringify(serviciosExtra));

    alert(`Servicio "${nombreServicio}" agregado exitosamente por $${precioServicio}.`);
    
    // Limpiar los campos después de guardar
    document.getElementById("nombreServicio").value = "";
    document.getElementById("descripcionServicio").value = "";
}

// Ejecución inicial
inyectarFooter();
inyectarHeader();
cargarPrecios();