/**
 * Filter Functionality
 * Manages the filtering of gallery items by tags and categories
 */

/**
 * Initialize filter handlers for the filter buttons
 */
function initFilterHandlers() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });
}

/**
 * Handle filter button click
 * @param {Event} e - Click event
 */
function handleFilterClick(e) {
    const filterValue = e.target.dataset.filter;
    
    // Update active button
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        if (btn === e.target) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Apply filter
    filterGalleryByTag(filterValue);
    
    // Add a subtle animation to the gallery
    animateGalleryFilter();
}

/**
 * Apply animation to gallery when filter changes
 */
function animateGalleryFilter() {
    const gallery = document.getElementById('gallery-container');
    
    // Add subtle animation class
    gallery.classList.add('filtering');
    
    // Remove class after animation completes
    setTimeout(() => {
        gallery.classList.remove('filtering');
    }, 400);
}

/**
 * Get all unique tags from the gallery items
 * @returns {string[]} Array of unique tags
 */
function getAllUniqueTags() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const allTags = new Set();
    
    galleryItems.forEach(item => {
        const itemTags = item.dataset.tags ? item.dataset.tags.split(',') : [];
        itemTags.forEach(tag => allTags.add(tag));
    });
    
    return Array.from(allTags);
}

/**
 * Update the filter buttons based on available tags
 * This can be used to dynamically add new filter options as tags are added
 */
function updateFilterButtons() {
    const filterNav = document.querySelector('.filter-options');
    const uniqueTags = getAllUniqueTags();
    
    // Keep standard filters
    const standardFilters = ['all', 'nature', 'urban', 'abstract', 'space', 'custom'];
    
    // Find new tags that aren't in standard filters
    const newTags = uniqueTags.filter(tag => !standardFilters.includes(tag));
    
    // If we have new tags, add them as filters
    if (newTags.length > 0) {
        newTags.forEach(tag => {
            // Check if button already exists
            const existingButton = document.querySelector(`.filter-btn[data-filter="${tag}"]`);
            if (!existingButton) {
                const newButton = document.createElement('button');
                newButton.className = 'filter-btn';
                newButton.dataset.filter = tag;
                newButton.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
                newButton.addEventListener('click', handleFilterClick);
                
                filterNav.appendChild(newButton);
            }
        });
    }
}
