import { displayProjects } from './projects.js';
import { toggleLang, applyTranslations, t, getLang } from './i18n.js';
import emailjs from '@emailjs/browser';
import { animate } from 'animejs';
import { initCodeEditor } from "./editor.js";
import { showBootScreen } from "./terminal.js";

let contactInfoLoaded = false;
let cvLoaded = false;
let lazySectionsRevealed = false;

document.addEventListener('DOMContentLoaded', async function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const allSections = Array.from(document.querySelectorAll('.section'));
    const persistentSections = document.querySelectorAll('#home, #about, #projects');
    const lazySections = document.querySelectorAll('#cv, #contact');
    const persistentSectionIds = new Set(['#home', '#about', '#projects']);
    const lazySectionIds = new Set(['#cv', '#contact']);
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const langToggle = document.getElementById('lang-toggle');
    const revealedSections = new Set(['home']);
    let scrollSyncPending = false;
    const sectionRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const section = entry.target;

            if (revealedSections.has(section.id)) {
                return;
            }

            revealedSections.add(section.id);
            animate(section, {
                opacity: [0, 1],
                translateY: [28, 0],
                duration: 1100,
                easing: 'easeOutExpo'
            });
        });
    }, {
        threshold: 0.35,
    });



    // Diferir la inicialización de EmailJS hasta que sea necesario
    let emailJSInitialized = false;

    persistentSections.forEach(section => section.classList.add('active'));
    allSections.forEach(section => {
        if (section.id !== 'home') {
            sectionRevealObserver.observe(section);
        }
    });

    

    function setActiveNav(targetId) {
        navLinks.forEach(link => link.classList.remove('active'));

        const activeLink = document.querySelector(`a[href="${targetId}"]`);
        if (activeLink) activeLink.classList.add('active');
    }

    function getSectionInView() {
        const activationLine = window.innerHeight * 0.35;
        let currentSectionId = '#home';

        allSections.forEach(section => {
            if (!section.classList.contains('active')) {
                return;
            }

            const rect = section.getBoundingClientRect();
            if (rect.top <= activationLine) {
                currentSectionId = `#${section.id}`;
            }
        });

        return currentSectionId;
    }

    function syncNavbarToScroll() {
        setActiveNav(getSectionInView());
    }

    function revealLazySections() {
        if (lazySectionsRevealed) {
            return;
        }

        lazySectionsRevealed = true;

        lazySections.forEach(section => {
            section.classList.add('active');
        });

        displayContactInfo(true);
        updateCV(true);
    }

    function navigateTo(targetId) {
        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;

        if (persistentSectionIds.has(targetId)) {
            targetSection.classList.add('active');
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveNav(targetId);
            return;
        }

        if (lazySectionIds.has(targetId)) {
            revealLazySections();
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveNav(targetId);
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            navigateTo(targetId);

            if (targetId === '#contact') displayContactInfo(true);
            if (targetId === '#cv') {
                // Cargar CV de forma segura
                updateCV(true);
            }

            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    document.querySelectorAll('[href="#projects"], [href="#contact"]').forEach(btn => {
        if (btn.closest('.section')) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                navigateTo(targetId);
                if (targetId === '#contact') displayContactInfo(true);
                if (targetId === '#cv') {
                    updateCV(true);
                }
            });
        }
    });


    hamburger.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    langToggle.addEventListener('click', function () {
        toggleLang();
        displayProjects();

        if (contactInfoLoaded || document.querySelector('#contact')?.classList.contains('active')) {
            displayContactInfo();
        }

        if (cvLoaded || document.querySelector('#cv')?.classList.contains('active')) {
            updateCV();
        }
    });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Inicializar EmailJS solo cuando se necesite
            if (!emailJSInitialized) {
                emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
                emailJSInitialized = true;
            }

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Deshabilitar botón y mostrar estado de envío
            submitBtn.disabled = true;
            submitBtn.textContent = t('contact.sending') || 'Enviando...';
            emailjs.sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                this
            )
                .then(function (response) {
                    console.log('Email enviado con éxito!', response.status, response.text);
                    alert(t('contact.success') || '¡Mensaje enviado con éxito! Te contactaré pronto.');
                    contactForm.reset();
                }, function (error) {
                    console.error('Error al enviar email:', error);
                    alert(t('contact.error') || 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
                })
                .finally(function () {
                    // Restaurar botón
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                });
        });
    }

    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('nav');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }

        if (!scrollSyncPending) {
            scrollSyncPending = true;

            window.requestAnimationFrame(() => {
                syncNavbarToScroll();
                scrollSyncPending = false;
            });
        }

        if (!lazySectionsRevealed) {
            const scrollBottom = window.scrollY + window.innerHeight;
            const pageBottom = document.documentElement.scrollHeight;

            if (scrollBottom >= pageBottom - 48) {
                revealLazySections();
            }
        }
    });


    applyTranslations();

    await showBootScreen();

    await initCodeEditor();

    displayProjects();
    syncNavbarToScroll();


});

