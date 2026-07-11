import { animate } from 'animejs';

export function initSectionNavigation({
    navLinks = document.querySelectorAll('.nav-link'),
    hamburger = document.querySelector('.hamburger'),
    navMenu = document.querySelector('.nav-menu'),
    sections = Array.from(document.querySelectorAll('.section')),
    onLazySectionsReveal = () => {},
} = {}) {
    const persistentSectionIds = new Set(['#home', '#about', '#projects']);
    const lazySectionIds = new Set(['#cv', '#contact']);
    const persistentSections = sections.filter(section => persistentSectionIds.has(`#${section.id}`));
    const lazySections = sections.filter(section => lazySectionIds.has(`#${section.id}`));
    const revealedSections = new Set(['home']);
    let lazySectionsRevealed = false;
    let scrollSyncPending = false;

    persistentSections.forEach(section => section.classList.add('active'));

    function setActiveNav(targetId) {
        navLinks.forEach(link => link.classList.remove('active'));

        const activeLink = document.querySelector(`a[href="${targetId}"]`);
        if (activeLink) activeLink.classList.add('active');
    }

    function getSectionInView() {
        const activationLine = window.innerHeight * 0.35;
        let currentSectionId = '#home';

        sections.forEach(section => {
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

    function playSectionReveal(section) {
        if (!section || revealedSections.has(section.id)) {
            return;
        }

        revealedSections.add(section.id);
        animate(section, {
            opacity: [0, 1],
            translateY: [28, 0],
            duration: 1100,
            easing: 'easeOutExpo'
        });
    }

    const sectionRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            playSectionReveal(entry.target);
        });
    }, {
        threshold: 0.35,
    });

    sections.forEach(section => {
        if (section.id !== 'home') {
            sectionRevealObserver.observe(section);
        }
    });

    function revealLazySections() {
        if (lazySectionsRevealed) {
            return;
        }

        lazySectionsRevealed = true;

        lazySections.forEach(section => {
            section.classList.add('active');
        });

        onLazySectionsReveal();
        syncNavbarToScroll();
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

            navMenu?.classList.remove('active');
            hamburger?.classList.remove('active');
        });
    });

    document.querySelectorAll('[href="#projects"], [href="#contact"]').forEach(btn => {
        if (btn.closest('.section')) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                navigateTo(targetId);
            });
        }
    });

    hamburger?.addEventListener('click', function () {
        navMenu?.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('nav');
        if (navbar) {
            navbar.style.background = window.scrollY > 100
                ? 'rgba(255, 255, 255, 0.98)'
                : 'rgba(255, 255, 255, 0.95)';
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

    syncNavbarToScroll();

    return {
        syncNavbarToScroll,
        revealLazySections,
    };
}
