// Import projects module
import './projects.js';

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling and section navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    function showSection(targetId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.classList.add('loading');
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`a[href="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            showSection(targetId);

            if (targetId === '#contact') {
            displayContactInfo();
            }
            
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            showSection(targetId);
        });
    });

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            if (name && email && message) {
                alert('Thank you for your message! I\'ll get back to you soon.');
                this.reset();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

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