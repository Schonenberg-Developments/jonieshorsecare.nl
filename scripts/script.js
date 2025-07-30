import { texts, loadTexts } from './texts.js';

document.addEventListener('DOMContentLoaded', function() {
    // Load texts first
    loadTexts();
    
    // Initialize modals after texts are loaded
    setTimeout(initializeModals, 100);
    
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

// Modal functionality
function initializeModals() {
    // Initialize MicroModal
    if (typeof MicroModal !== 'undefined') {
        MicroModal.init({
            onShow: modal => {
                // Add body class to prevent scrolling
                document.body.classList.add('modal-open');
                
                // Focus management
                const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            },
            onClose: modal => {
                // Remove body class to restore scrolling
                document.body.classList.remove('modal-open');
            },
            awaitCloseAnimation: true,
            debugMode: false
        });
    } else {
        // Fallback modal functionality if MicroModal isn't loaded
        initFallbackModals();
    }
    
    // Update "Learn More" buttons to open modals
    updateLearnMoreButtons();
}

// Fallback modal system
function initFallbackModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('[data-micromodal-close]');
    
    // Close modal function
    function closeModal(modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }
    
    // Open modal function
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
            
            // Focus the close button
            const closeBtn = modal.querySelector('.modal__close');
            if (closeBtn) closeBtn.focus();
        }
    }
    
    // Add click handlers for close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = button.closest('.modal');
            if (modal) closeModal(modal);
        });
    });
    
    // Close on overlay click
    modals.forEach(modal => {
        const overlay = modal.querySelector('.modal__overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeModal(modal);
                }
            });
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[aria-hidden="false"]');
            if (openModal) closeModal(openModal);
        }
    });
    
    // Expose openModal globally for fallback
    window.openModal = openModal;
}

// Update learn more buttons to open modals instead of navigate
function updateLearnMoreButtons() {
    const learnMoreButtons = document.querySelectorAll('.learn-more-btn');
    
    learnMoreButtons.forEach(button => {
        const href = button.getAttribute('href');
        let modalId = '';
        
        // Map service links to modal IDs
        if (href && href.includes('pensionstal')) {
            modalId = 'modal-pensionstal';
        } else if (href && href.includes('rijlessen')) {
            modalId = 'modal-rijlessen';
        } else if (href && href.includes('trauma-recovery')) {
            modalId = 'modal-trauma-recovery';
        }
        
        if (modalId) {
            button.removeAttribute('href');
            button.setAttribute('data-micromodal-trigger', modalId);
            button.style.cursor = 'pointer';
            
            // Add click handler for fallback
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (typeof MicroModal !== 'undefined') {
                    MicroModal.show(modalId);
                } else if (window.openModal) {
                    window.openModal(modalId);
                }
            });
        }
    });
}

// Smooth scroll for CTA buttons in modals
document.addEventListener('click', function(e) {
    if (e.target.matches('.cta-button[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Close any open modal first
            const openModal = document.querySelector('.modal[aria-hidden="false"]');
            if (openModal) {
                if (typeof MicroModal !== 'undefined') {
                    MicroModal.close();
                } else {
                    openModal.style.display = 'none';
                    openModal.setAttribute('aria-hidden', 'true');
                    document.body.classList.remove('modal-open');
                }
            }
            
            // Smooth scroll to target
            setTimeout(() => {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
    }
});

// Handle modal images (simple lightbox effect)
document.addEventListener('click', function(e) {
    if (e.target.matches('.modal-image')) {
        e.target.classList.toggle('modal-image-expanded');
    }
});