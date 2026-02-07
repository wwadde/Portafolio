import { t, getLang } from './i18n.js';
import { initImageModal } from './imageModal.js';

const projects = [
    {
        title: {
            es: "Cobranza",
            en: "Collections Management",
        },
        description: {
            es: "Plataforma web <strong>en producción</strong> para gestionar préstamos y cobranzas con roles diferenciados (Administrador/Cobrador). Incluye generación automática de recibos PDF, dashboards con estadísticas en tiempo real, control de morosos, reestructuración de créditos y sistema completo de reportería profesional. <a href='https://www.linkedin.com/feed/update/urn:li:activity:7399551069430751234/' target='_blank' rel='noopener noreferrer' class='text-blue-600 hover:text-blue-800 underline hover:no-underline font-medium'>Ver post en LinkedIn</a>",
            en: "Web platform <strong>in production</strong> for managing loans and collections with differentiated roles (Admin/Collector). Features automatic PDF receipt generation, real-time statistics dashboards, delinquency control, credit restructuring, and comprehensive professional reporting system. <a href='https://www.linkedin.com/feed/update/urn:li:activity:7399551069430751234/' target='_blank' rel='noopener noreferrer' class='text-blue-600 hover:text-blue-800 underline hover:no-underline font-medium'>View LinkedIn Post</a>",
        },
        technologies: [
            "Java", "Springboot", "PostgreSQL", "Docker", "JavaScript",
            "TailwindCSS", "JasperReports", "Prometheus", "Grafana", "JTE",
            "JUnit", "Mockito",
        ],
        link: "https://cobranza.work",
        images: [
            "/assets/projects/cobranza/cobrador.webp",
            "/assets/projects/cobranza/credito-detalle.webp",
            "/assets/projects/cobranza/creditos-generales.webp",
            "/assets/projects/cobranza/estadisticas-cobradores.webp",
            "/assets/projects/cobranza/estadisticas-generales.webp",
            "/assets/projects/cobranza/inicio-admin.webp",
            "/assets/projects/cobranza/login.webp",
            "/assets/projects/cobranza/morosos.webp",
            "/assets/projects/cobranza/recibo.webp",
            "/assets/projects/cobranza/estructura-proyecto.webp"
        ],
    },
    {
        title: {
            es: "Sistema Bancario de Créditos",
            en: "Banking Credit System",
        },
        description: {
            es: "Sistema completo de gestión de créditos bancarios con arquitectura de microservicios, incluyendo autenticación JWT, API Gateway, descubrimiento dinámico de servicios con Eureka y balanceo de carga. Gestiona clientes, cuentas y créditos con seguridad empresarial y alta disponibilidad.",
            en: "Complete banking credit management system with microservices architecture, featuring JWT authentication, API Gateway, dynamic service discovery with Eureka and load balancing. Manages clients, accounts and credits with enterprise-level security and high availability.",
        },
        technologies: [
            "Spring Boot", "Spring Cloud", "Eureka", "OAuth2",
            "API Gateway", "Feign Client", "Circuit Breaker", "Angular 20",
            "TypeScript", "JWT", "Maven", "REST API",
        ],
        link: "https://github.com/wwadde/simulacion-credito-bancario",
        images: [
            "/assets/projects/banco/eureka-discovery.webp",
            "/assets/projects/banco/credito-service.webp",
            "/assets/projects/banco/cuenta-service.webp",
            "/assets/projects/banco/persona-service.webp",
            "/assets/projects/banco/servicios.webp"
        ],
    },
    {
        title: {
            es: "Sistema de Gestión de Rutas de Transporte",
            en: "Transportation Route Management System",
        },
        description: {
            es: "Sistema backend REST API para gestionar flotas de vehículos, conductores y rutas de transporte con geocodificación automática de paradas usando Google Maps API. Incluye validación automática de licencias y documentos vehiculares, carga masiva de rutas desde Excel y tareas programadas para mantener la integridad de datos.",

            en: "REST API backend system for managing vehicle fleets, drivers, and transportation routes with automatic geocoding of stops using Google Maps API. Features automated license and vehicle document validation, bulk route loading from Excel, and scheduled tasks to maintain data integrity.",
        },
        technologies: [
            "Java", "Spring Boot", "PostgreSQL", "Google Maps API",
            "Apache POI", "JWT", "Spring Security", "Spring Scheduler",
            "JPA/Hibernate", "Stored Procedures", "REST API", "Maven"
        ],
        link: "https://github.com/wwadde/trayectos",
        images: [
            "/assets/projects/trayecto/mapa.webp",
            "/assets/projects/trayecto/swagger.webp",
            "/assets/projects/trayecto/procedimientos-almacenados.webp"
        ],
    }
];

