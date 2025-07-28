document.addEventListener('DOMContentLoaded', function() {
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
                btn.textContent = 'Lees meer';
            });
            
            // Toggle current section
            if (!isActive) {
                targetElement.classList.add('active');
                this.classList.add('active');
                this.textContent = 'Minder tonen';
            } else {
                targetElement.classList.remove('active');
                this.classList.remove('active');
                this.textContent = 'Lees meer';
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
                            alt: `Galerij foto ${i}`,
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
            
            // Create gallery items
            loadedImages.forEach(imageData => {
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
        const galleryItems = document.querySelectorAll('.gallery-item');
        const galleryPrev = document.getElementById('galleryPrev');
        const galleryNext = document.getElementById('galleryNext');
        const galleryImages = document.querySelectorAll('.gallery-image');
        
        if (galleryItems.length === 0) {
            // Hide gallery section if no images found
            document.querySelector('.gallery').style.display = 'none';
            return;
        }
        
        let currentIndex = 0;
        const itemWidth = 320; // 300px + 20px gap
        const visibleItems = Math.floor(window.innerWidth / itemWidth);
        const maxIndex = Math.max(0, galleryItems.length - visibleItems);
        
        function updateGallery() {
            const translateX = -currentIndex * itemWidth;
            gallerySlider.style.transform = `translateX(${translateX}px)`;
            
            // Update button states
            galleryPrev.style.opacity = currentIndex === 0 ? '0.5' : '1';
            galleryNext.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        }
        
        galleryPrev.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                updateGallery();
            }
        });
        
        galleryNext.addEventListener('click', function() {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateGallery();
            }
        });
        
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