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

    if (!track || !viewport) return;

    // 1. CLONAR CONTENIDO PARA EL LOOP
    const slides = Array.from(track.children);
    slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        track.appendChild(clone);
    });

    let isDragging = false;
    let startX;
    let scrollLeft;
    let animationId = null; // Inicializamos en null
    let currentTranslate = 0;
    
    const speed = 0.8; 

    function checkLoop() {
        const halfWidth = track.scrollWidth / 2;
        if (currentTranslate <= -halfWidth) {
            currentTranslate += halfWidth; 
        } else if (currentTranslate > 0) {
            currentTranslate -= halfWidth;
        }
    }

    function step() {
        if (!isDragging) {
            currentTranslate -= speed;
            checkLoop();
            track.style.transform = `translateX(${currentTranslate}px)`;
        }
        // Guardamos el ID para poder cancelarlo luego
        animationId = requestAnimationFrame(step);
    }

    function startDrag(e) {
        isDragging = true;
        viewport.style.cursor = 'grabbing';
        
        // IMPORTANTE: Cancelamos cualquier animación activa al empezar a arrastrar
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        scrollLeft = currentTranslate;
    }

    function drag(e) {
        if (!isDragging) return;
        
        const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        const walk = (x - startX);
        currentTranslate = scrollLeft + walk;

        checkLoop();
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function endDrag() {
        if (!isDragging) return; // Evita ejecuciones extra
        isDragging = false;
        viewport.style.cursor = 'grab';
        
        // IMPORTANTE: Limpiamos antes de reiniciar para evitar duplicados
        cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(step);
    }

    // Listeners
    viewport.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', endDrag);
    
    // Touch
    viewport.addEventListener('touchstart', startDrag, {passive: true});
    window.addEventListener('touchmove', drag, {passive: true});
    window.addEventListener('touchend', endDrag);

    // Iniciar animación por primera vez
    animationId = requestAnimationFrame(step);
});

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const btn = document.getElementById('submitBtn');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        btn.disabled = true;
        btn.innerHTML = 'Procesando... <span class="spinner"></span>';
        
        const data = new FormData(contactForm);

        try {
            const response = await fetch('https://formspree.io/f/mnjowwzy', {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                status.innerHTML = "Mensaje enviado con éxito. Un especialista se contactará en breve.";
                status.className = "form-status-message success";
                contactForm.reset(); 
            } else {
                throw new Error();
            }
        } catch (error) {
            status.innerHTML = "Error al enviar. Por favor, intente vía email directo.";
            status.className = "form-status-message error";
        } finally {
            btn.disabled = false;
            // Ajustado para mantener consistencia con el HTML
            btn.innerHTML = 'Enviar consulta <span class="arrow">→</span>';
        }
    });
});
