document.addEventListener('DOMContentLoaded', function() {
    // Load texts first
    loadTexts();
    
    const expandButtons = document.querySelectorAll('.expand-btn');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            const isActive = targetElement.classList.contains('active');
            
            // Close all other expanded sections
            document.querySelectorAll('.service-details').forEach(detail => {
                detail.classList.remove('active');
            });
            
            document.querySelectorAll('.expand-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.textContent = texts.services.boarding.buttonText; // Use text from texts.js
            });
            
            // Toggle current section
            if (!isActive) {
                targetElement.classList.add('active');
                this.classList.add('active');
                this.textContent = texts.services.boarding.buttonTextLess; // Use text from texts.js
            } else {
                targetElement.classList.remove('active');
                this.classList.remove('active');
                this.textContent = texts.services.boarding.buttonText; // Use text from texts.js
            }
        });
    });
    
    // Load gallery images dynamically
    function loadGalleryImages() {
        const gallerySlider = document.getElementById('gallerySlider');
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const galleryPath = 'images/gallery/';
        
        let loadedImages = [];
        let loadPromises = [];
        
        // Try to load numbered images from 1 to 50
        for (let i = 1; i <= 50; i++) {
            imageExtensions.forEach(ext => {
                const imagePath = `${galleryPath}${i}.${ext}`;
                
                const promise = new Promise((resolve) => {
                    const img = new Image();
                    img.onload = function() {
                        loadedImages.push({
                            src: imagePath,
                            alt: `${texts.gallery.imageAlt} ${i}`, // Use text from texts.js
                            number: i
                        });
                        resolve();
                    };
                    img.onerror = function() {
                        resolve(); // Continue even if image doesn't exist
                    };
                    img.src = imagePath;
                });
                
                loadPromises.push(promise);
            });
        }
        
        // Wait for all image checks to complete
        Promise.all(loadPromises).then(() => {
            // Sort images by number
            loadedImages.sort((a, b) => a.number - b.number);
            
            if (loadedImages.length === 0) {
                document.querySelector('.gallery').style.display = 'none';
                return;
            }
            
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
            
            // Create gallery items
            loadedImages.forEach((imageData, index) => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                
                const img = document.createElement('img');
                img.src = imageData.src;
                img.alt = imageData.alt;
                img.className = 'gallery-image';
                
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
    
    // Load gallery images when page loads
    loadGalleryImages();
    
    // Add smooth scrolling for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Parallax effect for hero image
    const hero = document.querySelector('.hero');
    const isMobile = window.innerWidth <= 768;
    
    function updateParallax() {
        if (hero) {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            // Different speeds for mobile vs desktop
            const speed = isMobile ? 0.8 : 0.5; // Faster on mobile (0.8 vs 0.5)
            const yPos = scrolled * speed;
            
            // Apply transform to make image move faster than scroll
            // On mobile, image disappears faster due to higher speed
            hero.style.transform = `translateY(${yPos}px)`;
            
            // Optional: Add fade effect as user scrolls
            const opacity = Math.max(0, 1 - (scrolled / heroHeight) * 1.5);
            hero.style.opacity = opacity;
        }
    }
    
    // Throttled scroll event for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    function handleScroll() {
        ticking = false;
        requestTick();
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Update mobile detection on resize
    window.addEventListener('resize', function() {
        const wasMobile = isMobile;
        const nowMobile = window.innerWidth <= 768;
        if (wasMobile !== nowMobile) {
            location.reload(); // Simple way to handle resize
        }
    });
    
    // Add animation on scroll (optional enhancement)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Initially hide service cards for animation
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});