export function displayProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    container.innerHTML = '';

    const lang = getLang();

    projects.forEach((project, projectIndex) => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl overflow-hidden shadow-brand hover:-translate-y-2 hover:shadow-brand-hover transition-all duration-300';

        const title = project.title[lang] ?? project.title.es;
        const description = project.description[lang] ?? project.description.es;

        let imageSection;
        if (project.images && project.images.length > 0) {
            const hasMultiple = project.images.length > 1;
            const carouselId = `carousel-${projectIndex}`;

            imageSection = `
                <div class="relative h-48 group" data-carousel="${carouselId}" data-project-index="${projectIndex}">
                    ${project.images.map((img, idx) => `
                        <img src="${img}" 
                             alt="${title} - imagen ${idx + 1}" 
                             class="project-img absolute inset-0 transition-opacity duration-500 ${idx === 0 ? 'opacity-100' : 'opacity-0'}" 
                             data-slide="${idx}"
                             loading="lazy"
                             decoding="async">
                    `).join('')}
                    
                    ${hasMultiple ? `
                        <!-- Botones de navegación -->
                        <button class="carousel-btn carousel-prev absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                                data-carousel-target="${carouselId}" data-action="prev" title="Anterior">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                        <button class="carousel-btn carousel-next absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                                data-carousel-target="${carouselId}" data-action="next" title="Siguiente">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                        
                        <!-- Indicadores -->
                        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                            ${project.images.map((_, idx) => `
                                <button class="carousel-indicator w-2 h-2 rounded-full transition-all duration-300 ${idx === 0 ? 'bg-white w-6' : 'bg-white/50'}"
                                        data-carousel-target="${carouselId}" 
                                        data-slide-to="${idx}"></button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            imageSection = `
                <div class="h-48 gradient-bg flex justify-center items-center">
                    <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </div>
            `;
        }

        const techBadges = project.technologies
            .map(tech => `<span class="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">${tech}</span>`)
            .join('');

        card.innerHTML = `
            ${imageSection}
            <div class="p-5 sm:p-6">
                <h3 class="text-primary font-bold text-lg sm:text-xl mb-2">${title}</h3>
                <p class="text-gray-500 leading-relaxed mb-4 text-sm sm:text-base">${description}</p>
                <div class="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                    ${techBadges}
                </div>
                <div class="flex justify-center">
                    <a href="${project.link}" target="_blank" rel="noopener noreferrer"
                       class="inline-block text-primary font-semibold border-2 border-primary px-4 py-2 rounded-lg no-underline hover:bg-primary hover:text-white transition-all duration-300 text-sm sm:text-base">
                        ${t('projects.view')}
                    </a>
                </div>
            </div>
        `;

        container.appendChild(card);
    });

    const carousels = initCarousels();
    initImageModal(projects, carousels);
}

function initCarousels() {
    const carousels = new Map();

    document.querySelectorAll('[data-carousel]').forEach(carousel => {
        const id = carousel.dataset.carousel;
        const slides = carousel.querySelectorAll('[data-slide]');
        if (slides.length === 0) return;

        carousels.set(id, {
            currentIndex: 0,
            totalSlides: slides.length,
            slides,
            indicators: carousel.querySelectorAll('.carousel-indicator'),
        });

        setupTouchEvents(carousel, id, carousels);
    });

    document.querySelectorAll('.carousel-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.dataset.carouselTarget;
            const action = btn.dataset.action;
            const state = carousels.get(target);
            if (!state) return;

            if (action === 'prev') {
                state.currentIndex = (state.currentIndex - 1 + state.totalSlides) % state.totalSlides;
            } else if (action === 'next') {
                state.currentIndex = (state.currentIndex + 1) % state.totalSlides;
            }

            updateCarousel(state);
        });
    });

    document.querySelectorAll('.carousel-indicator').forEach(indicator => {
        indicator.addEventListener('click', (e) => {
            e.preventDefault();
            const target = indicator.dataset.carouselTarget;
            const slideTo = parseInt(indicator.dataset.slideTo, 10);
            const state = carousels.get(target);
            if (!state) return;

            state.currentIndex = slideTo;
            updateCarousel(state);
        });
    });

    return carousels;
}

function setupTouchEvents(carousel, carouselId, carousels) {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe(carouselId, carousels);
    }, { passive: true });

    function handleSwipe(id, carouselsMap) {
        const state = carouselsMap.get(id);
        if (!state) return;

        const diffX = touchStartX - touchEndX;
        const diffY = Math.abs(touchStartY - touchEndY);

        if (Math.abs(diffX) < 50) return;
        if (diffY > 100) return;

        if (diffX > 0) {
            state.currentIndex = (state.currentIndex + 1) % state.totalSlides;
        } else {
            state.currentIndex = (state.currentIndex - 1 + state.totalSlides) % state.totalSlides;
        }

        updateCarousel(state);
    }
}

function updateCarousel(state) {
    state.slides.forEach((slide, idx) => {
        if (idx === state.currentIndex) {
            slide.classList.remove('opacity-0');
            slide.classList.add('opacity-100');
        } else {
            slide.classList.remove('opacity-100');
            slide.classList.add('opacity-0');
        }
    });

    state.indicators.forEach((indicator, idx) => {
        if (idx === state.currentIndex) {
            indicator.classList.remove('bg-white/50', 'w-2');
            indicator.classList.add('bg-white', 'w-6');
        } else {
            indicator.classList.remove('bg-white', 'w-6');
            indicator.classList.add('bg-white/50', 'w-2');
        }
    });
}

