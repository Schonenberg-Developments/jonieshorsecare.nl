document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery with skeleton boxes immediately
    initializeGallerySkeleton();
    
    // Start loading images progressively after a short delay
    setTimeout(() => {
        loadAllGalleryImages();
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
        
        // Create initial skeleton boxes (we'll adjust count as needed)
        createSkeletonBoxes(6); // Start with 6 skeleton boxes
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
    
    // Load all images from gallery folder using images.json
    async function loadAllGalleryImages() {
        const galleryPath = 'images/gallery/';
        
        console.log('Gallery: Loading image list...');
        
        try {
            // Try to load the images.json file first
            const imageList = await loadImageList(galleryPath + 'images.json');
            if (imageList && imageList.length > 0) {
                await loadImagesFromList(imageList, galleryPath);
                return;
            }
        } catch (error) {
            console.log('Gallery: No images.json found, falling back to pattern matching...');
        }
        
        // Fallback to pattern matching if no images.json
        await loadImagesUsingPatterns();
    }
    
    // Load the images.json file
    async function loadImageList(jsonPath) {
        return fetch(jsonPath)
            .then(response => {
                if (!response.ok) throw new Error('No images.json');
                return response.json();
            })
            .catch(() => null);
    }
    
    // Load images from the JSON list
    async function loadImagesFromList(imageList, galleryPath) {
        console.log(`Gallery: Loading ${imageList.length} images from list...`);
        
        const loadedImages = [];
        let currentSkeletonIndex = 0;
        
        for (let i = 0; i < imageList.length; i++) {
            const imageName = imageList[i];
            const imagePath = galleryPath + imageName;
            
            console.log(`Gallery: Checking image ${i + 1}/${imageList.length}: ${imageName}`);
            
            const imageData = await checkAndLoadImage(imagePath, imageName);
            
            if (imageData) {
                console.log(`Gallery: Successfully loaded ${imageName}`);
                
                // Add more skeleton boxes if needed
                if (currentSkeletonIndex >= document.querySelectorAll('.gallery-skeleton').length) {
                    addSkeletonBox(currentSkeletonIndex);
                }
                
                // Replace skeleton immediately
                console.log(`Gallery: Replacing skeleton ${currentSkeletonIndex} with ${imageName}`);
                await replaceSkeletonWithImage(currentSkeletonIndex, imageData);
                loadedImages.push(imageData);
                currentSkeletonIndex++;
                
                // Small delay for visual effect
                await new Promise(resolve => setTimeout(resolve, 100));
            } else {
                console.log(`Gallery: Failed to load ${imageName}`);
            }
        }
        
        console.log(`Gallery: Finished loading, found ${loadedImages.length} valid images`);
        
        if (loadedImages.length === 0) {
            showNoImagesMessage();
            return;
        }
        
        // Remove any unused skeleton boxes
        removeExtraSkeletons(loadedImages.length);
        
        console.log(`Gallery: Loaded ${loadedImages.length} images total, initializing infinite loop...`);
        
        // Create infinite loop and initialize after a brief delay
        setTimeout(() => {
            createInfiniteLoopAndInitialize(loadedImages);
        }, 300);
    }
    
    // Fallback: Load images using pattern matching (original method)
    async function loadImagesUsingPatterns() {
        const galleryPath = 'images/gallery/';
        const commonImageNames = [
            // Try common numbered patterns first (faster)
            '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg',
            '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg',
            // Try other extensions for first few numbers
            '1.jpeg', '1.png', '1.gif', '1.webp',
            '2.jpeg', '2.png', '2.gif', '2.webp',
            '3.jpeg', '3.png', '3.gif', '3.webp',
            '4.jpeg', '4.png', '4.gif', '4.webp',
            '5.jpeg', '5.png', '5.gif', '5.webp',
            // Try some common naming patterns
            'horse1.jpg', 'horse2.jpg', 'horse3.jpg', 'horse4.jpg', 'horse5.jpg',
            'stable1.jpg', 'stable2.jpg', 'stable3.jpg', 'stable4.jpg', 'stable5.jpg',
            'gallery1.jpg', 'gallery2.jpg', 'gallery3.jpg', 'gallery4.jpg', 'gallery5.jpg',
            'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg',
            'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg'
        ];
        
        console.log('Gallery: Scanning for images...');
        
        const loadedImages = [];
        let currentSkeletonIndex = 0;
        
        // Try to load each possible image
        for (const imageName of commonImageNames) {
            const imagePath = galleryPath + imageName;
            const imageData = await checkAndLoadImage(imagePath, imageName);
            
            if (imageData) {
                console.log(`Gallery: Found ${imageName}`);
                
                // Add more skeleton boxes if needed
                if (currentSkeletonIndex >= document.querySelectorAll('.gallery-skeleton').length) {
                    addSkeletonBox(currentSkeletonIndex);
                }
                
                // Replace skeleton immediately
                await replaceSkeletonWithImage(currentSkeletonIndex, imageData);
                loadedImages.push(imageData);
                currentSkeletonIndex++;
                
                // Small delay for visual effect
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        if (loadedImages.length === 0) {
            showNoImagesMessage();
            return;
        }
        
        // Remove any unused skeleton boxes
        removeExtraSkeletons(loadedImages.length);
        
        console.log(`Gallery: Loaded ${loadedImages.length} images total`);
        
        // Create infinite loop and initialize after a brief delay
        setTimeout(() => {
            createInfiniteLoopAndInitialize(loadedImages);
        }, 300);
    }
    
    // Check if image exists and return data if found
    async function checkAndLoadImage(imagePath, imageName) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ 
                src: imagePath, 
                name: imageName,
                alt: `${texts.gallery.imageAlt} - ${imageName}`
            });
            img.onerror = () => resolve(null);
            img.src = imagePath;
        });
    }
    
    // Add a single skeleton box
    function addSkeletonBox(index) {
        const gallerySlider = document.getElementById('gallerySlider');
        const skeletonBox = document.createElement('div');
        skeletonBox.className = 'gallery-skeleton';
        skeletonBox.setAttribute('data-skeleton-index', index);
        gallerySlider.appendChild(skeletonBox);
    }
    
    // Replace a skeleton box with actual image immediately
    async function replaceSkeletonWithImage(skeletonIndex, imageData) {
        const gallerySlider = document.getElementById('gallerySlider');
        const skeleton = gallerySlider.querySelector(`[data-skeleton-index="${skeletonIndex}"]`);
        
        if (!skeleton) return false;
        
        // Create the actual image element
        const img = await createGalleryImage(imageData);
        if (!img) return false;
        
        // Create gallery item
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.appendChild(img);
        
        // Smooth transition
        galleryItem.style.opacity = '0';
        galleryItem.style.transition = 'opacity 0.3s ease';
        
        // Replace skeleton with image
        skeleton.parentNode.replaceChild(galleryItem, skeleton);
        
        // Fade in the image
        setTimeout(() => {
            galleryItem.style.opacity = '1';
        }, 50);
        
        return true;
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
    
    // Remove extra skeleton boxes that weren't used
    function removeExtraSkeletons(usedCount) {
        const gallerySlider = document.getElementById('gallerySlider');
        const allSkeletons = gallerySlider.querySelectorAll('.gallery-skeleton');
        
        // Remove skeletons beyond the used count
        for (let i = usedCount; i < allSkeletons.length; i++) {
            if (allSkeletons[i]) {
                allSkeletons[i].remove();
            }
        }
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