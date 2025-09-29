// Robust image loading helper
// Ensures all images load properly with retries

document.addEventListener('DOMContentLoaded', function() {
    initializeImageLoading();
});

function initializeImageLoading() {
    const images = document.querySelectorAll('img.service-image, img.gallery-image');
    
    images.forEach(img => {
        setupImageWithRetry(img);
    });
}

function setupImageWithRetry(img, retryCount = 0) {
    const maxRetries = 3;
    const originalSrc = img.getAttribute('src') || img.dataset.src;
    
    if (!originalSrc) return;
    
    // Add loading background
    img.style.background = 'linear-gradient(90deg, #e8ddd4 25%, #f0f0f0 50%, #e8ddd4 75%)';
    img.style.backgroundSize = '200% 100%';
    
    // Handle successful load
    img.addEventListener('load', function onLoad() {
        img.style.background = 'none';
        img.removeEventListener('load', onLoad);
    }, { once: true });
    
    // Handle error with retry
    img.addEventListener('error', function onError() {
        img.removeEventListener('error', onError);
        
        if (retryCount < maxRetries) {
            console.log(`Retrying image load (${retryCount + 1}/${maxRetries}): ${originalSrc}`);
            
            // Wait before retrying with exponential backoff
            setTimeout(() => {
                // Force reload by adding cache-busting parameter
                const separator = originalSrc.includes('?') ? '&' : '?';
                img.src = originalSrc + separator + 't=' + Date.now();
                setupImageWithRetry(img, retryCount + 1);
            }, 500 * (retryCount + 1));
        } else {
            console.error(`Failed to load image after ${maxRetries} retries: ${originalSrc}`);
            // Show a subtle error state
            img.style.background = 'linear-gradient(135deg, #f5f2ed 0%, #e8ddd4 100%)';
            img.style.opacity = '0.5';
        }
    }, { once: true });
    
    // If image is already complete but hasn't loaded properly
    if (img.complete && img.naturalHeight === 0) {
        // Image failed to load, trigger retry
        const errorEvent = new Event('error');
        img.dispatchEvent(errorEvent);
    } else if (img.complete && img.naturalHeight > 0) {
        // Image already loaded successfully
        img.style.background = 'none';
    }
}

// Also handle dynamically added images
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            if (node.nodeName === 'IMG' && 
                (node.classList.contains('service-image') || node.classList.contains('gallery-image'))) {
                setupImageWithRetry(node);
            }
            // Check child images
            if (node.querySelectorAll) {
                const images = node.querySelectorAll('img.service-image, img.gallery-image');
                images.forEach(img => setupImageWithRetry(img));
            }
        });
    });
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Export for manual use if needed
window.setupImageWithRetry = setupImageWithRetry;