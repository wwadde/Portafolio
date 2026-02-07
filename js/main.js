// Iconos optimizados - Sin dependencias externas
import { displayProjects } from './projects.js';
import { toggleLang, applyTranslations, t, getLang } from './i18n.js';
import emailjs from '@emailjs/browser';

document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const langToggle = document.getElementById('lang-toggle');

    

    // Diferir la inicialización de EmailJS hasta que sea necesario
    let emailJSInitialized = false;

    function showSection(targetId) {
        sections.forEach(section => section.classList.remove('active'));

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.classList.add('loading');
        }

        navLinks.forEach(link => link.classList.remove('active'));

        const activeLink = document.querySelector(`a[href="${targetId}"]`);
        if (activeLink) activeLink.classList.add('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            showSection(targetId);

            if (targetId === '#contact') displayContactInfo();
            if (targetId === '#cv') {
                // Cargar CV de forma segura
                updateCV();
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
                showSection(targetId);
                if (targetId === '#contact') displayContactInfo();
                if (targetId === '#cv') {
                    updateCV();
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
        updateCV();
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
                .then(function(response) {
                    console.log('Email enviado con éxito!', response.status, response.text);
                    alert(t('contact.success') || '¡Mensaje enviado con éxito! Te contactaré pronto.');
                    contactForm.reset();
                }, function(error) {
                    console.error('Error al enviar email:', error);
                    alert(t('contact.error') || 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
                })
                .finally(function() {
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
    });

    applyTranslations();
    displayProjects();
});

function displayContactInfo() {
    const elm1 = document.getElementById('em-obf');
    const elm2 = document.getElementById('ph-obf');

    const p1 = "d2lsbGlhbQ==";
    const p2 = "d2FkZGU=";
    const p3 = "Z21haWw=";
    const p4 = "Y29t";

    const p5 = "NTc=";
    const p6 = "MzEx";
    const p7 = "NTU1";
    const p8 = "MzIyNQ==";
    const todojunto1 = `${atob(p1)}${atob(p2)}@${atob(p3)}.${atob(p4)}`;
    const todojunto2 = `+${atob(p5)} ${atob(p6)}${atob(p7)}${atob(p8)}`;
    elm1.innerHTML = `<a href="mailto:${todojunto1}">${todojunto1}</a>`;
    elm2.innerHTML = todojunto2;
}

function updateCV() {
    const lang = getLang();
    const cvPath = `/assets/CV_William Wadde_${lang}.pdf`;
    
    const cvViewer = document.getElementById('cv-viewer');
    const cvDownload = document.getElementById('cv-download');
    const cvDownloadFallback = document.getElementById('cv-download-fallback');
    
    if (!cvViewer && !cvDownload) {
        console.warn('No se han encontrado los elementos para mostrar o descargar el CV.');
        return;
    }
    
    // Actualizar elementos de forma segura
    cvViewer?.setAttribute('src', cvPath);
    cvDownload?.setAttribute('href', cvPath);
    cvDownloadFallback?.setAttribute('href', cvPath);
}