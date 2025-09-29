// Clean, optimized Gallery functionality - loads images from gallery-images.json

document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
});

// Main gallery initialization function
async function initializeGallery() {
    const gallerySlider = document.getElementById('gallerySlider');
    
    if (!gallerySlider) {
        return; // Not on a page with a gallery
    }
    
    // Show loading state
    showLoadingState();
    
    try {
        // Load images with 10 second timeout
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Gallery loading timeout')), 10000);
        });
        
        await Promise.race([loadGalleryImages(), timeoutPromise]);
    } catch (error) {
        console.error('Gallery: Loading failed:', error);
        showErrorState();
    }
}

// Show loading skeleton
function showLoadingState() {
    const gallerySlider = document.getElementById('gallerySlider');
    
    // Add loading styles if not already added
    if (!document.getElementById('gallery-loading-styles')) {
        addLoadingStyles();
    }
    
    // Show navigation buttons
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    if (galleryPrev) galleryPrev.style.display = 'block';
    if (galleryNext) galleryNext.style.display = 'block';
    
    // Create 6 skeleton boxes
    gallerySlider.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'gallery-skeleton';
        skeleton.setAttribute('data-skeleton-index', i);
        gallerySlider.appendChild(skeleton);
    }
}

// Add loading animation styles
function addLoadingStyles() {
    const style = document.createElement('style');
    style.id = 'gallery-loading-styles';
    style.textContent = `
        .gallery-skeleton {
            flex: 0 0 300px;
            height: 200px;
            border-radius: 15px;
            background: linear-gradient(90deg, #e8ddd4 25%, #f0f0f0 50%, #e8ddd4 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        .gallery-skeleton::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 24px;
            height: 24px;
            border: 3px solid #8b4513;
            border-top: 3px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        .gallery-error {
            flex: 0 0 100%;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f5f0;
            border-radius: 15px;
            color: #8b4513;
            font-family: Georgia, serif;
            text-align: center;
            padding: 20px;
        }
        
        @media (max-width: 768px) {
            .gallery-skeleton {
                flex: 0 0 250px;
                height: 170px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Load images from the gallery list
async function loadGalleryImages() {
    try {
        // Fetch the gallery images list
        const response = await fetch('/gallery-images.json');
        if (!response.ok) {
            throw new Error('Could not load gallery-images.json');
        }
        
        const data = await response.json();
        const imageNames = data.images || [];
        
        if (imageNames.length === 0) {
            throw new Error('No images in gallery list');
        }
        
        // Load each image
        const basePath = '/images/gallery/';
        const loadedImages = [];
        
        for (const imageName of imageNames) {
            const imagePath = basePath + imageName;
            
            // Validate image exists and loads correctly
            if (await validateImage(imagePath, 2000)) {
                loadedImages.push({
                    src: imagePath,
                    name: imageName,
                    alt: `Galerij foto - ${imageName}`
                });
            }
        }
        
        if (loadedImages.length === 0) {
            throw new Error('No images could be loaded');
        }
        
        // Display the images
        await displayImages(loadedImages);
        
    } catch (error) {
        console.error('Error loading gallery:', error);
        throw error;
    }
}

// Validate that an image exists and can be loaded
function validateImage(src, timeout = 2000) {
    return new Promise((resolve) => {
        const img = new Image();
        let resolved = false;
        
        const timeoutId = setTimeout(() => {
            if (!resolved) {
                resolved = true;
                resolve(false);
            }
        }, timeout);
        
        img.onload = () => {
            if (!resolved) {
                resolved = true;
                clearTimeout(timeoutId);
                resolve(true);
            }
        };
        
        img.onerror = () => {
            if (!resolved) {
                resolved = true;
                clearTimeout(timeoutId);
                resolve(false);
            }
        };
        
        img.src = src;
    });
}

// Display images progressively
async function displayImages(imageList) {
    const gallerySlider = document.getElementById('gallerySlider');
    
    // Replace skeletons with actual images
    for (let i = 0; i < imageList.length; i++) {
        await replaceSkeletonWithImage(i, imageList[i]);
        
        // Small delay for smooth visual effect (only for first few)
        if (i < 5) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    // Remove any remaining skeletons
    const remainingSkeletons = gallerySlider.querySelectorAll('.gallery-skeleton');
    remainingSkeletons.forEach(skeleton => skeleton.remove());
    
    // Create infinite loop and initialize controls
    setTimeout(() => {
        createInfiniteLoopAndInitialize(imageList);
    }, 200);
}

// Replace skeleton with actual image
async function replaceSkeletonWithImage(index, imageData) {
    const gallerySlider = document.getElementById('gallerySlider');
    const skeleton = gallerySlider.querySelector(`[data-skeleton-index="${index}"]`);
    
    if (!skeleton) {
        // Add skeleton if it doesn't exist
        const newSkeleton = document.createElement('div');
        newSkeleton.className = 'gallery-skeleton';
        newSkeleton.setAttribute('data-skeleton-index', index);
        gallerySlider.appendChild(newSkeleton);
        return replaceSkeletonWithImage(index, imageData);
    }
    
    // Create gallery item
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    const img = document.createElement('img');
    img.src = imageData.src;
    img.alt = imageData.alt;
    img.className = 'gallery-image';
    img.loading = 'lazy';
    
    galleryItem.appendChild(img);
    
    // Smooth transition
    galleryItem.style.opacity = '0';
    galleryItem.style.transition = 'opacity 0.3s ease';
    
    // Replace skeleton
    skeleton.parentNode.replaceChild(galleryItem, skeleton);
    
    // Fade in
    setTimeout(() => {
        galleryItem.style.opacity = '1';
    }, 50);
}

// Show error state
function showErrorState() {
    const gallerySlider = document.getElementById('gallerySlider');
    
    gallerySlider.innerHTML = `
        <div class="gallery-error">
            <div>
                <p><strong>Gallery temporarily unavailable</strong></p>
                <p>Images will appear here when available.</p>
                <button onclick="initializeGallery()" style="
                    background: #8b4513;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 10px;
                ">Try Again</button>
            </div>
        </div>
    `;
    
    // Hide navigation
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    if (galleryPrev) galleryPrev.style.display = 'none';
    if (galleryNext) galleryNext.style.display = 'none';
}

// Create infinite loop and initialize gallery controls
function createInfiniteLoopAndInitialize(originalImages) {
    const gallerySlider = document.getElementById('gallerySlider');
    
    // Create infinite loop by repeating images
    const repetitions = 8;
    const allImages = [];
    
    for (let rep = 0; rep < repetitions; rep++) {
        originalImages.forEach((imageData, index) => {
            allImages.push({
                ...imageData,
                id: `rep-${rep}-${index}`,
                alt: `${imageData.alt} (${rep * originalImages.length + index + 1})`
            });
        });
    }
    
    // Rebuild gallery with all copies
    gallerySlider.innerHTML = '';
    
    allImages.forEach((imageData) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = imageData.src;
        img.alt = imageData.alt;
        img.className = 'gallery-image';
        img.loading = 'lazy';
        
        galleryItem.appendChild(img);
        gallerySlider.appendChild(galleryItem);
    });
    
    // Initialize gallery controls
    initializeGalleryControls(originalImages.length);
}

// Initialize gallery navigation and lightbox
function initializeGalleryControls(originalImageCount) {
    const gallerySlider = document.querySelector('.gallery-slider');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    if (galleryItems.length === 0) {
        showErrorState();
        return;
    }
    
    let currentIndex = 0;
    const itemWidth = 320; // 300px + 20px gap
    const isMobile = window.innerWidth <= 768;
    const visibleItems = Math.floor(window.innerWidth / itemWidth);
    const totalImages = galleryItems.length;
    
    // Start in the middle for smooth infinite scrolling
    currentIndex = Math.floor(originalImageCount * 4);
    
    function updateGallery(instant = false) {
        const translateX = -currentIndex * itemWidth;
        
        if (instant) {
            gallerySlider.style.transition = 'none';
            gallerySlider.style.transform = `translateX(${translateX}px)`;
            setTimeout(() => {
                gallerySlider.style.transition = `transform ${isMobile ? '0.8s' : '0.5s'} ease`;
            }, 10);
        } else {
            gallerySlider.style.transition = `transform ${isMobile ? '0.8s' : '0.5s'} ease`;
            gallerySlider.style.transform = `translateX(${translateX}px)`;
        }
    }
    
    // Navigation - Previous
    if (galleryPrev) {
        galleryPrev.addEventListener('click', function() {
            currentIndex--;
            
            if (currentIndex < originalImageCount) {
                currentIndex = totalImages - originalImageCount - visibleItems + currentIndex;
                updateGallery(true);
            } else {
                updateGallery();
            }
        });
    }
    
    // Navigation - Next
    if (galleryNext) {
        galleryNext.addEventListener('click', function() {
            currentIndex++;
            
            if (currentIndex > totalImages - originalImageCount - visibleItems) {
                currentIndex = originalImageCount + (currentIndex - (totalImages - originalImageCount - visibleItems));
                updateGallery(true);
            } else {
                updateGallery();
            }
        });
    }
    
    // Initialize lightbox
    initializeLightbox(galleryImages);
    
    // Set initial position
    updateGallery(true);
}

// Initialize lightbox functionality
function initializeLightbox(galleryImages) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentLightboxIndex = 0;
    
    function openLightbox(index) {
        currentLightboxIndex = index;
        lightboxImage.src = galleryImages[index].src;
        lightboxImage.alt = galleryImages[index].alt;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function showLightboxImage(index) {
        if (index >= 0 && index < galleryImages.length) {
            currentLightboxIndex = index;
            lightboxImage.src = galleryImages[index].src;
            lightboxImage.alt = galleryImages[index].alt;
        }
    }
    
    // Click on gallery images to open lightbox
    galleryImages.forEach((image, index) => {
        image.addEventListener('click', () => openLightbox(index));
    });
    
    // Close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Previous image in lightbox
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function() {
            const newIndex = currentLightboxIndex > 0 ? currentLightboxIndex - 1 : galleryImages.length - 1;
            showLightboxImage(newIndex);
        });
    }
    
    // Next image in lightbox
    if (lightboxNext) {
        lightboxNext.addEventListener('click', function() {
            const newIndex = currentLightboxIndex < galleryImages.length - 1 ? currentLightboxIndex + 1 : 0;
            showLightboxImage(newIndex);
        });
    }
    
    // Close lightbox when clicking outside image
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox && lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft' && lightboxPrev) {
                lightboxPrev.click();
            } else if (e.key === 'ArrowRight' && lightboxNext) {
                lightboxNext.click();
            }
        }
    });
}

// Make initializeGallery available globally for retry button
window.initializeGallery = initializeGallery;