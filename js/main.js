import '@fortawesome/fontawesome-free/css/all.css';
import { displayProjects } from './projects.js';
import { toggleLang, applyTranslations, t, getLang } from './i18n.js';

document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const langToggle = document.getElementById('lang-toggle');

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

            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            if (name && email && message) {
                alert(t('contact.success'));
                this.reset();
            } else {
                alert(t('contact.error'));
            }
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
    const cvViewer = document.getElementById('cv-viewer');
    const cvDownload = document.getElementById('cv-download');
    
    const cvPath = `/assets/CV_William Wadde_${lang}.pdf`;
    
    if (cvViewer) {
        cvViewer.data = cvPath;
    }
    
    if (cvDownload) {
        cvDownload.href = cvPath;
    }
}