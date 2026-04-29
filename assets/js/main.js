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
const dropdowns = document.querySelectorAll('.mx-dropdown');

dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('a');
    const menu = dropdown.querySelector('.mx-dropdown-menu');

    dropdown.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
            if (e.target === trigger && menu) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                menu.classList.toggle('active');
            }
        }
    });
});

// 3. Cerrar menú al hacer clic en cualquier link (Lógica que tenías cortada)
const navLinks = document.querySelectorAll('.mx-nav-links a:not(.mx-dropdown > a), .lang-link');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Solo cerramos si el menú móvil está abierto
        if (navWrapper.classList.contains('active')) {
            hamburger.classList.remove('active');
            navWrapper.classList.remove('active');
            body.style.overflow = '';
            
            // Opcional: Cerrar también el dropdown si estaba abierto
            document.querySelectorAll('.mx-dropdown').forEach(d => d.classList.remove('active'));
            document.querySelectorAll('.mx-dropdown-menu').forEach(m => m.classList.remove('active'));
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
    
    function initInfiniteSlider(viewportId, trackId, customSpeed = 0.8) {
        const viewport = document.getElementById(viewportId);
        const track = document.getElementById(trackId);

        if (!viewport || !track) return;

        // 1. CLONAR CONTENIDO (Tu lógica original)
        const slides = Array.from(track.children);
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            track.appendChild(clone);
        });

        let isDragging = false;
        let isMovingViaArrow = false; // Nueva: para no pelear con la animación suave
        let startX;
        let scrollLeft;
        let animationId = null;
        let currentTranslate = 0;
        const speed = customSpeed;

        function checkLoop() {
            const halfWidth = track.scrollWidth / 2;
            if (currentTranslate <= -halfWidth) {
                currentTranslate += halfWidth;
            } else if (currentTranslate > 0) {
                currentTranslate -= halfWidth;
            }
        }

        function step() {
            // El automático solo corre si no estamos arrastrando ni usando flechas
            if (!isDragging && !isMovingViaArrow) {
                currentTranslate -= speed;
                checkLoop();
                track.style.transform = `translateX(${currentTranslate}px)`;
            }
            animationId = requestAnimationFrame(step);
        }

        // --- LÓGICA DE FLECHAS (Integrada con el Drag) ---
        function moveViaArrow(direction) {
            if (isMovingViaArrow) return; 

            isMovingViaArrow = true;
            const jump = 350; // Píxeles que avanza la flecha
            
            // Aplicamos transición solo para este movimiento
            track.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            
            currentTranslate += (direction * jump);
            checkLoop();
            
            track.style.transform = `translateX(${currentTranslate}px)`;

            // Al terminar la transición, devolvemos el control al automático/drag
            setTimeout(() => {
                track.style.transition = 'none';
                isMovingViaArrow = false;
            }, 600);
        }

        // Asignar eventos a las flechas dentro de este slider
        const btnPrev = viewport.querySelector('.prev');
        const btnNext = viewport.querySelector('.next');

        if (btnPrev) btnPrev.addEventListener('click', () => moveViaArrow(1));
        if (btnNext) btnNext.addEventListener('click', () => moveViaArrow(-1));

        // --- LÓGICA DE DRAG (Mantiene tu funcionalidad de dedo/mouse) ---
        function startDrag(e) {
            if (isMovingViaArrow) return; // Si se está moviendo por flecha, esperamos
            
            if (e.type === 'mousedown') e.preventDefault(); 
            isDragging = true;
            viewport.style.cursor = 'grabbing';
            
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }

            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
            scrollLeft = currentTranslate;
            track.style.transition = 'none'; // Aseguramos que no haya lag al arrastrar
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
            if (!isDragging) return;
            isDragging = false;
            viewport.style.cursor = 'grab';
            
            cancelAnimationFrame(animationId);
            animationId = requestAnimationFrame(step);
        }

        // Listeners del Viewport
        viewport.addEventListener('mousedown', startDrag);
        viewport.addEventListener('touchstart', startDrag, {passive: true});

        // Listeners Globales
        window.addEventListener('mousemove', drag);
        window.addEventListener('touchmove', drag, {passive: true});
        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);
        
        track.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });

        animationId = requestAnimationFrame(step);
    }

    // Inicialización
    initInfiniteSlider('trustSlider', 'trustTrack', 0.8);
    initInfiniteSlider('industriesSlider', 'industriesTrack', 0.6); 
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

document.addEventListener('DOMContentLoaded', () => {
    const langLinks = document.querySelectorAll('.lang-link');
    const pathParts = window.location.pathname.split('/');
    
    const isEnglish = pathParts.includes('en');

    langLinks.forEach(link => {
        const isLinkEnglish = link.getAttribute('href').includes('/en/');

        if (isEnglish === isLinkEnglish) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.2 // Se activa cuando el 20% del elemento es visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    // Seleccionamos todos los elementos con la clase reveal-item
    const itemsToReveal = document.querySelectorAll('.reveal-item');
    itemsToReveal.forEach(el => observer.observe(el));
});


document.addEventListener("DOMContentLoaded", () => {
    const video = document.querySelector(".video-background");
    if (video) {
        video.play().catch(() => {});
    }
});