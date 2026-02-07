import { t, getLang } from './i18n.js';

// Modal state
let modalState = {
    isOpen: false,
    currentProject: null,
    currentImageIndex: 0,
    modal: null
};

let projectsData = [];

export function initImageModal(projects, carousels) {
    projectsData = projects;
    
    // Create modal if it doesn't exist
    if (!modalState.modal) {
        createModal();
    }

    // Add click listeners to all carousel containers
    document.querySelectorAll('[data-carousel]').forEach(carousel => {
        carousel.addEventListener('click', (e) => {
            // Check if clicked on an image
            if (e.target.classList.contains('project-img')) {
                const projectIndex = parseInt(carousel.dataset.projectIndex);
                const carouselId = carousel.dataset.carousel;
                
                // Get current slide index from carousel state
                const currentSlideIndex = carousels.get(carouselId)?.currentIndex || 0;
                
                openModal(projectIndex, currentSlideIndex);
            }
        });
    });
}

function createModal() {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-content">
            <img src="" alt="" class="modal-image">
        </div>
        <button class="modal-close" title="Cerrar">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
        </button>
        <button class="modal-nav prev" title="Anterior">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
        </button>
        <button class="modal-nav next" title="Siguiente">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
        </button>
        <div class="modal-indicators"></div>
    `;

    document.body.appendChild(modal);
    modalState.modal = modal;

    setupModalEventListeners(modal);
}

function setupModalEventListeners(modal) {
    // Close button
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    
    // Navigation buttons
    modal.querySelector('.modal-nav.prev').addEventListener('click', () => navigateModal('prev'));
    modal.querySelector('.modal-nav.next').addEventListener('click', () => navigateModal('next'));
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modalState.isOpen) return;
        
        switch (e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                navigateModal('prev');
                break;
            case 'ArrowRight':
                navigateModal('next');
                break;
        }
    });

    // Touch events for mobile
    setupModalTouchEvents(modal);
}

function openModal(projectIndex, imageIndex = 0) {
    if (!projectsData[projectIndex] || !projectsData[projectIndex].images) return;
    
    modalState.isOpen = true;
    modalState.currentProject = projectIndex;
    modalState.currentImageIndex = imageIndex;
    
    const modal = modalState.modal;
    const project = projectsData[projectIndex];
    const lang = getLang();
    const title = project.title[lang] ?? project.title.es;
    
    // Update modal image
    const modalImage = modal.querySelector('.modal-image');
    modalImage.src = project.images[imageIndex];
    modalImage.alt = `${title} - imagen ${imageIndex + 1}`;
    
    // Update indicators
    updateModalIndicators();
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Show/hide navigation based on number of images
    toggleModalNavigation(project.images.length > 1);
}

function closeModal() {
    modalState.isOpen = false;
    modalState.modal.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateModal(direction) {
    if (!modalState.isOpen || modalState.currentProject === null) return;
    
    const project = projectsData[modalState.currentProject];
    const totalImages = project.images.length;
    
    if (direction === 'prev') {
        modalState.currentImageIndex = (modalState.currentImageIndex - 1 + totalImages) % totalImages;
    } else if (direction === 'next') {
        modalState.currentImageIndex = (modalState.currentImageIndex + 1) % totalImages;
    }
    
    // Update image
    const modalImage = modalState.modal.querySelector('.modal-image');
    const lang = getLang();
    const title = project.title[lang] ?? project.title.es;
    
    modalImage.src = project.images[modalState.currentImageIndex];
    modalImage.alt = `${title} - imagen ${modalState.currentImageIndex + 1}`;
    
    // Update indicators
    updateModalIndicators();
}

function updateModalIndicators() {
    if (!modalState.isOpen || modalState.currentProject === null) return;
    
    const project = projectsData[modalState.currentProject];
    const indicatorsContainer = modalState.modal.querySelector('.modal-indicators');
    
    // Create indicators
    indicatorsContainer.innerHTML = project.images.map((_, idx) => 
        `<button class="modal-indicator ${idx === modalState.currentImageIndex ? 'active' : ''}" 
                data-index="${idx}"></button>`
    ).join('');
    
    // Add click listeners to indicators
    indicatorsContainer.querySelectorAll('.modal-indicator').forEach((indicator, idx) => {
        indicator.addEventListener('click', () => {
            modalState.currentImageIndex = idx;
            navigateModal('direct');
        });
    });
}

function toggleModalNavigation(show) {
    const modal = modalState.modal;
    const prevBtn = modal.querySelector('.modal-nav.prev');
    const nextBtn = modal.querySelector('.modal-nav.next');
    const indicators = modal.querySelector('.modal-indicators');
    
    const displayValue = show ? 'flex' : 'none';
    prevBtn.style.display = displayValue;
    nextBtn.style.display = displayValue;
    indicators.style.display = displayValue;
}

function setupModalTouchEvents(modal) {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    modal.addEventListener('touchstart', (e) => {
        if (!modalState.isOpen) return;
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
        if (!modalState.isOpen) return;
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleModalSwipe();
    }, { passive: true });

    function handleModalSwipe() {
        const diffX = touchStartX - touchEndX;
        const diffY = Math.abs(touchStartY - touchEndY);

        // Only process horizontal swipes
        if (Math.abs(diffX) < 50 || diffY > 100) return;

        if (diffX > 0) {
            navigateModal('next');
        } else {
            navigateModal('prev');
        }
    }
}