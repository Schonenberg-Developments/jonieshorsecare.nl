// Reusable components for navbar and footer
// This file creates and manages the navbar and footer across all pages
import { logoSVG } from './logo.js';

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
                    <a href="/" class="nav-logo">
                        <span>
                            ${logoSVG}
                            Jonie's Horse Care
                        </span>
                    </a>
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
            { href: '/', text: 'Home' },
            { href: '/pensionstal.html', text: 'Pensionstal' },
            { href: '/rijlessen.html', text: 'Rijlessen' },
            { href: '/trauma-recovery.html', text: 'Trauma Recovery' },
            { href: '/pivo-lessen.html', text: 'Pivo Lessen' },
            { href: '/ter-dekking.html', text: 'Ter Dekking' },
            { href: '/#contact', text: 'Contact' }
        ];

        return links.map(link => {
            const isActive = this.isActiveLink(link.href);
            const activeClass = isActive ? ' active' : '';
            return `<a href="${link.href}" class="nav-link${activeClass}">${link.text}</a>`;
        }).join('');
    }

    isActiveLink(href) {
        // Handle contact link separately
        if (href === '/#contact') {
            return false; // Contact is not a page, it's an anchor
        }
        
        // Check if current page matches
        if (href === this.currentPage) {
            return true;
        }
        
        // Handle index.html as home
        if (href === '/' && (this.currentPage === '' || this.currentPage === 'index.html')) {
            return true;
        }
        
        // Check if the href ends with the current page (for paths like /pensionstal.html)
        if (href.endsWith(this.currentPage) && this.currentPage !== '') {
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