window.addEventListener('load', () => {
  const video = document.querySelector('.hero-video');
  // Solo mostramos el video cuando esté listo para reproducirse
  video.oncanplaythrough = function() {
    video.style.opacity = 1;
  };
});

// 1. Efecto Scroll de la Navbar (Se mantiene igual, funciona perfecto)
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Selecciones principales para el menú móvil
const hamburger = document.querySelector('.hamburger');
const navWrapper = document.querySelector('.nav-wrapper');
const body = document.body; // Seleccionamos el body para controlar el scroll

// 2. Menú Móvil (Hamburguesa) y Bloqueo de Scroll
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navWrapper.classList.toggle('active');
    
    // Si el menú está abierto, evitamos que la página de fondo haga scroll
    if (navWrapper.classList.contains('active')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = ''; // Restaura el comportamiento normal
    }
});

// 3. Dropdown en Móvil (Efecto Acordeón)
const dropdownMenu = document.querySelector('.dropdown');
const dropMenuContent = document.querySelector('.dropdown-menu');

dropdownMenu.addEventListener('click', (e) => {
    // Solo activar comportamiento en pantallas móviles/tablets
    if (window.innerWidth <= 992) {
        // Verificamos si se hizo clic en el enlace principal "Servicios" y no en los sub-enlaces
        if(e.target.tagName.toLowerCase() === 'a' && e.target.nextElementSibling) {
            e.preventDefault(); // Evita el salto en la página
            
            // Alternamos las clases para girar el ícono (+) y mostrar el submenú
            dropdownMenu.classList.toggle('active'); 
            dropMenuContent.classList.toggle('active'); 
        }
    }
});

// 4. (NUEVO) Cerrar el menú automáticamente al hacer clic en un enlace
// Seleccionamos todos los links del menú, EXCEPTO el que abre el dropdown ("Servicios")
const navLinks = document.querySelectorAll('.nav-links a:not(.dropdown > a)'); 

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Solo ejecutamos el cierre si el menú móvil está abierto
        if (navWrapper.classList.contains('active')) {
            hamburger.classList.remove('active');
            navWrapper.classList.remove('active');
            body.style.overflow = ''; // Devolvemos el scroll a la página
            
            // Opcional: Contraemos el menú "Servicios" para que esté cerrado la próxima vez
            dropdownMenu.classList.remove('active');
            dropMenuContent.classList.remove('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.5 // Se activa cuando el 50% de la sección es visible
    };

    const countUp = (entry) => {
        const target = entry.target;
        const endValue = parseInt(target.innerText.replace('+', '')); // Extrae el 500
        let startValue = 0;
        const duration = 4000; // 4 segundos de animación
        const stepTime = Math.abs(Math.floor(duration / endValue));

        const timer = setInterval(() => {
            startValue += 5; // Incrementos de 5 para que sea más fluido
            if (startValue >= endValue) {
                target.innerText = `+${endValue}`;
                clearInterval(timer);
            } else {
                target.innerText = `+${startValue}`;
            }
        }, stepTime);
    };

    // Dentro de tu DOMContentLoaded...
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Si es el número, lo contamos
                if (entry.target.classList.contains('number')) {
                    countUp(entry);
                } 
                // Si es la grilla de logos, los revelamos uno a uno
                else if (entry.target.classList.contains('logo-matrix')) {
                    const cards = entry.target.querySelectorAll('.logo-card');
                    cards.forEach(card => card.classList.add('reveal'));
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observamos tanto el número como la grilla completa
    const numberElement = document.querySelector('.impact-number .number');
    const logoMatrix = document.querySelector('.logo-matrix');

    if (numberElement) observer.observe(numberElement);
    if (logoMatrix) observer.observe(logoMatrix);
});

document.addEventListener('DOMContentLoaded', () => {
    // Lógica para las Pestañas Técnicas
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Quitar clase 'active' de todos los botones y paneles
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            // 2. Añadir clase 'active' al botón clickeado
            btn.classList.add('active');

            // 3. Mostrar el panel correspondiente
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
});