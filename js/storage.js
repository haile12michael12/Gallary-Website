/**
 * Local Storage Functionality
 * Handles saving and loading gallery items to browser's localStorage
 */

// Storage constants
const STORAGE_KEY = 'futuristic_gallery_items';

/**
 * Initialize local storage for the gallery
 */
function initLocalStorage() {
    // Check if localStorage is supported
    if (!isLocalStorageSupported()) {
        console.error('Local storage is not supported by your browser. Images will not be saved between sessions.');
        return;
    }
    
    // Initialize empty gallery array if not exists
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
}

/**
 * Check if localStorage is supported by the browser
 * @returns {boolean} Whether localStorage is supported
 */
function isLocalStorageSupported() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Save a gallery item to localStorage
 * @param {Object} item - Gallery item to save
 * @param {string} item.id - Unique ID for the item
 * @param {string} item.imgSrc - Base64 image data or URL
 * @param {string[]} item.tags - Array of tags for the image
 */
function saveGalleryItem(item) {
    if (!isLocalStorageSupported()) return;
    
    // Get existing items
    const items = getGalleryItems();
    
    // Add new item
    items.push(item);
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/**
 * Get all gallery items from localStorage
 * @returns {Array} Array of gallery items
 */
function getGalleryItems() {
    if (!isLocalStorageSupported()) return [];
    
    try {
        // Get and parse items
        const items = localStorage.getItem(STORAGE_KEY);
        return items ? JSON.parse(items) : [];
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return [];
    }
}

/**
 * Remove a gallery item from localStorage
 * @param {string} id - ID of the item to remove
 */
function removeGalleryItem(id) {
    if (!isLocalStorageSupported()) return;
    
    // Get existing items
    const items = getGalleryItems();
    
    // Filter out the item to remove
    const updatedItems = items.filter(item => item.id !== id);
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
}

/**
 * Clear all gallery items from localStorage
 */
function clearGalleryStorage() {
    if (!isLocalStorageSupported()) return;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}

/**
 * Check if gallery storage is empty
 * @returns {boolean} Whether the gallery storage is empty
 */
function isGalleryStorageEmpty() {
    const items = getGalleryItems();
    return !items || items.length === 0;
}

/**
 * Estimate the current storage usage
 * @returns {Object} Object containing usage and limit in MB
 */
function getStorageUsage() {
    if (!isLocalStorageSupported()) {
        return { usage: 0, limit: 0 };
    }
    
    try {
        // Get all keys in localStorage
        const allKeys = Object.keys(localStorage);
        let totalSize = 0;
        
        // Calculate total size
        for (let i = 0; i < allKeys.length; i++) {
            const key = allKeys[i];
            const value = localStorage.getItem(key);
            totalSize += (key.length + value.length) * 2; // Unicode characters = 2 bytes
        }
        
        // Convert to MB
        const usageMB = totalSize / (1024 * 1024);
        
        // Most browsers have a limit of 5-10MB
        const estimatedLimit = 5;
        
        return {
            usage: usageMB.toFixed(2),
            limit: estimatedLimit
        };
    } catch (e) {
        console.error('Error calculating storage usage:', e);
        return { usage: 0, limit: 0 };
    }
}
