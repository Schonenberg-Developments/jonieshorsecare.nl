// Reusable components for navbar and footer
// This file creates and manages the navbar and footer across all pages

class NavbarComponent {
    constructor() {
        this.currentPage = this.getCurrentPage();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename;
    }

    render() {
        return `
            <nav class="navbar">
                <div class="nav-container">
                    <a href="index.html" class="nav-logo">
                        <div class="nav-logo">
                            <span>
                                <svg class="nav-logo-svg" viewBox="0 0 667 804" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M388.58,302.58c34.95-41.86-10.27-89.33-26.05-128.61-8.82-21.96-9.71-47.51-20.73-67.27-8.72-15.64-22.84-29.42-37.49-39.51-4.47-3.08-9.8-4.46-13.13-8.68,7.04-11.48,13.37-24.87,15.57-38.26.42-2.55,2.2-13.33-.39-14.16-9.59-3.09-43.29,29.97-49.42,38.35-18.14,2.49-36.12,3.35-54.15,7.85C86.43,81.36,28.62,201.99,43.02,315.48c16.27,128.3,133,153.28,180.84,254.16,18.58,39.18,21.14,87.33,12.83,129.54-.84,4.28-7.71,25.95-5.09,27.91,7.85,1.39,16.37-9.25,20.79-15.21,31.8-42.82,33.18-123.39,16.63-172.41-24.19-71.65-90.35-121.4-103.54-196.46-8.41-47.87.39-93.27,30.55-131.49,1.27-1.62,9.68-11.5,10.47-11.51,7.64,16.66,13.37,32.95,29.17,43.81,12.62,8.68,26.88,8.92,40,16,9.67,5.22,42.92,27.06,47.77,35.23,5.15,8.68,5.68,16.59,15.9,22.1,17.6,9.49,37.49-.5,49.24-14.59ZM525.5,373c-4.19-.89-10.95.65-15.5,0l17.53-6.97c17.84-9.22,19.69-43.32-5.95-39.94-5.1.67-9.65,4.9-14.83,3.66s-22.17-23.83-25.56-29.44c-9.42-15.57-16.86-34.92-13.18-53.3,1.45-.23,1.39,1.76,1.68,2.79,7.06,24.68,21.92,68.88,52.85,69.25,2.03.02,3.89-.99,5.85-.94,13.15.3,20.65,14.09,20.03,26.05-.51,9.82-7.06,16.07-6.41,26.33.58,9.14,5.69,14.99,8.95,23.11,22.55-5.8,42.1-29.43,50.8-50.33,31.16-74.84-41.78-138.48-114.55-120.55-20.81,5.13-39.87,15.32-31.24,40.25-18.45,5.93-12.62,27.84-20.14,40.37-8.43,14.05-45.25,29.82-15.76,44.3,1.03,4.88-10.95,13.59-.08,18.88v1.47c-7.69,2.91-.51,8.7,0,12.6,1,7.8-7.05,18.47,2.5,26.43,8.32,6.94,23.52,2.29,33.93,4.07,13.67,2.34,18.43,27.04,20.27,38.73,3.87,24.58-7.41,27.87-20.64,44.73-15.52,19.77-41.57,54.03-48.32,77.68-12.69,44.47,16.86,86.1-10.3,130.7-31.33,51.44-110.78,65.06-161.34,35.5-31.89-18.64-45.79-55.06-65.67-84.33-17.06-25.13-37.71-48.09-63.41-64.59,1.13-1.34,3.5.75,4.65,1.35,46.07,23.79,75.27,62.28,100.71,106.29l8.62,11.86c2.77-10.27,3.46-20.91,3.05-31.54-3.32-86.07-94.39-138.82-172.55-143.45-9.14-.54-20.36-1.04-28.47,3.49,39.91,25.28,40.98,76.2,63.56,113.42,14.7,24.24,40.84,51.52,65.75,65.25,13.66,7.53,29.08,11.67,42.69,19.31,11.35,6.37,21.56,15.3,33.31,21.69,112.56,61.19,241.99,17.82,307.09-88.25,27.79-45.29,50.24-113.98,43.57-167.41-4.36-34.93-31.66-55.08-36.71-88.29-.55-3.65.11-7.17-.36-10.64s-9.8-22.9-12.06-25.94c-.9-1.21-3-3.36-4.35-3.65ZM653,489.01c-8.88-.88-17.42-10.41-20.05-18.45-7.33-22.41,4.35-36.7,6.04-57.07,2.12-25.54-7.14-53.57-30.35-66.36-2.29.43-5.57,11.05-7.12,13.89-5.41,9.92-9.91,14.88-13.46,26.54-8.49,27.94-13.34,65.92,1.42,92.46,9.9,17.81,28.91,25.99,48.74,19.71,2.08-.66,17.28-7.91,14.77-10.72Z" fill="#f5f2ed"/>
                                    <path d="M388.58,302.58c-11.76,14.08-31.64,24.08-49.24,14.59-10.22-5.51-10.75-13.42-15.9-22.1-4.85-8.17-38.1-30.02-47.77-35.23-13.12-7.08-27.38-7.32-40-16-15.79-10.86-21.53-27.15-29.17-43.81-.79.01-9.2,9.9-10.47,11.51-30.16,38.22-38.96,83.62-30.55,131.49,13.19,75.06,79.35,124.81,103.54,196.46,16.55,49.02,15.17,129.59-16.63,172.41-4.43,5.96-12.94,16.59-20.79,15.21-2.63-1.96,4.24-23.63,5.09-27.91,8.32-42.21,5.75-90.37-12.83-129.54-47.84-100.87-164.57-125.85-180.84-254.16C28.62,201.99,86.43,81.36,202.78,52.28c18.03-4.51,36.01-5.36,54.15-7.85,6.14-8.38,39.84-41.44,49.42-38.35,2.59.84.81,11.61.39,14.16-2.2,13.39-8.53,26.78-15.57,38.26,3.34,4.22,8.66,5.6,13.13,8.68,14.65,10.09,28.78,23.87,37.49,39.51,11.01,19.76,11.91,45.31,20.73,67.27,15.78,39.28,61,86.75,26.05,128.61Z" fill="#6b8e23"/>
                                    <path d="M525.5,373c1.35.29,3.45,2.44,4.35,3.65,2.26,3.04,11.6,22.53,12.06,25.94s-.19,6.99.36,10.64c5.05,33.21,32.36,53.36,36.71,88.29,6.66,53.43-15.78,122.11-43.57,167.41-65.1,106.08-194.53,149.45-307.09,88.25-11.75-6.39-21.96-15.32-33.31-21.69-13.61-7.64-29.03-11.78-42.69-19.31-24.91-13.73-51.04-41.01-65.75-65.25-22.58-37.22-23.65-88.14-63.56-113.42,8.11-4.53,19.33-4.03,28.47-3.49,78.16,4.63,169.24,57.38,172.55,143.45.41,10.63-.29,21.26-3.05,31.54l-8.62-11.86c-25.44-44.01-54.64-82.5-100.71-106.29-1.15-.6-3.52-2.69-4.65-1.35,25.7,16.51,46.34,39.47,63.41,64.59,19.88,29.27,33.78,65.69,65.67,84.33,50.56,29.56,130.01,15.94,161.34-35.5,27.16-44.6-2.39-86.24,10.3-130.7,6.75-23.64,32.8-57.91,48.32-77.68,13.24-16.86,24.51-20.15,20.64-44.73-1.84-11.69-6.59-36.39-20.27-38.73-10.41-1.78-25.61,2.87-33.93-4.07-9.55-7.96-1.5-18.63-2.5-26.43-.5-3.91-7.69-9.69,0-12.6v-1.47c-10.86-5.28,1.13-14,.1-18.88-29.49-14.48,7.32-30.25,15.76-44.3,7.52-12.53,1.69-34.44,20.14-40.37-8.63-24.93,10.43-35.12,31.24-40.25,72.77-17.93,145.71,45.71,114.55,120.55-8.7,20.9-28.25,44.53-50.8,50.33-3.26-8.12-8.36-13.97-8.95-23.11-.65-10.26,5.9-16.51,6.41-26.33.62-11.96-6.88-25.75-20.03-26.05-1.96-.04-3.82.97-5.85.94-30.92-.37-45.79-44.57-52.85-69.25-.29-1.03-.24-3.02-1.68-2.79-3.68,18.39,3.76,37.73,13.18,53.3,3.4,5.61,20.17,28.15,25.56,29.44s9.72-2.99,14.83-3.66c25.64-3.38,23.78,30.72,5.95,39.94l-17.53,6.97c4.55.65,11.31-.89,15.5,0Z" fill="#8b4513"/>
                                    <path d="M653,489.01c2.51,2.81-12.7,10.06-14.77,10.72-19.83,6.28-38.84-1.9-48.74-19.71-14.76-26.54-9.91-64.52-1.42-92.46,3.54-11.66,8.05-16.62,13.46-26.54,1.55-2.84,4.83-13.46,7.12-13.89,23.21,12.79,32.47,40.81,30.35,66.36-1.69,20.36-13.37,34.66-6.04,57.07,2.63,8.04,11.17,17.58,20.05,18.45Z" fill="#8b4513"/>
                                </svg>
                                Jonie's Horse Care
                            </span>
                        </a>
                    </div>
                    <div class="nav-menu" id="nav-menu">
                        ${this.renderNavLinks()}
                    </div>
                    <div class="hamburger" id="hamburger">
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </div>
                </div>
            </nav>
        `;
    }

