// Enable lightbox for service page image galleries
document.addEventListener('DOMContentLoaded', function() {
    const serviceImages = document.querySelectorAll('.service-image');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    if (serviceImages.length === 0 || !lightbox) {
        return; // Not on a service page or lightbox not available
    }
    
    let currentImageIndex = 0;
    
    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImage.src = serviceImages[index].src;
        lightboxImage.alt = serviceImages[index].alt;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function showImage(index) {
        if (index >= 0 && index < serviceImages.length) {
            currentImageIndex = index;
            lightboxImage.src = serviceImages[index].src;
            lightboxImage.alt = serviceImages[index].alt;
        }
    }
    
    // Add click handlers to all service images
    serviceImages.forEach((image, index) => {
        image.style.cursor = 'pointer';
        image.addEventListener('click', () => openLightbox(index));
    });
    
    // Close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Previous image
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function() {
            const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : serviceImages.length - 1;
            showImage(newIndex);
        });
    }
    
    // Next image
    if (lightboxNext) {
        lightboxNext.addEventListener('click', function() {
            const newIndex = currentImageIndex < serviceImages.length - 1 ? currentImageIndex + 1 : 0;
            showImage(newIndex);
        });
    }
    
    // Close lightbox when clicking outside image
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox && lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft' && lightboxPrev) {
                lightboxPrev.click();
            } else if (e.key === 'ArrowRight' && lightboxNext) {
                lightboxNext.click();
            }
        }
    });
});