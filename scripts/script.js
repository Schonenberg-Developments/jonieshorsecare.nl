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