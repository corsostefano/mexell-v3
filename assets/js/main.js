window.addEventListener('load', () => {
    const video = document.querySelector('.hero-video');
    if (video) {
        video.oncanplaythrough = function() {
            video.style.opacity = 1;
        };
    }
});

// Selección de elementos
const hamburger = document.querySelector('.hamburger');
const navWrapper = document.querySelector('.mx-nav-wrapper');
const body = document.body;

// 1. Menú Móvil (Hamburguesa)
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navWrapper.classList.toggle('active');
    
    if (navWrapper.classList.contains('active')) {
        body.style.overflow = 'hidden';
    } else {
        body.style.overflow = ''; 
    }
});

// 2. Dropdown en Móvil (Efecto Acordeón)
const dropdownMenu = document.querySelector('.mx-dropdown');
const dropMenuContent = document.querySelector('.mx-dropdown-menu');

dropdownMenu.addEventListener('click', (e) => {
    if (window.innerWidth <= 992) {
        // Verifica si se hizo clic en el enlace principal
        if(e.target.tagName.toLowerCase() === 'a' && e.target.nextElementSibling) {
            e.preventDefault(); 
            dropdownMenu.classList.toggle('active');
            dropMenuContent.classList.toggle('active');
        }
    }
});

// 3. Cerrar menú al hacer clic en cualquier link (Lógica que tenías cortada)
const navLinks = document.querySelectorAll('.nav-links a:not(.mx-dropdown > a)');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Solo cerramos si el menú móvil está abierto
        if (navWrapper.classList.contains('active')) {
            hamburger.classList.remove('active');
            navWrapper.classList.remove('active');
            body.style.overflow = '';
            
            // Opcional: Cerrar también el dropdown si estaba abierto
            dropdownMenu.classList.remove('active');
            dropMenuContent.classList.remove('active');
        }
    });
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

document.querySelectorAll('.js-footer-toggle').forEach(header => {
    header.addEventListener('click', () => {
        // Solo ejecutar en pantallas pequeñas (menores a 600px)
        if (window.innerWidth <= 600) {
            const parent = header.parentElement;
            
            // Opcional: Cerrar otros acordeones al abrir uno (estilo único)
            document.querySelectorAll('.footer-col').forEach(col => {
                if (col !== parent) col.classList.remove('active');
            });

            parent.classList.toggle('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('logoTrack');
    const viewport = document.getElementById('sliderViewport');

    // Si no existen los elementos, no ejecutar (evita errores en consola)
    if (!track || !viewport) return;

    let isDragging = false;
    let startX;
    let scrollLeft;
    let animationId;
    let currentTranslate = 0;
    const speed = 0.6; 

    function step() {
        if (!isDragging) {
            currentTranslate -= speed;
            const halfWidth = track.scrollWidth / 2;
            
            if (Math.abs(currentTranslate) >= halfWidth) {
                currentTranslate = 0;
            }
            track.style.transform = `translateX(${currentTranslate}px)`;
        }
        animationId = requestAnimationFrame(step);
    }

    function startDrag(e) {
        isDragging = true;
        viewport.style.cursor = 'grabbing';
        // Soporte para mouse y touch
        startX = (e.pageX || e.touches[0].pageX);
        scrollLeft = currentTranslate;
        cancelAnimationFrame(animationId);
    }

    function drag(e) {
        if (!isDragging) return;
        const x = (e.pageX || e.touches[0].pageX);
        const walk = (x - startX);
        currentTranslate = scrollLeft + walk;

        // Loop infinito manual
        const halfWidth = track.scrollWidth / 2;
        if (currentTranslate > 0) currentTranslate = -halfWidth;
        if (Math.abs(currentTranslate) >= halfWidth) currentTranslate = 0;

        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function endDrag() {
        isDragging = false;
        viewport.style.cursor = 'grab';
        animationId = requestAnimationFrame(step);
    }

    // Listeners
    viewport.addEventListener('mousedown', startDrag);
    viewport.addEventListener('touchstart', startDrag, {passive: true});

    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag, {passive: false});

    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);

    // Iniciar
    animationId = requestAnimationFrame(step);
});

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const btn = document.getElementById('submitBtn');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        
        // 1. Estado visual de "Procesando"
        btn.disabled = true;
        btn.innerHTML = 'Procesando... <span class="spinner"></span>';
        
        const data = new FormData(contactForm);

        // 2. Envío de datos vía Fetch API
        // REEMPLAZA 'tu_id_formspree' por el código que te da Formspree.io
        try {
            const response = await fetch('https://formspree.io/f/mzdkyzdj', {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // 3. Éxito: Look Sandvik (Limpio y directo)
                status.innerHTML = "Mensaje enviado con éxito. Un especialista se contactará en breve.";
                status.className = "form-status-message success";
                contactForm.reset(); // Limpia los campos
            } else {
                throw new Error();
            }
        } catch (error) {
            // 4. Error técnico
            status.innerHTML = "Error al enviar. Por favor, intente vía email directo.";
            status.className = "form-status-message error";
        } finally {
            // Restaurar botón
            btn.disabled = false;
            btn.innerHTML = 'Enviar Solicitud <span class="arrow">→</span>';
        }
    });
});

