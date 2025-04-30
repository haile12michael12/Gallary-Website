/**
 * Upload Functionality
 * Manages drag-and-drop and file selection for image uploads
 */

/**
 * Initialize upload handlers for drag-and-drop and file input
 */
function initUploadHandlers() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const tagInput = document.getElementById('tag-input');
    
    // Add drag and drop event listeners
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleFileDrop);
    
    // Add click event to open file browser
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Listen for file selection through input
    fileInput.addEventListener('change', handleFileSelect);
    
    // Handle the upload button click
    uploadBtn.addEventListener('click', () => {
        const files = fileInput.files;
        if (files.length > 0) {
            const tags = processTagInput(tagInput.value);
            processFiles(files, tags);
            
            // Reset the input
            fileInput.value = '';
            tagInput.value = '';
        } else {
            showNotification('Please select at least one image to upload.', 'error');
        }
    });
}

/**
 * Handle dragover event
 * @param {Event} e - Drag event
 */
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.add('active');
}

/**
 * Handle dragleave event
 * @param {Event} e - Drag event
 */
function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('active');
}

/**
 * Handle file drop event
 * @param {Event} e - Drop event
 */
function handleFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('active');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const fileInput = document.getElementById('file-input');
        fileInput.files = files;
        
        // Show preview or notification
        showNotification(`${files.length} files selected for upload.`, 'success');
    }
}

/**
 * Handle file selection through input
 * @param {Event} e - Change event
 */
function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        // Show preview or notification
        showNotification(`${files.length} files selected for upload.`, 'success');
    }
}

/**
 * Process and display a notification
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // For simplicity, we'll use an alert, but in a real app
    // you would want to create a styled notification element
    alert(message);
}

/**
 * Process tags from the input field
 * @param {string} tagInput - Comma-separated tag string
 * @returns {string[]} Array of processed tags
 */
function processTagInput(tagInput) {
    if (!tagInput || tagInput.trim() === '') {
        return ['custom']; // Default tag
    }
    
    // Split by comma, trim whitespace, and filter out empty tags
    return tagInput.split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag !== '');
}

/**
 * Process files for upload to the gallery
 * @param {FileList} files - Files to process
 * @param {string[]} tags - Tags to apply to the files
 */
function processFiles(files, tags) {
    if (files.length === 0) return;
    
    Array.from(files).forEach(file => {
        // Check if file is an image
        if (!file.type.match('image.*')) {
            showNotification(`${file.name} is not an image file.`, 'error');
            return;
        }
        
        // Read the file as data URL
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imgSrc = e.target.result;
            // Add the image to the gallery
            addGalleryItem(imgSrc, tags);
        };
        
        reader.onerror = function() {
            showNotification(`Error reading file ${file.name}`, 'error');
        };
        
        reader.readAsDataURL(file);
    });
}
