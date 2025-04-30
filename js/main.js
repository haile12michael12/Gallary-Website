/**
 * Main Application File
 * Initializes the gallery application and coordinates all components
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Futuristic Gallery Application Initialized');
    
    // Initialize the local storage
    initLocalStorage();
    
    // Load saved gallery items
    loadGalleryFromStorage();
    
    // Initialize all event listeners
    initEventListeners();
    
    // Show loading animation
    showLoadingAnimation();
});

/**
 * Initialize all event listeners for the application
 */
function initEventListeners() {
    // Initialize the upload functionality
    initUploadHandlers();
    
    // Initialize the filter functionality
    initFilterHandlers();
    
    // Initialize the modal functionality
    initModalHandlers();
    
    // Initialize search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    searchBtn.addEventListener('click', () => {
        const searchText = searchInput.value.trim().toLowerCase();
        searchGallery(searchText);
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchText = searchInput.value.trim().toLowerCase();
            searchGallery(searchText);
        }
    });
}

/**
 * Search through gallery items by tags or text content
 * @param {string} searchText - Text to search for in the gallery
 */
function searchGallery(searchText) {
    if (!searchText) {
        // If search is empty, show all gallery items
        resetFilters();
        return;
    }
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    let foundItems = false;
    
    galleryItems.forEach(item => {
        const tags = item.dataset.tags ? item.dataset.tags.toLowerCase() : '';
        
        if (tags.includes(searchText)) {
            item.style.display = 'block';
            foundItems = true;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Update empty state visibility
    toggleEmptyState(!foundItems);
    
    // Reset active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

/**
 * Reset all filters and show all gallery items
 */
function resetFilters() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.style.display = 'block';
    });
    
    // Activate "All" filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === 'all') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update empty state
    checkGalleryEmpty();
}

/**
 * Show a simulated loading animation
 */
function showLoadingAnimation() {
    const gallery = document.getElementById('gallery-container');
    
    // Apply animation to gallery items
    setTimeout(() => {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('fade-in');
            }, index * 100);
        });
    }, 300);
}

/**
 * Show or hide the empty state message based on gallery content
 */
function checkGalleryEmpty() {
    const gallery = document.getElementById('gallery-container');
    const emptyState = document.getElementById('empty-gallery');
    const visibleItems = document.querySelectorAll('.gallery-item[style="display: block;"], .gallery-item:not([style])').length;
    
    toggleEmptyState(visibleItems === 0);
}

/**
 * Toggle visibility of the empty state message
 * @param {boolean} isEmpty - Whether the gallery is empty
 */
function toggleEmptyState(isEmpty) {
    const emptyState = document.getElementById('empty-gallery');
    
    if (isEmpty) {
        emptyState.style.display = 'flex';
    } else {
        emptyState.style.display = 'none';
    }
}
