document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery placeholder immediately
    initializeGalleryPlaceholder();
    
    // Load gallery images in the background after page load
    setTimeout(() => {
        loadGalleryImages();
    }, 500); // Small delay to ensure page is fully rendered
    
    // Initialize gallery placeholder to show loading state
    function initializeGalleryPlaceholder() {
        const gallerySlider = document.getElementById('gallerySlider');
        const galleryContainer = document.querySelector('.gallery-container');
        
        if (!gallerySlider) return;
        
        // Show loading placeholder
        gallerySlider.innerHTML = `
            <div class="gallery-loading">
                <div class="loading-spinner"></div>
                <p>Loading gallery images...</p>
            </div>
        `;
        
        // Add loading styles
        const loadingStyle = document.createElement('style');
        loadingStyle.textContent = `
            .gallery-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 200px;
                width: 100%;
                color: #8b4513;
                font-family: 'Georgia', serif;
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #e8ddd4;
                border-top: 4px solid #8b4513;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 15px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(loadingStyle);
        
        // Hide navigation buttons during loading
        const galleryPrev = document.getElementById('galleryPrev');
        const galleryNext = document.getElementById('galleryNext');
        if (galleryPrev) galleryPrev.style.display = 'none';
        if (galleryNext) galleryNext.style.display = 'none';
    }
    
    // Optimized image loading with progress tracking
    function createImagePromise(imagePath, imageNumber) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function() {
                resolve({
                    src: imagePath,
                    alt: `${texts.gallery.imageAlt} ${imageNumber}`,
                    number: imageNumber,
                    loaded: true
                });
            };
            img.onerror = function() {
                resolve({ loaded: false });
            };
            
            // Set loading attribute for better performance
            img.loading = 'lazy';
            img.src = imagePath;
        });
    }
    
    // Load gallery images dynamically
    function loadGalleryImages() {
        const gallerySlider = document.getElementById('gallerySlider');
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const galleryPath = 'images/gallery/';
        
        let loadedImages = [];
        
        // Try to load numbered images from 1 to 50 with optimized loading
        const imagePromises = [];
        
        for (let i = 1; i <= 50; i++) {
            imageExtensions.forEach(ext => {
                const imagePath = `${galleryPath}${i}.${ext}`;
                imagePromises.push(createImagePromise(imagePath, i));
            });
        }
        
        // Wait for all image checks to complete with progress updates
        Promise.all(imagePromises).then((results) => {
            // Filter successful loads and add to loadedImages
            results.forEach(result => {
                if (result.loaded) {
                    loadedImages.push(result);
                }
            });
            
            // Sort images by number
            loadedImages.sort((a, b) => a.number - b.number);
            
            console.log(`Gallery: Loaded ${loadedImages.length} images`);
            
            if (loadedImages.length === 0) {
                const gallerySlider = document.getElementById('gallerySlider');
                gallerySlider.innerHTML = `
                    <div class="gallery-loading">
                        <p>No gallery images found</p>
                    </div>
                `;
                return;
            }
            
            // Show navigation buttons
            const galleryPrev = document.getElementById('galleryPrev');
            const galleryNext = document.getElementById('galleryNext');
            if (galleryPrev) galleryPrev.style.display = 'block';
            if (galleryNext) galleryNext.style.display = 'block';
            
            // Create multiple copies of all images for infinite loop effect
            const originalImages = [...loadedImages];
            const repetitions = 10; // Create 10 copies of the sequence
            loadedImages = [];
            
            for (let rep = 0; rep < repetitions; rep++) {
                originalImages.forEach((imageData, index) => {
                    loadedImages.push({
                        ...imageData,
                        id: `rep-${rep}-${index}`,
                        alt: `${imageData.alt} (${rep * originalImages.length + index + 1})`
                    });
                });
            }
            
            // Clear loading placeholder
            gallerySlider.innerHTML = '';
            
            // Create gallery items with progressive loading
            loadedImages.forEach((imageData, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                const img = document.createElement('img');
                img.src = imageData.src;
                img.alt = imageData.alt;
                img.className = 'gallery-image';
                img.loading = 'lazy'; // Enable native lazy loading
                
                // Add fade-in effect when image loads
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                
                img.onload = function() {
                    this.style.opacity = '1';
                };
                
                galleryItem.appendChild(img);
                gallerySlider.appendChild(galleryItem);
            });
            
            // Initialize gallery functionality after images are loaded
            initializeGallery();
        });
    }
    
    // Gallery functionality
    function initializeGallery() {
        const gallerySlider = document.querySelector('.gallery-slider');
        const galleryPrev = document.getElementById('galleryPrev');
        const galleryNext = document.getElementById('galleryNext');
        
        // Query items and images after they've been added to the DOM
        const galleryItems = document.querySelectorAll('.gallery-item');
        const galleryImages = document.querySelectorAll('.gallery-image');
        
        if (galleryItems.length === 0) {
            // Hide gallery section if no images found
            document.querySelector('.gallery').style.display = 'none';
            return;
        }
        
        let currentIndex = 0;
        const itemWidth = 320; // 300px + 20px gap  
        const isMobile = window.innerWidth <= 768;
        const visibleItems = Math.floor(window.innerWidth / itemWidth);
        const totalImages = galleryItems.length;
        
        // Start in the middle of our repeated sequence to allow smooth infinite scrolling
        const originalImageCount = totalImages / 10; // We made 10 repetitions
        currentIndex = Math.floor(originalImageCount * 5); // Start at 5th repetition (middle)
        
        function updateGallery(instant = false) {
            const translateX = -currentIndex * itemWidth;
            
            if (instant) {
                // For seamless jumping, disable transition temporarily
                gallerySlider.style.transition = 'none';
                gallerySlider.style.transform = `translateX(${translateX}px)`;
                
                // Re-enable transition after a brief moment
                setTimeout(() => {
                    const transitionDuration = isMobile ? '0.8s' : '0.5s';
                    gallerySlider.style.transition = `transform ${transitionDuration} ease`;
                }, 10);
            } else {
                // Normal smooth transition - slower on mobile
                const transitionDuration = isMobile ? '0.8s' : '0.5s';
                gallerySlider.style.transition = `transform ${transitionDuration} ease`;
                gallerySlider.style.transform = `translateX(${translateX}px)`;
            }
            
            // Keep buttons always active
            if (galleryPrev) galleryPrev.style.opacity = '1';
            if (galleryNext) galleryNext.style.opacity = '1';
        }
        
        // Add click event listeners for infinite scrolling
        if (galleryPrev) {
            galleryPrev.addEventListener('click', function() {
                console.log('Previous clicked, currentIndex:', currentIndex); // Debug log
                currentIndex--;
                
                // If we're getting close to the beginning, jump to near the end
                if (currentIndex < originalImageCount) {
                    currentIndex = totalImages - originalImageCount - visibleItems + currentIndex;
                    updateGallery(true); // Instant jump for seamless loop
                } else {
                    updateGallery(); // Normal smooth transition
                }
            });
        }
        
        if (galleryNext) {
            galleryNext.addEventListener('click', function() {
                console.log('Next clicked, currentIndex:', currentIndex); // Debug log
                currentIndex++;
                
                // If we're getting close to the end, jump back to near the beginning
                if (currentIndex > totalImages - originalImageCount - visibleItems) {
                    currentIndex = originalImageCount + (currentIndex - (totalImages - originalImageCount - visibleItems));
                    updateGallery(true); // Instant jump for seamless loop
                } else {
                    updateGallery(); // Normal smooth transition
                }
            });
        }
        
        // Lightbox functionality
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.querySelector('.lightbox-image');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');
        
        let currentLightboxIndex = 0;
        
        function openLightbox(index) {
            currentLightboxIndex = index;
            const imageSrc = galleryImages[index].src;
            const imageAlt = galleryImages[index].alt;
            
            lightboxImage.src = imageSrc;
            lightboxImage.alt = imageAlt;
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
        
        // Event listeners for lightbox
        galleryImages.forEach((image, index) => {
            image.addEventListener('click', () => openLightbox(index));
        });
        
        lightboxClose.addEventListener('click', closeLightbox);
        
        lightboxPrev.addEventListener('click', function() {
            const newIndex = currentLightboxIndex > 0 ? currentLightboxIndex - 1 : galleryImages.length - 1;
            showLightboxImage(newIndex);
        });
        
        lightboxNext.addEventListener('click', function() {
            const newIndex = currentLightboxIndex < galleryImages.length - 1 ? currentLightboxIndex + 1 : 0;
            showLightboxImage(newIndex);
        });
        
        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Keyboard navigation for lightbox
        document.addEventListener('keydown', function(e) {
            if (lightbox.style.display === 'block') {
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    lightboxPrev.click();
                } else if (e.key === 'ArrowRight') {
                    lightboxNext.click();
                }
            }
        });
        
        // Initialize gallery
        updateGallery();
    }
});