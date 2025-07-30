// Main JavaScript for general functionality
let textsData = null;

document.addEventListener('DOMContentLoaded', async function() {
    // Load texts first
    await loadTexts();
    
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

    // Service card hover effects
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
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
});

// Function to load texts from JSON file
async function loadTexts() {
    try {
        const response = await fetch('./texts.json');
        if (!response.ok) {
            throw new Error(`Failed to load texts.json: ${response.status}`);
        }
        textsData = await response.json();
        
        // Apply texts to the page
        applyTextsToPage();
        
    } catch (error) {
        console.error('Error loading texts:', error);
        // Fallback to default behavior if JSON fails to load
    }
}

// Function to apply loaded texts to the page
function applyTextsToPage() {
    if (!textsData) return;
    
    // Update page title
    if (textsData.meta && textsData.meta.title) {
        document.title = textsData.meta.title;
    }
    
    // Update hero section
    const heroTitle = document.querySelector('.hero-text h1');
    const heroSubtitle = document.querySelector('.hero-text p');
    const heroLogo = document.querySelector('.hero-logo');
    const heroSiteTitle = document.querySelector('.hero-subtitle span');
    
    if (heroTitle && textsData.hero.title) heroTitle.textContent = textsData.hero.title;
    if (heroSubtitle && textsData.hero.subtitle) heroSubtitle.textContent = textsData.hero.subtitle;
    if (heroLogo && textsData.hero.logoAlt) heroLogo.alt = textsData.hero.logoAlt;
    if (heroSiteTitle && textsData.hero.siteTitle) heroSiteTitle.textContent = textsData.hero.siteTitle;
    
    // Update services section
    const servicesTitle = document.querySelector('.services h2');
    if (servicesTitle && textsData.services.title) servicesTitle.textContent = textsData.services.title;
    
    // Update individual service cards
    updateServiceCard('boarding', textsData.services.boarding);
    updateServiceCard('riding', textsData.services.riding);
    updateServiceCard('trauma', textsData.services.trauma);
    updateServiceCard('pivo', textsData.services.pivo);
    updateServiceCard('breeding', textsData.services.breeding);
    
    // Update gallery section
    const galleryTitle = document.querySelector('.gallery h2');
    if (galleryTitle && textsData.gallery.title) galleryTitle.textContent = textsData.gallery.title;
    
    // Update contact section
    const contactTitle = document.querySelector('.contact h2');
    const contactDescription = document.querySelector('.contact p');
    
    if (contactTitle && textsData.contact.title) contactTitle.textContent = textsData.contact.title;
    if (contactDescription && textsData.contact.description) contactDescription.textContent = textsData.contact.description;
    
    // Update contact info
    const contactItems = document.querySelectorAll('.contact-item');
    const contactData = [textsData.contact.phone, textsData.contact.email, textsData.contact.address];
    
    contactItems.forEach((item, index) => {
        if (contactData[index]) {
            item.innerHTML = `<strong>${contactData[index].label}</strong> ${contactData[index].value}`;
        }
    });
    
    // Update footer
    const footerText = document.querySelector('footer p');
    if (footerText && textsData.footer.copyright) footerText.textContent = textsData.footer.copyright;
    
    // Update service page content if on a service page
    updateServicePageContent();
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
        const button = card.querySelector('.service-btn');
        
        // Check if this is the right service card by matching the icon class
        if (icon && icon.classList.contains(serviceIcons[serviceKey])) {
            if (title && serviceData.title) title.textContent = serviceData.title;
            if (description && serviceData.description) description.textContent = serviceData.description;
            if (button && serviceData.buttonText) button.textContent = serviceData.buttonText;
        }
    });
}

// Function to update service page content based on current page
function updateServicePageContent() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Map HTML filenames to data keys
    const pageMapping = {
        'pensionstal.html': 'pensionstal',
        'rijlessen.html': 'rijlessen',
        'trauma-recovery.html': 'traumaRecovery',
        'pivo-lessen.html': 'pivoLessen',
        'ter-dekking.html': 'terDekking'
    };
    
    const pageKey = pageMapping[currentPage];
    if (pageKey && textsData.pages[pageKey]) {
        const pageData = textsData.pages[pageKey];
        
        // Update page header
        const pageTitle = document.querySelector('.page-title');
        const pageSubtitle = document.querySelector('.page-subtitle');
        const serviceIntro = document.querySelector('.service-intro');
        
        if (pageTitle && pageData.title) {
            pageTitle.textContent = pageData.title;
            // Also update document title
            document.title = `${pageData.title} - Jonie's Horse Care`;
        }
        if (pageSubtitle && pageData.subtitle) pageSubtitle.textContent = pageData.subtitle;
        if (serviceIntro && pageData.intro) serviceIntro.textContent = pageData.intro;
        
        // Update service options
        if (pageData.serviceOptions) {
            updateServiceOptions(pageData.serviceOptions);
        }
        
        // Update tech highlight (for Pivo page)
        if (pageData.techHighlight) {
            const techHighlightTitle = document.querySelector('.tech-highlight h3');
            const techHighlightDesc = document.querySelector('.tech-highlight p');
            if (techHighlightTitle) techHighlightTitle.textContent = pageData.techHighlight.title;
            if (techHighlightDesc) techHighlightDesc.textContent = pageData.techHighlight.description;
        }
        
        // Update breeding highlight (for ter dekking page)
        if (pageData.breedingHighlight) {
            const breedingHighlightTitle = document.querySelector('.breeding-highlight h3');
            const breedingHighlightDesc = document.querySelector('.breeding-highlight p');
            if (breedingHighlightTitle) breedingHighlightTitle.textContent = pageData.breedingHighlight.title;
            if (breedingHighlightDesc) breedingHighlightDesc.textContent = pageData.breedingHighlight.description;
        }
        
        // Update placeholder content (for ter dekking page)
        if (pageData.placeholderContent) {
            const placeholderTitle = document.querySelector('.placeholder-content h3');
            const placeholderDesc = document.querySelector('.placeholder-content p');
            if (placeholderTitle) placeholderTitle.textContent = pageData.placeholderContent.title;
            if (placeholderDesc) placeholderDesc.textContent = pageData.placeholderContent.description;
        }
        
        // Update CTA section
        if (pageData.cta) {
            const ctaTitle = document.querySelector('.cta-section h3');
            const ctaDesc = document.querySelector('.cta-section p');
            const ctaButton = document.querySelector('.cta-button');
            if (ctaTitle) ctaTitle.textContent = pageData.cta.title;
            if (ctaDesc) ctaDesc.textContent = pageData.cta.description;
            if (ctaButton) ctaButton.textContent = pageData.cta.buttonText;
        }
    }
}

// Helper function to update service options sections
function updateServiceOptions(serviceOptions) {
    const serviceOptionElements = document.querySelectorAll('.service-option');
    const optionKeys = Object.keys(serviceOptions);
    
    serviceOptionElements.forEach((element, index) => {
        if (index < optionKeys.length) {
            const optionKey = optionKeys[index];
            const optionData = serviceOptions[optionKey];
            
            // Update title
            const title = element.querySelector('h3');
            if (title && optionData.title) {
                title.textContent = optionData.title;
            }
            
            // Update list items
            const list = element.querySelector('ul');
            if (list && optionData.items) {
                list.innerHTML = '';
                optionData.items.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    list.appendChild(li);
                });
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