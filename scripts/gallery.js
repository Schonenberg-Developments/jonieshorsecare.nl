document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery with skeleton boxes immediately
    initializeGallerySkeleton();
    
    // Start loading images progressively after a short delay
    setTimeout(() => {
        loadGalleryImagesProgressively();
    }, 100);
    
    // Initialize gallery with skeleton loading boxes
    function initializeGallerySkeleton() {
        const gallerySlider = document.getElementById('gallerySlider');
        
        if (!gallerySlider) return;
        
        // Add skeleton loading styles
        const skeletonStyle = document.createElement('style');
        skeletonStyle.textContent = `
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
            
            @media (max-width: 768px) {
                .gallery-skeleton {
                    flex: 0 0 250px;
                    height: 170px;
                }
            }
        `;
        document.head.appendChild(skeletonStyle);
        
        // Show navigation buttons
        const galleryPrev = document.getElementById('galleryPrev');
        const galleryNext = document.getElementById('galleryNext');
        if (galleryPrev) galleryPrev.style.display = 'block';
        if (galleryNext) galleryNext.style.display = 'block';
        
        // Create initial skeleton boxes (we'll determine actual count later)
        createSkeletonBoxes(8); // Start with 8 skeleton boxes
    }
    
    // Create skeleton loading boxes
    function createSkeletonBoxes(count) {
        const gallerySlider = document.getElementById('gallerySlider');
        gallerySlider.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const skeletonBox = document.createElement('div');
            skeletonBox.className = 'gallery-skeleton';
            skeletonBox.setAttribute('data-skeleton-index', i);
            gallerySlider.appendChild(skeletonBox);
        }
    }
    
    // Find actual number of images and load them progressively
    async function loadGalleryImagesProgressively() {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const galleryPath = 'images/gallery/';
        const maxImages = 50; // Maximum to check
        
        console.log('Gallery: Starting image detection...');
        
        // First, detect how many images actually exist
        const availableImages = await detectAvailableImages(galleryPath, imageExtensions, maxImages);
        
        if (availableImages.length === 0) {
            showNoImagesMessage();
            return;
        }
        
        console.log(`Gallery: Found ${availableImages.length} images, loading progressively...`);
        
        // Update skeleton boxes to match actual image count
        updateSkeletonCount(availableImages.length);
        
        // Load images one by one with a small delay between each
        loadImagesWithDelay(availableImages);
    }
    
    // Detect which images actually exist
    async function detectAvailableImages(galleryPath, extensions, maxCount) {
        const availableImages = [];
        const checkPromises = [];
        
        // Check images efficiently by trying common extensions first
        for (let i = 1; i <= maxCount; i++) {
            for (const ext of extensions) {
                const imagePath = `${galleryPath}${i}.${ext}`;
                checkPromises.push(checkImageExists(imagePath, i));
            }
        }
        
        const results = await Promise.all(checkPromises);
        
        // Filter successful results and remove duplicates
        const imageMap = new Map();
        results.forEach(result => {
            if (result.exists && !imageMap.has(result.number)) {
                imageMap.set(result.number, result);
            }
        });
        
        // Convert to array and sort
        return Array.from(imageMap.values()).sort((a, b) => a.number - b.number);
    }
    
    // Check if a single image exists
    function checkImageExists(imagePath, imageNumber) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ 
                exists: true, 
                src: imagePath, 
                number: imageNumber,
                alt: `${texts.gallery.imageAlt} ${imageNumber}`
            });
            img.onerror = () => resolve({ exists: false });
            img.src = imagePath;
        });
    }
    
    // Update skeleton boxes to match actual image count
    function updateSkeletonCount(actualCount) {
        const gallerySlider = document.getElementById('gallerySlider');
        const currentSkeletons = gallerySlider.querySelectorAll('.gallery-skeleton').length;
        
        if (actualCount > currentSkeletons) {
            // Add more skeleton boxes
            for (let i = currentSkeletons; i < actualCount; i++) {
                const skeletonBox = document.createElement('div');
                skeletonBox.className = 'gallery-skeleton';
                skeletonBox.setAttribute('data-skeleton-index', i);
                gallerySlider.appendChild(skeletonBox);
            }
        } else if (actualCount < currentSkeletons) {
            // Remove excess skeleton boxes
            const skeletons = gallerySlider.querySelectorAll('.gallery-skeleton');
            for (let i = actualCount; i < currentSkeletons; i++) {
                if (skeletons[i]) {
                    skeletons[i].remove();
                }
            }
        }
    }
    
    // Load images with progressive delay
    async function loadImagesWithDelay(availableImages) {
        const gallerySlider = document.getElementById('gallerySlider');
        const loadedImages = [];
        
        // Load each image with a 200ms delay
        for (let i = 0; i < availableImages.length; i++) {
            const imageData = availableImages[i];
            
            // Create the actual image element
            const img = await createGalleryImage(imageData);
            
            // Replace the skeleton with the actual image
            const skeleton = gallerySlider.querySelector(`[data-skeleton-index="${i}"]`);
            if (skeleton && img) {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.appendChild(img);
                
                // Smooth transition
                galleryItem.style.opacity = '0';
                skeleton.parentNode.replaceChild(galleryItem, skeleton);
                
                // Fade in the image
                setTimeout(() => {
                    galleryItem.style.opacity = '1';
                    galleryItem.style.transition = 'opacity 0.3s ease';
                }, 50);
                
                loadedImages.push(imageData);
                console.log(`Gallery: Loaded image ${i + 1}/${availableImages.length}`);
            }
            
            // Small delay between images to create progressive loading effect
            if (i < availableImages.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
        
        // Once all images are loaded, create infinite loop copies and initialize gallery
        setTimeout(() => {
            createInfiniteLoopAndInitialize(loadedImages);
        }, 500);
    }
    
    // Create a gallery image element
    function createGalleryImage(imageData) {
        return new Promise((resolve) => {
            const img = document.createElement('img');
            img.src = imageData.src;
            img.alt = imageData.alt;
            img.className = 'gallery-image';
            img.loading = 'lazy';
            
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
        });
    }
    
    // Create infinite loop copies and initialize gallery functionality
    function createInfiniteLoopAndInitialize(originalImages) {
        const gallerySlider = document.getElementById('gallerySlider');
        
        // Create infinite loop copies
        const repetitions = 10;
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
        
        console.log(`Gallery: Created infinite loop with ${allImages.length} total images`);
        
        // Initialize gallery controls
        initializeGallery();
    }
    
    // Show message when no images are found
    function showNoImagesMessage() {
        const gallerySlider = document.getElementById('gallerySlider');
        gallerySlider.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 200px; color: #8b4513; font-family: Georgia, serif;">
                <p>No gallery images found</p>
            </div>
        `;
        
        // Hide navigation
        const galleryPrev = document.getElementById('galleryPrev');
        const galleryNext = document.getElementById('galleryNext');
        if (galleryPrev) galleryPrev.style.display = 'none';
        if (galleryNext) galleryNext.style.display = 'none';
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
            showNoImagesMessage();
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
        }
        
        // Add click event listeners for infinite scrolling
        if (galleryPrev) {
            galleryPrev.addEventListener('click', function() {
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
        
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', function() {
                const newIndex = currentLightboxIndex > 0 ? currentLightboxIndex - 1 : galleryImages.length - 1;
                showLightboxImage(newIndex);
            });
        }
        
        if (lightboxNext) {
            lightboxNext.addEventListener('click', function() {
                const newIndex = currentLightboxIndex < galleryImages.length - 1 ? currentLightboxIndex + 1 : 0;
                showLightboxImage(newIndex);
            });
        }
        
        // Close lightbox when clicking outside the image
        if (lightbox) {
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }
        
        // Keyboard navigation for lightbox
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
        
        // Initialize gallery
        updateGallery();
        
        console.log('Gallery: Fully initialized and ready');
    }
});