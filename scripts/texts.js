export const texts = {
    hero: {
        title: "Paarden tot bloei laten komen",
        subtitle: "Technische expertise combineren met een natuurgerichte benadering van paardentraining",
        logoAlt: "Paarden tot bloei laten komen Logo",
        siteTitle: "Jonie's horse care"
    },
    
    services: {
        title: "Services",
        
        boarding: {
            title: "Pensionstal",
            description: "Veilige en comfortabele accommodatie voor je paard",
            buttonText: "Lees meer",
            buttonTextLess: "Minder tonen",
            details: {
                summary: "Wij bieden verschillende pensiondiensten aan, van volledige stalling tot 24/7 buitenverblijf. Elk paard krijgt zorgvuldige aandacht en kwaliteitsvoeding.",
                highlights: [
                    "Premium stalling met dagelijkse zorg",
                    "24/7 buitenverblijf opties",
                    "Half pension mogelijkheden",
                    "Kwalitatief voer en professioneel personeel"
                ],
                learnMoreLink: "modal-pensionstal",
                learnMoreText: "Meer over onze pensiondiensten"
            }
        },
        
        riding: {
            title: "Rij- en Grondwerklessen",
            description: "Persoonlijke rij-instructie voor alle niveaus - Zowel kinderen als volwassenen",
            buttonText: "Lees meer",
            buttonTextLess: "Minder tonen",
            details: {
                summary: "Van beginners tot gevorderde ruiters, wij bieden persoonlijke lessen in rijden, grondwerk en natuurlijk horsemanship. Ook zadelmak maken en begeleiding mogelijk.",
                highlights: [
                    "Rijlessen voor alle niveaus (beginner tot dressuur M)",
                    "Grondwerk en natuurlijk horsemanship",
                    "Zadelmak maken en begeleiding",
                    "Op locatie of bij ons - tijdelijke stalling mogelijk"
                ],
                learnMoreLink: "modal-rijlessen",
                learnMoreText: "Meer over onze lessen"
            }
        },
        
        trauma: {
            title: "Training voor Traumaverwerking",
            description: "Paarden ondersteunen bij revalidatie van trauma's, herstel en voeding",
            buttonText: "Lees meer",
            buttonTextLess: "Minder tonen",
            details: {
                summary: "Gespecialiseerde zorg voor paarden die traumatische ervaringen hebben gehad. Met geduldige, traumabewuste methoden helpen we paarden weer vertrouwen op te bouwen.",
                highlights: [
                    "Traumabewuste trainingsmethoden",
                    "Hertraining voor project paarden",
                    "Vertrouwen opbouwen en stressvermindering",
                    "Voedingsschema's en samenwerking met dierenartsen"
                ],
                learnMoreLink: "modal-trauma-recovery",
                learnMoreText: "Meer over trauma recovery"
            }
        }
    },
    
    gallery: {
        title: "Onze Paarden en Stallen",
        imageAlt: "Galerij foto"
    },
    
    contact: {
        title: "Neem contact op",
        description: "Klaar om je paard te helpen bloeien? Neem contact met ons op voor meer informatie over onze diensten en om een consult in te plannen.",
        phone: {
            label: "Mobiel:",
            value: "06 40929498"
        },
        email: {
            label: "Email:",
            value: "contact@jonieshorsecare.nl"
        },
        address: {
            label: "Adress:",
            value: "straatnaam 123, 1234 AB Plaatsnaam"
        }
    },
    
    footer: {
        copyright: "© 2025 Schonenberg Developments. All rights reserved."
    },
    
    meta: {
        title: "Paarden tot bloei laten komen"
    }
};

// Function to load texts into the page
export function loadTexts() {
    // Update page title
    document.title = texts.meta.title;
    
    // Update hero section
    const heroTitle = document.querySelector('.hero-text h1');
    const heroSubtitle = document.querySelector('.hero-text p');
    const heroLogo = document.querySelector('.hero-logo');
    const heroSiteTitle = document.querySelector('.hero-subtitle span');
    
    if (heroTitle) heroTitle.textContent = texts.hero.title;
    if (heroSubtitle) heroSubtitle.textContent = texts.hero.subtitle;
    if (heroLogo) heroLogo.alt = texts.hero.logoAlt;
    if (heroSiteTitle) heroSiteTitle.textContent = texts.hero.siteTitle;
    
    // Update services section
    const servicesTitle = document.querySelector('.services h2');
    if (servicesTitle) servicesTitle.textContent = texts.services.title;
    
    // Update individual service cards
    updateServiceCard('boarding', texts.services.boarding);
    updateServiceCard('riding', texts.services.riding);
    updateServiceCard('trauma', texts.services.trauma);
    
    // Update gallery section
    const galleryTitle = document.querySelector('.gallery h2');
    if (galleryTitle) galleryTitle.textContent = texts.gallery.title;
    
    // Update contact section
    const contactTitle = document.querySelector('.contact h2');
    const contactDescription = document.querySelector('.contact p');
    
    if (contactTitle) contactTitle.textContent = texts.contact.title;
    if (contactDescription) contactDescription.textContent = texts.contact.description;
    
    // Update contact info
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        const contactData = [texts.contact.phone, texts.contact.email, texts.contact.address];
        if (contactData[index]) {
            item.innerHTML = `<strong>${contactData[index].label}</strong> ${contactData[index].value}`;
        }
    });
    
    // Update footer
    const footerText = document.querySelector('footer p');
    if (footerText) footerText.textContent = texts.footer.copyright;
}

// Helper function to update service cards with new simplified structure
function updateServiceCard(serviceKey, serviceData) {
    const cards = document.querySelectorAll('.service-card');
    const serviceIcons = {
        boarding: 'fa-home',
        riding: 'fa-horse',
        trauma: 'fa-heart'
    };
    
    cards.forEach(card => {
        const icon = card.querySelector('.service-icon i');
        const title = card.querySelector('h3');
        const description = card.querySelector('p');
        const button = card.querySelector('.expand-btn');
        const detailsContent = card.querySelector('.details-content');
        
        // Check if this is the right service card by matching the icon class
        if (icon && icon.classList.contains(serviceIcons[serviceKey])) {
            if (title) title.textContent = serviceData.title;
            if (description) description.textContent = serviceData.description;
            if (button) button.textContent = serviceData.buttonText;
            
            // Update details content with new simplified structure
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
                    learnMoreButton.target = '_self'; // Opens in same window
                    
                    learnMoreContainer.appendChild(learnMoreButton);
                    detailsContent.appendChild(learnMoreContainer);
                }
            }
        }
    });
}