/**
 * Gallery Management
 * Responsible for creating, displaying, and managing gallery items
 */

/**
 * Create a gallery item from an image and associated metadata
 * @param {string} imgSrc - Base64 image data or URL
 * @param {string[]} tags - Array of tags for the image
 * @param {string} id - Unique identifier for the gallery item
 * @returns {HTMLElement} The created gallery item element
 */
function createGalleryItem(imgSrc, tags, id) {
    // Create the main container
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.dataset.id = id;
    galleryItem.dataset.tags = tags.join(',');
    
    // Create image element
    const img = document.createElement('img');
    img.className = 'gallery-image';
    img.src = imgSrc;
    img.alt = 'Gallery Image';
    img.loading = 'lazy'; // Enable lazy loading
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'gallery-item-overlay';
    
    // Create tags container
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'gallery-item-tags';
    
    // Add each tag
    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'gallery-tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
    
    // Assemble the overlay
    overlay.appendChild(tagsContainer);
    
    // Assemble the gallery item
    galleryItem.appendChild(img);
    galleryItem.appendChild(overlay);
    
    // Add click event to open modal
    galleryItem.addEventListener('click', () => {
        openImageModal(id);
    });
    
    return galleryItem;
}

/**
 * Add a new gallery item to the gallery container
 * @param {string} imgSrc - Base64 image data or URL
 * @param {string[]} tags - Array of tags for the image
 * @returns {string} The ID of the new gallery item
 */
function addGalleryItem(imgSrc, tags) {
    const galleryContainer = document.getElementById('gallery-container');
    const emptyState = document.getElementById('empty-gallery');
    
    // Generate a unique ID
    const id = 'gallery-item-' + Date.now();
    
    // Create the gallery item
    const galleryItem = createGalleryItem(imgSrc, tags, id);
    
    // Add to container
    galleryContainer.appendChild(galleryItem);
    
    // Hide empty state if visible
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Save to local storage
    saveGalleryItem({
        id: id,
        imgSrc: imgSrc,
        tags: tags
    });
    
    return id;
}

/**
 * Load all gallery items from storage
 */
function loadGalleryFromStorage() {
    const galleryItems = getGalleryItems();
    const galleryContainer = document.getElementById('gallery-container');
    const emptyState = document.getElementById('empty-gallery');
    
    // If no items, show empty state
    if (!galleryItems || galleryItems.length === 0) {
        if (emptyState) {
            emptyState.style.display = 'flex';
        }
        return;
    }
    
    // Hide empty state
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Add each item to the gallery
    galleryItems.forEach(item => {
        const galleryItem = createGalleryItem(item.imgSrc, item.tags, item.id);
        galleryContainer.appendChild(galleryItem);
    });
}

/**
 * Get all gallery items as an array
 * @return {Array} Array of gallery items in DOM order
 */
function getAllGalleryItems() {
    return Array.from(document.querySelectorAll('.gallery-item')).map(item => {
        return {
            element: item,
            id: item.dataset.id,
            tags: item.dataset.tags ? item.dataset.tags.split(',') : []
        };
    });
}

/**
 * Check if gallery has any items
 * @returns {boolean} Whether the gallery has any items
 */
function hasGalleryItems() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    return galleryItems.length > 0;
}

/**
 * Filter gallery items by tag
 * @param {string} tag - Tag to filter by
 */
function filterGalleryByTag(tag) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    let foundItems = false;
    
    galleryItems.forEach(item => {
        // If filter is "all", show everything
        if (tag === 'all') {
            item.style.display = 'block';
            foundItems = true;
            return;
        }
        
        const itemTags = item.dataset.tags ? item.dataset.tags.split(',') : [];
        
        if (itemTags.includes(tag)) {
            item.style.display = 'block';
            foundItems = true;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Update empty state visibility
    toggleEmptyState(!foundItems);
}
