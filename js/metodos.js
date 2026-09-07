function inyectarFooter(){
    document.getElementById("footer").innerHTML = "<div class='footer-contenido'><p>2026 Barbería Glow Up. Todos los derechos reservados.</p><p>Contacto: +56 9 1234 5678 | Correo: contacto@glowup.cl</p></div>";
}

function inyectarHeader(){
    document.getElementById("header").innerHTML = "<div class = 'titulo'>Glow Up</div><nav class = 'nav-header'><a href='Index.html' class='nav-inicio'>Inicio</a><div><a href='reserva.html' class='btn-header'>Reserva Tu hora</a> </div><a href='inicio_sesion.html'>Inicio de sesion</a></nav>";
}

inyectarFooter();
inyectarHeader();