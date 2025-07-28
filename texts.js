const texts = {
    hero: {
        title: "Paarden tot bloei laten komen",
        subtitle: "Technische expertise combineren met een natuurgerichte benadering van paardentraining",
        logoAlt: "Paarden tot bloei laten komen Logo"
    },
    
    services: {
        title: "Services",
        
        boarding: {
            title: "Pensionstal",
            description: "Veilige en comfortabele accommodatie voor je paard",
            buttonText: "Lees meer",
            buttonTextLess: "Minder tonen",
            details: {
                title: "Premium Pensiondiensten",
                items: [
                    "Ruime stallen met dagelijkse reiniging",
                    "Voedingsprogramma's met kwalitatief hooi en krachtvoer",
                    "24/7 beveiliging en toezicht",
                    "Grote weilanden voor weidegang",
                    "Professioneel personeel ter plaatse"
                ]
            }
        },
        
        riding: {
            title: "Rij- en Grondwerklessen",
            description: "Persoonlijke rij-instructie voor alle niveaus",
            buttonText: "Lees meer",
            buttonTextLess: "Minder tonen",
            details: {
                title: "Uitgebreide Trainingsprogramma's",
                items: [
                    "Rijlessen van beginner tot gevorderd niveau",
                    "Grondwerk en vaardigheden in omgang met paarden",
                    "Technieken van natuurlijk horsemanship",
                    "Instructie in dressuur en springen",
                    "Voorbereiding op buitenritten",
                    "Paardengedrag en communicatie"
                ]
            }
        },
        
        trauma: {
            title: "Training voor Traumaverwerking",
            description: "Paarden ondersteunen bij revalidatie en herstel",
            buttonText: "Lees meer",
            buttonTextLess: "Minder tonen",
            details: {
                title: "Gespecialiseerde Revalidatiediensten",
                items: [
                    "Traumabewuste trainingsmethoden",
                    "Voorzichtige hertraining voor opvangpaarden",
                    "Gedragsveranderingsprogramma's",
                    "Oefeningen voor het opbouwen van vertrouwen",
                    "Technieken voor stressvermindering",
                    "Samenwerking met dierenartsen"
                ]
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
            label: "Phone:",
            value: "+31 6 1234 5678"
        },
        email: {
            label: "Email:",
            value: "info@jonieswebsite.com"
        },
        address: {
            label: "Adress:",
            value: "ztraatnaam 123, 1234 AB Plaatsnaam"
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
function loadTexts() {
    // Update page title
    document.title = texts.meta.title;
    
    // Update hero section
    const heroTitle = document.querySelector('.hero-text h1');
    const heroSubtitle = document.querySelector('.hero-text p');
    const heroLogo = document.querySelector('.hero-logo');
    
    if (heroTitle) heroTitle.textContent = texts.hero.title;
    if (heroSubtitle) heroSubtitle.textContent = texts.hero.subtitle;
    if (heroLogo) heroLogo.alt = texts.hero.logoAlt;
    
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

// Helper function to update service cards
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
        const detailsTitle = card.querySelector('.details-content h4');
        const detailsList = card.querySelector('.details-content ul');
        
        // Check if this is the right service card by matching the icon class
        if (icon && icon.classList.contains(serviceIcons[serviceKey])) {
            if (title) title.textContent = serviceData.title;
            if (description) description.textContent = serviceData.description;
            if (button) button.textContent = serviceData.buttonText;
            if (detailsTitle) detailsTitle.textContent = serviceData.details.title;
            
            // Update details list
            if (detailsList) {
                detailsList.innerHTML = '';
                serviceData.details.items.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    detailsList.appendChild(li);
                });
            }
        }
    });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = texts;
}