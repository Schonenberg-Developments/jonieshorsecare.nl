# Jonie's Horse Care Website

A modern, responsive website for Jonie's horse care services including boarding, riding lessons, and trauma recovery for horses.

## 🚀 Features

- **One-page design** with smooth scrolling navigation
- **Modal overlays** for detailed service information
- **Responsive gallery** with lightbox functionality
- **Modern build system** with Vite
- **Optimized performance** with lazy loading
- **Professional modal system** using MicroModal

## 🛠 Setup & Development

### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or download the project**
```bash
git clone <repository-url>
cd jonies-horse-care
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```
This will start a local server at `http://localhost:3000` with hot reload.

### Project Structure
```
jonies-horse-care/
├── index.html              # Main HTML file
├── styles.css              # Main styles including modal styles
├── scripts/
│   ├── script.js           # Main functionality
│   ├── texts.js            # Content management
│   ├── gallery.js          # Image gallery functionality
│   └── modals.js           # Modal system
├── images/
│   ├── hero_image.png      # Main hero image
│   └── gallery/            # Gallery images
├── package.json            # Project configuration
├── vite.config.js          # Build configuration
└── README.md              # This file
```

## 📦 Build & Deployment

### Build for Production
```bash
npm run build
```
This creates an optimized build in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

### Deploy to Server
```bash
npm run deploy
```
This builds and uploads to your server (configure server details in package.json).

## 🎨 Modal System

The website uses a sophisticated modal system for service details:

### How it works:
1. **Service cards** show brief summaries
2. **"Learn More" buttons** open detailed modals
3. **Modals contain**:
   - Comprehensive service descriptions
   - Detailed feature lists
   - Related images
   - Call-to-action buttons

### Modal Features:
- ✅ **Smooth animations** with slide-in effects
- ✅ **Keyboard navigation** (ESC to close, Tab navigation)
- ✅ **Accessibility compliant** with ARIA labels
- ✅ **Mobile responsive** with touch-friendly interface
- ✅ **Image gallery** within modals
- ✅ **Backdrop blur** for modern appearance

## 📱 Responsive Design

- **Desktop**: Full modal experience with side-by-side layout
- **Tablet**: Adjusted modal layout for medium screens
- **Mobile**: Stacked layout with touch-optimized controls

## 🖼 Image Management

### Gallery Images
Place images in `images/gallery/` folder. The system will automatically:
- Load images progressively
- Create infinite scroll effect
- Generate lightbox functionality

### Modal Images
Add service-specific images for modals:
- `images/stable-1.jpg`, `images/paddock-1.jpg` etc. for boarding
- `images/lesson-1.jpg`, `images/groundwork-1.jpg` etc. for lessons
- `images/trauma-1.jpg`, `images/trust-1.jpg` etc. for trauma recovery

## 🌐 Browser Support

- Chrome/Edge (modern versions)
- Firefox (modern versions)
- Safari (modern versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Content Management

Content is managed in `scripts/texts.js`:
- Easy to update service descriptions
- Multilingual ready (currently Dutch)
- Centralized content management

## 🎯 Performance Features

- **Lazy loading** for images
- **Code splitting** with Vite
- **CSS optimization** in production builds
- **Asset optimization** (images, fonts, etc.)
- **Modern JS features** with fallbacks

## 🚀 Future Enhancements

The modal system is designed to be easily expandable:
- Add pricing tables to modals
- Include booking forms
- Add testimonials sections
- Integrate contact forms within modals

## 🔧 Customization

### Colors
Main brand colors are defined in CSS:
- `#8b4513` - Brown (primary)
- `#6b8e23` - Green (secondary)
- `#f5f2ed` - Cream (background)

### Fonts
- **Headers**: Alice (serif)
- **Body**: Quicksand (sans-serif)

### Modal Content
Update modal content in the HTML file or create a dynamic content system by modifying `scripts/modals.js`.

---

**Built with ❤️ for Jonie's Horse Care**