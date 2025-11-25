// Carousel functionality
class Carousel {
    constructor(container, slides, dots, autoplayInterval = 5000) {
        this.container = container;
        this.slides = slides;
        this.dots = dots;
        this.currentSlide = 0;
        this.autoplayInterval = autoplayInterval;
        this.autoplayTimer = null;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        // Add click event listeners to dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Add keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.stopAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
        
        // Start autoplay
        this.startAutoplay();
        
        // Pause autoplay when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoplay();
            } else {
                this.startAutoplay();
            }
        });
    }
    
    goToSlide(slideIndex) {
        if (this.isTransitioning || slideIndex === this.currentSlide) return;
        
        this.isTransitioning = true;
        
        const direction = slideIndex > this.currentSlide ? 1 : -1;
        
        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        
        // Add transition classes
        if (direction > 0) {
            this.slides[this.currentSlide].classList.add('prev');
        }
        
        // Update current slide
        this.currentSlide = slideIndex;
        
        // Add active class to new slide and dot
        setTimeout(() => {
            this.slides[this.currentSlide].classList.add('active');
            this.dots[this.currentSlide].classList.add('active');
            
            // Remove prev class from all slides
            this.slides.forEach(slide => slide.classList.remove('prev'));
            
            this.isTransitioning = false;
        }, 50);
        
        // Update ARIA attributes
        this.updateAriaAttributes();
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    startAutoplay() {
        this.stopAutoplay();
        this.autoplayTimer = setInterval(() => {
            this.nextSlide();
        }, this.autoplayInterval);
    }
    
    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }
    
    updateAriaAttributes() {
        this.slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index !== this.currentSlide);
            slide.setAttribute('aria-label', `Slide ${index + 1} of ${this.slides.length}`);
        });
        
        this.dots.forEach((dot, index) => {
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.setAttribute('aria-pressed', index === this.currentSlide);
        });
    }
}

// Mobile menu functionality
class MobileMenu {
    constructor(toggleButton, nav) {
        this.toggleButton = toggleButton;
        this.nav = nav;
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        this.toggleButton.addEventListener('click', () => this.toggle());
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.nav.contains(e.target) && !this.toggleButton.contains(e.target)) {
                this.close();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    open() {
        this.nav.style.display = 'block';
        this.nav.style.position = 'absolute';
        this.nav.style.top = '80px';
        this.nav.style.left = '0';
        this.nav.style.right = '0';
        this.nav.style.backgroundColor = '#FFFFFF';
        this.nav.style.borderBottom = '1px solid #E5E7EB';
        this.nav.style.padding = '16px 24px';
        this.nav.style.boxShadow = '0 4px 8px -2px rgba(0, 87, 183, 0.08)';
        
        this.nav.querySelector('.nav-list').style.flexDirection = 'column';
        this.nav.querySelector('.nav-list').style.gap = '16px';
        
        this.toggleButton.classList.add('active');
        this.isOpen = true;
        this.toggleButton.setAttribute('aria-expanded', 'true');
    }
    
    close() {
        this.nav.style.display = '';
        this.nav.style.position = '';
        this.nav.style.top = '';
        this.nav.style.left = '';
        this.nav.style.right = '';
        this.nav.style.backgroundColor = '';
        this.nav.style.borderBottom = '';
        this.nav.style.padding = '';
        this.nav.style.boxShadow = '';
        
        this.nav.querySelector('.nav-list').style.flexDirection = '';
        this.nav.querySelector('.nav-list').style.gap = '';
        
        this.toggleButton.classList.remove('active');
        this.isOpen = false;
        this.toggleButton.setAttribute('aria-expanded', 'false');
    }
}

// Counter animation for statistics
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.observer = null;
        this.hasAnimated = false;
        
        this.init();
    }
    
    init() {
        // Create intersection observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateCounters();
                    this.hasAnimated = true;
                    this.observer.disconnect();
                }
            });
        }, {
            threshold: 0.5
        });
        
        // Observe the stats section
        const statsSection = document.querySelector('.stats-grid');
        if (statsSection) {
            this.observer.observe(statsSection);
        }
    }
    
    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = '#FFFFFF';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Form validation (if forms are added later)
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            let isValid = true;
            
            // Reset previous error states
            this.querySelectorAll('.error').forEach(error => {
                error.textContent = '';
            });
            
            // Basic validation examples
            this.querySelectorAll('input[required], textarea[required]').forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    const error = field.parentNode.querySelector('.error') || this.querySelector(`.error[data-field="${field.name}"]`);
                    if (error) {
                        error.textContent = 'Este campo es obligatorio';
                    }
                }
            });
            
            if (isValid) {
                // Handle form submission
                console.log('Form is valid, submitting...');
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel
    const heroSlides = document.querySelectorAll('.carousel-slide');
    const heroDots = document.querySelectorAll('.carousel-dots .dot');
    if (heroSlides.length > 0) {
        new Carousel(document.querySelector('.hero'), heroSlides, heroDots);
    }
    
    // Initialize testimonials carousel
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    if (testimonialSlides.length > 0) {
        new Carousel(document.querySelector('.testimonials-section'), testimonialSlides, testimonialDots, 6000);
    }
    
    // Initialize mobile menu
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    if (mobileToggle && nav) {
        new MobileMenu(mobileToggle, nav);
    }
    
    // Initialize counter animation
    new CounterAnimation();
    
    // Initialize other features
    initSmoothScroll();
    initHeaderScroll();
    initFormValidation();
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// Add loading class to body initially
document.body.classList.add('loading');

// Performance optimization: Lazy load images (if actual images are added)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Call lazy loading initialization
initLazyLoading();