    renderNavLinks() {
        const links = [
            { href: 'index.html', text: 'Home' },
            { href: 'pensionstal.html', text: 'Pensionstal' },
            { href: 'rijlessen.html', text: 'Rijlessen' },
            { href: 'trauma-recovery.html', text: 'Trauma Recovery' },
            { href: 'pivo-lessen.html', text: 'Pivo Lessen' },
            { href: 'ter-dekking.html', text: 'Ter Dekking' },
            { href: 'index.html#contact', text: 'Contact' }
        ];

        return links.map(link => {
            const isActive = this.isActiveLink(link.href);
            const activeClass = isActive ? ' active' : '';
            return `<a href="${link.href}" class="nav-link${activeClass}">${link.text}</a>`;
        }).join('');
    }

    isActiveLink(href) {
        // Handle contact link separately
        if (href === '#contact') {
            return false; // Contact is not a page, it's an anchor
        }
        
        // Check if current page matches
        if (href === this.currentPage) {
            return true;
        }
        
        // Handle index.html as home
        if (href === 'index.html' && (this.currentPage === '' || this.currentPage === 'index.html')) {
            return true;
        }
        
        return false;
    }

    init() {
        // Insert navbar at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', this.render());
        
        // Initialize mobile navigation
        this.initMobileNav();
        
        // Initialize smooth scrolling for anchor links
        this.initSmoothScrolling();
    }

    initMobileNav() {
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
    }

    initSmoothScrolling() {
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
    }
}

class FooterComponent {
    render() {
        return `
            <footer>
                <p>© 2025 Schonenberg Developments. All rights reserved.</p>
            </footer>
        `;
    }

    init() {
        // Insert footer at the end of body
        document.body.insertAdjacentHTML('beforeend', this.render());
    }
}

// Auto-initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if components haven't been manually initialized
    if (!document.querySelector('.navbar')) {
        const navbar = new NavbarComponent();
        navbar.init();
    }
    
    if (!document.querySelector('footer')) {
        const footer = new FooterComponent();
        footer.init();
    }
    
    // Add scroll effect to navbar after it's created
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add shadow when scrolled
            if (scrollTop > 0) {
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
            } else {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        });
    }
});

// Export for manual initialization if needed
window.NavbarComponent = NavbarComponent;
window.FooterComponent = FooterComponent;