# Jonie's Horse Care

A modern, responsive website for a professional horse care business offering boarding, training, and rehabilitation services.

## Project Overview

This is a static website built with vanilla JavaScript and Vite, designed to showcase equestrian services with a focus on user experience and performance. The site features dynamic content loading, an image gallery system, and a clean, accessible design.

**Live Site:** jonieshorsecare.nl

## Technical Architecture

### Core Technologies

- **Build Tool:** Vite 5.0
- **Languages:** HTML5, CSS3, ES6+ JavaScript
- **Styling:** Custom CSS with responsive design
- **Fonts:** Google Fonts (Alice for headings, Quicksand for body text)
- **Icons:** Font Awesome 6.4.0

### Project Structure

```
jonieshorsecare.nl/
├── public/
│   ├── images/          # Image assets organized by page
│   ├── texts.json       # Centralized content management
│   └── gallery-images.json  # Gallery configuration
├── scripts/
│   ├── components.js    # Reusable UI components (navbar, footer)
│   ├── main.js         # Core functionality and content loading
│   └── gallery.js      # Gallery system with lazy loading
├── styles.css          # Global styles and responsive design
└── *.html             # Page templates
```

## Key Features

### Content Management System

All text content is externalized to `texts.json`, allowing for easy updates without touching HTML. The system supports:

- Multi-language potential (currently Dutch)
- Centralized content for pages and service descriptions
- Dynamic page title and meta updates

### Component Architecture

**Reusable Components:**
- Navigation bar with mobile hamburger menu
- Footer with copyright information
- Active link highlighting based on current page

Components are automatically injected into all pages, reducing code duplication and maintenance overhead.

### Gallery System

**Features:**
- Dynamic image loading from JSON configuration
- Infinite scroll with seamless looping
- Lightbox modal for full-size viewing
- Skeleton loading states for better UX
- Keyboard navigation support
- Touch-friendly mobile controls

**Technical Implementation:**
- Images are loaded progressively with validation
- Failed images are gracefully handled
- 10-second timeout prevents indefinite loading
- Optimized for both desktop and mobile viewports

### Performance Optimizations

- Image preloading for hero section
- Lazy loading for gallery images
- CSS and JS minification in production build
- Asset optimization through Vite's build pipeline
- Efficient DOM manipulation patterns

### Responsive Design

The site is fully responsive with specific optimizations for:
- Desktop (1200px+ containers)
- Tablet (768px - 1024px)
- Mobile (< 768px with touch-optimized controls)

**Mobile-Specific Features:**
- Hamburger navigation menu
- Adjusted typography scales
- Touch-friendly button sizes
- Optimized image dimensions

## Design System

### Color Palette

- Primary: #2C6E63 (Deep teal)
- Secondary: #A8E6CF (Soft mint)
- Accent: #FF6F91 (Coral pink)
- Background: #f5f2ed (Warm cream)
- Text: #333333 (Dark gray)

### Typography

- **Headings:** Alice (serif) - adds elegance
- **Body:** Quicksand (sans-serif) - modern readability
- Responsive font scaling for mobile devices

## Service Pages

Each service has a dedicated page with:
- Hero header with title and subtitle
- Service introduction
- Three-column feature grid
- Image gallery
- Call-to-action section

**Services Include:**
1. Pensionstal (Boarding Stable)
2. Rij- en Grondwerklessen (Riding & Groundwork Lessons)
3. Training voor Traumaverwerking (Trauma Recovery Training)
4. Pivo Lessen (Technology-Enhanced Lessons)
5. Ter Dekking (Breeding Services)

## Build Configuration

The Vite configuration includes:
- Multi-page input setup for all HTML files
- Asset organization (js, css, images)
- Terser minification with console removal
- Source map generation for debugging
- Custom asset naming patterns

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

## Code Quality

### JavaScript Patterns

- ES6 modules for code organization
- Async/await for asynchronous operations
- Event delegation for efficient event handling
- Error handling with fallbacks

### CSS Architecture

- Mobile-first responsive design
- CSS custom properties for theming
- Transitions and animations for UX enhancement
- Accessible focus states

### Accessibility

- Semantic HTML5 structure
- ARIA labels where appropriate
- Keyboard navigation support
- Focus management in modals
- Responsive font sizing

## Contact Integration

Contact information includes:
- Click-to-call phone links
- Obfuscated email addresses (spam protection)
- Visual hover states for better UX

## Future Enhancements

Potential areas for expansion:
- Multi-language support (EN/NL toggle)
- Content Management System integration
- Online booking system
- Blog/news section
- Enhanced SEO optimization
- Analytics integration

## Development Approach

This project demonstrates:
- Clean, maintainable code structure
- Performance-first development
- Progressive enhancement principles
- Separation of concerns (content, style, behavior)
- Modern JavaScript best practices
- Responsive design expertise

## Portfolio Highlights

**Technical Skills Demonstrated:**
- Vanilla JavaScript proficiency
- Modern build tooling (Vite)
- Responsive CSS techniques
- Component-based architecture
- Performance optimization
- UX/UI design implementation
- Content management patterns
- Cross-browser compatibility

**Problem Solving:**
- Created a robust gallery system with infinite scroll
- Implemented graceful image loading with fallbacks
- Designed a flexible content management approach
- Built reusable components without frameworks
- Optimized for both performance and user experience

---

**License:** MIT  
**Author:** Jonie's Horse Care  
**Year:** 2025