function displayContactInfo(force = false) {

    const emailContainer = document.getElementById('email-card-obf');
    const whatsappContainer = document.getElementById('wa-obf');

    if (!emailContainer || !whatsappContainer) {
        return;
    }

    if (!force && !document.querySelector('#contact')?.classList.contains('active')) {
        return;
    }

    contactInfoLoaded = true;

    const p1 = "d2lsbGlhbQ==";
    const p2 = "d2FkZGU=";
    const p3 = "Z21haWw=";
    const p4 = "Y29t";

    const p5 = "NTc=";
    const p6 = "MzEx";
    const p7 = "NTU1";
    const p8 = "MzIyNQ==";

    const email =
        `${atob(p1)}${atob(p2)}@${atob(p3)}.${atob(p4)}`;

    const phoneDigits =
        `${atob(p5)}${atob(p6)}${atob(p7)}${atob(p8)}`;

    const phoneVisible =
        `+${atob(p5)} ${atob(p6)} ${atob(p7)} ${atob(p8)}`;

    whatsappContainer.innerHTML = `
        <a href="https://wa.me/${phoneDigits}?text=Hola%20William,%20vi%20tu%20portafolio"
           target="_blank"
           rel="noopener noreferrer"
           class="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 bg-white hover:border-primary hover:shadow-brand transition-all duration-300">

            <img src="/assets/icons/whatsapp.png"
                 alt="WhatsApp"
                 class="w-12 h-12">

            <div>
                <div class="font-semibold text-primary">
                    WhatsApp
                </div>

                <div class="text-sm text-gray-500">
                    ${phoneVisible}
                </div>
            </div>
        </a>
    `;

    emailContainer.innerHTML = `
        <div
        class="flex items-center justify-between gap-4 p-4 rounded-2xl border border-gray-200 bg-white hover:border-primary hover:shadow-brand transition-all duration-300">

        <a href="mailto:${email}"
           class="flex items-center gap-4 flex-1 min-w-0">

            <svg class="w-12 h-12 text-primary"
                 fill="currentColor"
                 viewBox="0 0 20 20">

                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>

            </svg>

            <div>
                <div class="font-semibold text-primary">
                    ${t('contact.email_label')}
                </div>

                <div class="text-sm text-gray-500">
                    ${email}
                </div>
            </div>
        </a>

        <button
            id="copy-email-btn"
            type="button"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Copiar correo">

            <svg id="copy-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-5 h-5">
                <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 17.25H18a2.25 2.25 0 002.25-2.25V7.5A2.25 2.25 0 0018 5.25h-7.5A2.25 2.25 0 008.25 7.5v2.25m0 0H6A2.25 2.25 0 003.75 12v6A2.25 2.25 0 006 20.25h6A2.25 2.25 0 0014.25 18v-6A2.25 2.25 0 0012 9.75H8.25z"/>
            </svg>

        </button>

    </div>
    `;

    setupCopyEmail(email);
}

function updateCV(force = false) {
    const lang = getLang();
    const cvPath = `/assets/CV_William Wadde_${lang}.pdf`;

    const cvViewer = document.getElementById('cv-viewer');
    const cvDownload = document.getElementById('cv-download');
    const cvDownloadFallback = document.getElementById('cv-download-fallback');

    if (!cvViewer && !cvDownload) {
        console.warn('No se han encontrado los elementos para mostrar o descargar el CV.');
        return;
    }

    if (!force && !document.querySelector('#cv')?.classList.contains('active')) {
        return;
    }

    cvLoaded = true;

    // Actualizar elementos de forma segura
    cvViewer?.setAttribute('src', cvPath);
    cvDownload?.setAttribute('href', cvPath);
    cvDownloadFallback?.setAttribute('href', cvPath);
}

function setupCopyEmail(email) {

    const copyBtn = document.getElementById('copy-email-btn');

    if (!copyBtn) {
        return;
    }

    copyBtn.addEventListener('click', async () => {

        try {

            await navigator.clipboard.writeText(email);

            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke-width="2"
                     stroke="currentColor"
                     class="w-5 h-5 text-green-600">
                    <path stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            `;

            setTimeout(() => {

                copyBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg"
                         fill="none"
                         viewBox="0 0 24 24"
                         stroke-width="2"
                         stroke="currentColor"
                         class="w-5 h-5">
                        <path stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M15.75 17.25H18a2.25 2.25 0 002.25-2.25V7.5A2.25 2.25 0 0018 5.25h-7.5A2.25 2.25 0 008.25 7.5v2.25m0 0H6A2.25 2.25 0 003.75 12v6A2.25 2.25 0 006 20.25h6A2.25 2.25 0 0014.25 18v-6A2.25 2.25 0 0012 9.75H8.25z"/>
                    </svg>
                `;

            }, 1500);

        } catch (error) {
            console.error('Error al copiar correo');
        }

    });
}