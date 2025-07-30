import { texts } from './texts.js';

document.addEventListener('DOMContentLoaded', function() {
    // Load texts first
    loadTexts();
    
    // Mobile navigation toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hero image loading
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transition = 'opacity 0.5s ease';
        
        heroImage.onload = function() {
            this.style.opacity = '1';
        };
        
        // If already loaded
        if (heroImage.complete) {
            heroImage.style.opacity = '1';
        }
    }

    // Add scroll effect to navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add shadow when scrolled
            if (scrollTop > 0) {
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
            } else {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    // Service card hover effects
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Legacy expand button functionality (if needed)
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
                btn.textContent = texts.services.boarding.buttonText;
            });
            
            // Toggle current section
            if (!isActive) {
                targetElement.classList.add('active');
                this.classList.add('active');
                this.textContent = texts.services.boarding.buttonTextLess;
            } else {
                targetElement.classList.remove('active');
                this.classList.remove('active');
                this.textContent = texts.services.boarding.buttonText;
            }
        });
    });

    // Initialize animations on scroll
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

    // Parallax effect for hero image
    const hero = document.querySelector('.hero');
    const isMobile = window.innerWidth <= 768;
    
    function updateParallax() {
        if (hero) {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            // Different speeds for mobile vs desktop
            const speed = isMobile ? 0.8 : 0.5;
            const yPos = scrolled * speed;
            
            // Apply transform to make image move faster than scroll
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
            location.reload();
        }
    });
});

// Function to load texts into the page
function loadTexts() {
    // Update page title
    if (texts.meta && texts.meta.title) {
        document.title = texts.meta.title;
    }
    
    // Update hero section
    const heroTitle = document.querySelector('.hero-text h1');
    const heroSubtitle = document.querySelector('.hero-text p');
    const heroLogo = document.querySelector('.hero-logo');
    const heroSiteTitle = document.querySelector('.hero-subtitle span');
    
    if (heroTitle && texts.hero.title) heroTitle.textContent = texts.hero.title;
    if (heroSubtitle && texts.hero.subtitle) heroSubtitle.textContent = texts.hero.subtitle;
    if (heroLogo && texts.hero.logoAlt) heroLogo.alt = texts.hero.logoAlt;
    if (heroSiteTitle && texts.hero.siteTitle) heroSiteTitle.textContent = texts.hero.siteTitle;
    
    // Update services section
    const servicesTitle = document.querySelector('.services h2');
    if (servicesTitle && texts.services.title) servicesTitle.textContent = texts.services.title;
    
    // Update individual service cards
    updateServiceCard('boarding', texts.services.boarding);
    updateServiceCard('riding', texts.services.riding);
    updateServiceCard('trauma', texts.services.trauma);
    updateServiceCard('pivo', texts.services.pivo);
    updateServiceCard('breeding', texts.services.breeding);
    
    // Update gallery section
    const galleryTitle = document.querySelector('.gallery h2');
    if (galleryTitle && texts.gallery.title) galleryTitle.textContent = texts.gallery.title;
    
    // Update contact section
    const contactTitle = document.querySelector('.contact h2');
    const contactDescription = document.querySelector('.contact p');
    
    if (contactTitle && texts.contact.title) contactTitle.textContent = texts.contact.title;
    if (contactDescription && texts.contact.description) contactDescription.textContent = texts.contact.description;
    
    // Update contact info
    const contactItems = document.querySelectorAll('.contact-item');
    const contactData = [texts.contact.phone, texts.contact.email, texts.contact.address];
    
    contactItems.forEach((item, index) => {
        if (contactData[index]) {
            item.innerHTML = `<strong>${contactData[index].label}</strong> ${contactData[index].value}`;
        }
    });
    
    // Update footer
    const footerText = document.querySelector('footer p');
    if (footerText && texts.footer.copyright) footerText.textContent = texts.footer.copyright;
}

// Helper function to update service cards
function updateServiceCard(serviceKey, serviceData) {
    if (!serviceData) return;
    
    const cards = document.querySelectorAll('.service-card');
    const serviceIcons = {
        boarding: 'fa-home',
        riding: 'fa-horse',
        trauma: 'fa-heart',
        pivo: 'fa-video',
        breeding: 'fa-heart-pulse'
    };
    
    cards.forEach(card => {
        const icon = card.querySelector('.service-icon i');
        const title = card.querySelector('h3');
        const description = card.querySelector('p');
        const button = card.querySelector('.service-btn, .expand-btn');
        const detailsContent = card.querySelector('.details-content');
        
        // Check if this is the right service card by matching the icon class
        if (icon && icon.classList.contains(serviceIcons[serviceKey])) {
            if (title && serviceData.title) title.textContent = serviceData.title;
            if (description && serviceData.description) description.textContent = serviceData.description;
            
            // Update button text
            if (button) {
                if (button.classList.contains('service-btn')) {
                    button.textContent = serviceData.buttonText || 'Meer informatie';
                } else if (button.classList.contains('expand-btn')) {
                    button.textContent = serviceData.buttonText || 'Lees meer';
                }
            }
            
            // Update details content with legacy structure (if present)
            if (detailsContent && serviceData.details) {
                detailsContent.innerHTML = '';
                
                // Add summary paragraph
                if (serviceData.details.summary) {
                    const summaryParagraph = document.createElement('p');
                    summaryParagraph.textContent = serviceData.details.summary;
                    summaryParagraph.className = 'service-summary';
                    detailsContent.appendChild(summaryParagraph);
                }
                
                // Add highlights list
                if (serviceData.details.highlights && serviceData.details.highlights.length > 0) {
                    const highlightsList = document.createElement('ul');
                    highlightsList.className = 'service-highlights';
                    
                    serviceData.details.highlights.forEach(highlight => {
                        const li = document.createElement('li');
                        li.textContent = highlight;
                        highlightsList.appendChild(li);
                    });
                    
                    detailsContent.appendChild(highlightsList);
                }
                
                // Add "Learn More" button
                if (serviceData.details.learnMoreLink) {
                    const learnMoreContainer = document.createElement('div');
                    learnMoreContainer.className = 'learn-more-container';
                    
                    const learnMoreButton = document.createElement('a');
                    learnMoreButton.href = serviceData.details.learnMoreLink;
                    learnMoreButton.textContent = serviceData.details.learnMoreText || 'Lees meer';
                    learnMoreButton.className = 'learn-more-btn';
                    learnMoreButton.target = '_self';
                    
                    learnMoreContainer.appendChild(learnMoreButton);
                    detailsContent.appendChild(learnMoreContainer);
                }
            }
        }
    });
}

// Utility function to set active nav link (for use across pages)
function setActiveNavLink(currentPage) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { setActiveNavLink, loadTexts };
}