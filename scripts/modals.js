// Modal functionality for service details
document.addEventListener('DOMContentLoaded', function() {
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
});

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
    // Wait for texts to be loaded
    setTimeout(() => {
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
    }, 100);
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

// Lazy load modal images
function lazyLoadModalImages() {
    const modalImages = document.querySelectorAll('.modal-image');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    modalImages.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadModalImages);