// Main JavaScript for general functionality
let textsData = null;
let textsLoaded = false;
// Make it accessible globally for debugging
window.textsData = null;

// Wait for everything to be ready before showing page
window.addEventListener('load', async function() {
    // Page resources (CSS, images) are loaded, now load texts
    await loadTexts();
    
    // Remove preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }
    
    textsLoaded = true;
});

// Also initialize features on DOMContentLoaded for faster interactivity
document.addEventListener('DOMContentLoaded', function() {
    initializePageFeatures();
});

function initializePageFeatures() {
    
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
}

// Function to load texts from JSON file
async function loadTexts() {
    let retries = 0;
    const maxRetries = 3;
    
    while (retries < maxRetries) {
        try {
            const response = await fetch('/texts.json');
            if (!response.ok) {
                throw new Error(`Failed to load texts.json: ${response.status}`);
            }
            textsData = await response.json();
            window.textsData = textsData; // Make it globally accessible
            
            // Apply texts to the page
            applyTextsToPage();
            return; // Success, exit function
            
        } catch (error) {
            retries++;
            console.error(`Error loading texts (attempt ${retries}/${maxRetries}):`, error);
            
            if (retries < maxRetries) {
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 300 * retries));
            } else {
                console.error('Failed to load texts after all retries');
                // Apply whatever we have (might be empty)
                applyTextsToPage();
            }
        }
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
    
    // Update contact info with clickable links and international phone format
    const contactItems = document.querySelectorAll('.contact-item');
    
    if (contactItems.length >= 2) {
        // Phone number - make it clickable with international format
        if (textsData.contact.phone) {
            const phoneNumber = textsData.contact.phone.value.replace(/\s/g, ''); // Remove spaces for tel: link
            const internationalPhone = '+31' + phoneNumber.substring(1); // Convert 06... to +316...
            contactItems[0].innerHTML = `<strong>${textsData.contact.phone.label}</strong> <a href="tel:${internationalPhone}" class="contact-link">${textsData.contact.phone.value}</a>`;
        }
        
        // Email - obfuscated and clickable
        if (textsData.contact.email) {
            const emailParts = textsData.contact.email.value.split('@');
            const emailUser = emailParts[0];
            const emailDomain = emailParts[1];
            // Create obfuscated email using HTML entities and JavaScript
            contactItems[1].innerHTML = `<strong>${textsData.contact.email.label}</strong> <span class="email-obfuscated" data-user="${emailUser}" data-domain="${emailDomain}">Click to reveal email</span>`;
            
            // Add click handler for email reveal
            const emailSpan = contactItems[1].querySelector('.email-obfuscated');
            if (emailSpan) {
                emailSpan.addEventListener('click', function() {
                    const user = this.getAttribute('data-user');
                    const domain = this.getAttribute('data-domain');
                    const email = user + '@' + domain;
                    this.innerHTML = `<a href="mailto:${email}" class="contact-link">${email}</a>`;
                });
            }
        }
    }
    
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