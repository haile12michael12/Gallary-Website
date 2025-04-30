/**
 * Modal Functionality
 * Manages the fullscreen preview modal for gallery items
 */

// Keep track of current modal state
const modalState = {
    isOpen: false,
    currentId: null,
    isZoomed: false
};

/**
 * Initialize modal handlers
 */
function initModalHandlers() {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalImage = document.getElementById('modal-image');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Close modal when clicking close button
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking outside content
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalState.isOpen) {
            closeModal();
        } else if (e.key === 'ArrowLeft' && modalState.isOpen) {
            navigateModal('prev');
        } else if (e.key === 'ArrowRight' && modalState.isOpen) {
            navigateModal('next');
        }
    });
    
    // Toggle zoom when clicking on the modal image
    modalImage.addEventListener('click', (e) => {
        // Prevent event from bubbling to the overlay
        e.stopPropagation();
        
        toggleModalZoom();
    });
    
    // Navigation buttons
    prevBtn.addEventListener('click', () => navigateModal('prev'));
    nextBtn.addEventListener('click', () => navigateModal('next'));
}

/**
 * Open the image modal with a specific gallery item
 * @param {string} id - ID of the gallery item to show
 */
function openImageModal(id) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalImage = document.getElementById('modal-image');
    const modalTags = document.getElementById('modal-tags');
    
    // Find the gallery item
    const galleryItem = document.querySelector(`.gallery-item[data-id="${id}"]`);
    
    if (!galleryItem) return;
    
    // Get image source and tags
    const imgSrc = galleryItem.querySelector('.gallery-image').src;
    const tags = galleryItem.dataset.tags ? galleryItem.dataset.tags.split(',') : [];
    
    // Set modal content
    modalImage.src = imgSrc;
    
    // Clear previous tags
    modalTags.innerHTML = '';
    
    // Add tags
    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'modal-tag';
        tagElement.textContent = tag;
        modalTags.appendChild(tagElement);
    });
    
    // Save current state
    modalState.isOpen = true;
    modalState.currentId = id;
    modalState.isZoomed = false;
    
    // Show modal with animation
    modalOverlay.classList.add('active');
    
    // Disable page scrolling
    document.body.style.overflow = 'hidden';
}

/**
 * Close the image modal
 */
function closeModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.querySelector('.modal-content');
    
    // Reset zoom if active
    if (modalState.isZoomed) {
        modalContent.classList.remove('modal-zoom-in');
    }
    
    // Hide modal with animation
    modalOverlay.classList.remove('active');
    
    // Reset state
    modalState.isOpen = false;
    modalState.currentId = null;
    modalState.isZoomed = false;
    
    // Re-enable page scrolling
    document.body.style.overflow = '';
}

/**
 * Toggle zoom in/out of the modal image
 */
function toggleModalZoom() {
    const modalContent = document.querySelector('.modal-content');
    
    if (modalState.isZoomed) {
        modalContent.classList.remove('modal-zoom-in');
    } else {
        modalContent.classList.add('modal-zoom-in');
    }
    
    modalState.isZoomed = !modalState.isZoomed;
}

/**
 * Navigate to the previous or next gallery item
 * @param {string} direction - 'prev' or 'next'
 */
function navigateModal(direction) {
    if (!modalState.currentId) return;
    
    // Get all visible gallery items
    const visibleItems = Array.from(document.querySelectorAll('.gallery-item[style="display: block;"], .gallery-item:not([style])'));
    
    if (visibleItems.length <= 1) return;
    
    // Find current index
    const currentIndex = visibleItems.findIndex(item => item.dataset.id === modalState.currentId);
    
    if (currentIndex === -1) return;
    
    let nextIndex;
    
    if (direction === 'prev') {
        nextIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    } else {
        nextIndex = (currentIndex + 1) % visibleItems.length;
    }
    
    // Get next item and open its modal
    const nextItem = visibleItems[nextIndex];
    openImageModal(nextItem.dataset.id);
}
