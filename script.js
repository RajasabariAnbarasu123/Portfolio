// ========================================
// PROFESSIONAL PORTFOLIO SCRIPT
// Enhanced with Modern Features
// ========================================

// DOM Elements
const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const mobileToggle = document.querySelector('.mobile-toggle');
const nav = document.querySelector('.nav');
const navMenu = document.querySelector('.nav-menu');
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('section');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');
const resumeDownload = document.getElementById('resumeDownload');
const roadmapItems = document.querySelectorAll('.roadmap-item');
const newsletterForm = document.querySelector('.newsletter-form');

// Initialize Theme
function initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Update Theme Icon
function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Theme Toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Smooth transition
    body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        body.style.transition = '';
    }, 300);
    
    // Show toast notification
    showToast(`Switched to ${newTheme} mode`, 'info');
});

// Mobile Menu Toggle
mobileToggle.addEventListener('click', () => {
    const isActive = mobileToggle.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
});

// Close mobile menu when clicking on links
navItems.forEach(item => {
    item.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Active Navigation on Scroll
function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href').substring(1);
        if (href === currentSection) {
            item.classList.add('active');
        }
    });
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (nav.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            const offset = 80;
            const targetPosition = targetElement.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL
            history.pushState(null, null, href);
            
            // Update active nav
            updateActiveNav();
        }
    });
});

// Career Journey Scroll Animation
function animateRoadmap() {
    roadmapItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * 0.85) {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 200);
        }
    });
}

// Resume Download Enhancement
if (resumeDownload) {
    resumeDownload.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Check if user is on a mobile device
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        // Show download animation
        this.classList.add('downloading');
        
        // Show toast notification
        showToast('Preparing your resume download...', 'info');
        
        try {
            // Simulate download delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // For demo purposes, we'll simulate the download
            // In production, replace with actual resume file
            if (isMobile) {
                // Open in new tab for mobile
                window.open('resume.pdf', '_blank');
                showToast('Resume opened in new tab', 'success');
            } else {
                // Create download link for desktop
                const link = document.createElement('a');
                link.href = 'resume.pdf';
                link.download = 'Rajasabari_Anbarasu_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showToast('Resume download started!', 'success');
            }
            
            // Add to download analytics (simulated)
            console.log('Resume downloaded at:', new Date().toISOString());
            
        } catch (error) {
            showToast('Failed to download resume. Please try again.', 'error');
            console.error('Resume download error:', error);
        } finally {
            // Remove animation
            setTimeout(() => {
                this.classList.remove('downloading');
            }, 1000);
        }
    });
}

// Enhanced Contact Form with Google Forms Integration
if (contactForm) {
    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showToast('Please correct the errors in the form.', 'error');
            return;
        }
        
        // Get form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Submit to Google Forms
            const submitted = await submitToGoogleForms(name, email, message);
            
            if (submitted) {
                // Show success message
                formSuccess.classList.add('show');
                
                // Reset form
                contactForm.reset();
                
                // Remove success message after delay
                setTimeout(() => {
                    formSuccess.classList.remove('show');
                }, 5000);
                
                // Show toast notification
                showToast('Message sent successfully! I\'ll respond within 24 hours.', 'success');
                
                // Add confetti effect
                createConfetti();
            } else {
                throw new Error('Form submission failed');
            }
            
        } catch (error) {
            console.error('Contact form error:', error);
            showToast('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// Submit to Google Forms
async function submitToGoogleForms(name, email, message) {
    return new Promise((resolve, reject) => {
        // Create form data
        const formData = new FormData();
        
        // Google Form entry IDs from your form
        formData.append("entry.1932833535", name);    // Name field
        formData.append("entry.434297466", email);    // Email field
        formData.append("entry.140618251", message);  // Message field
        
        // Add timestamp
        const timestamp = new Date().toLocaleString();
        formData.append("entry.000000000", timestamp); // Add timestamp if you have a field for it
        
        // Submit to Google Forms
        fetch(
            "https://docs.google.com/forms/d/e/1FAIpQLSf55xYmSfIEV8j7UlQW7nonnFFWiqums872umPQjzE1K5VsOQ/formResponse",
            {
                method: "POST",
                body: formData,
                mode: "no-cors" // Important for cross-origin requests
            }
        )
        .then(() => {
            // Since it's no-cors, we can't check the response
            // But we assume it's successful if no network error
            console.log('Form submitted to Google Forms successfully');
            resolve(true);
        })
        .catch((error) => {
            console.error('Google Forms submission error:', error);
            reject(error);
        });
    });
}

// Field validation function
function validateField(field) {
    const errorElement = field.parentElement.querySelector('.form-error');
    const parent = field.parentElement;
    
    // Clear previous error
    parent.classList.remove('error');
    errorElement.textContent = '';
    
    // Check required fields
    if (field.required && !field.value.trim()) {
        parent.classList.add('error');
        errorElement.textContent = 'This field is required';
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            parent.classList.add('error');
            errorElement.textContent = 'Please enter a valid email address';
            return false;
        }
    }
    
    // Message validation
    if (field.name === 'message' && field.value.trim()) {
        if (field.value.trim().length < 10) {
            parent.classList.add('error');
            errorElement.textContent = 'Message should be at least 10 characters';
            return false;
        }
        
        if (field.value.trim().length > 2000) {
            parent.classList.add('error');
            errorElement.textContent = 'Message is too long (max 2000 characters)';
            return false;
        }
    }
    
    return true;
}

// Newsletter Form
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const submitBtn = this.querySelector('button');
        
        if (!emailInput.value.trim()) {
            showToast('Please enter your email address', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success
            showToast('Successfully subscribed to newsletter!', 'success');
            emailInput.value = '';
            
        } catch (error) {
            showToast('Failed to subscribe. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Toast Notification System
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(toast);
    
    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });
    
    // Show toast with animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// Confetti Effect
function createConfetti() {
    const colors = ['#2563EB', '#7C3AED', '#EC4899', '#10B981', '#F59E0B'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-particle';
        
        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = Math.random() > 0.5 ? '50%' : '2px';
        const left = Math.random() * 100;
        const duration = 1500 + Math.random() * 1500;
        
        confetti.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: ${shape};
            top: -20px;
            left: ${left}vw;
            z-index: 9999;
            pointer-events: none;
            opacity: 0.8;
            transform-origin: center;
        `;
        
        document.body.appendChild(confetti);
        
        // Random animation
        const animation = confetti.animate([
            {
                transform: 'translateY(0) rotate(0deg)',
                opacity: 0.8
            },
            {
                transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close toast with Escape
    if (e.key === 'Escape') {
        const toast = document.querySelector('.toast-notification.show');
        if (toast) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateActiveNav();
    animateRoadmap();
    
    // Add scroll listeners
    window.addEventListener('scroll', () => {
        updateActiveNav();
        animateRoadmap();
    });
    
    // Add toast styles dynamically
    addToastStyles();
    
    // Initialize form
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            if (input.value.trim()) {
                validateField(input);
            }
        });
    }
    
    // Add animations to elements on scroll
    initScrollAnimations();
    
    // Add form submission analytics
    initFormAnalytics();
});

// Add form submission analytics
function initFormAnalytics() {
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        
        nameInput.addEventListener('focus', () => {
            console.log('User started filling contact form - Name field');
        });
        
        emailInput.addEventListener('focus', () => {
            console.log('User started filling contact form - Email field');
        });
    }
}

// Add toast styles dynamically
function addToastStyles() {
    const toastStyles = document.createElement('style');
    toastStyles.textContent = `
        .toast-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--light);
            border: 1px solid var(--gray-200);
            border-left: 4px solid var(--gray-400);
            border-radius: var(--radius);
            padding: var(--space-md) var(--space-lg);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--space-md);
            box-shadow: var(--shadow-xl);
            transform: translateX(150%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 99999;
            max-width: 400px;
            min-width: 300px;
        }
        
        .toast-notification.show {
            transform: translateX(0);
        }
        
        .toast-notification.success {
            border-left-color: var(--success);
        }
        
        .toast-notification.error {
            border-left-color: var(--error);
        }
        
        .toast-notification.info {
            border-left-color: var(--primary);
        }
        
        .toast-notification.warning {
            border-left-color: var(--warning);
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
        }
        
        .toast-content i {
            font-size: 1.2rem;
        }
        
        .toast-notification.success .toast-content i {
            color: var(--success);
        }
        
        .toast-notification.error .toast-content i {
            color: var(--error);
        }
        
        .toast-notification.info .toast-content i {
            color: var(--primary);
        }
        
        .toast-notification.warning .toast-content i {
            color: var(--warning);
        }
        
        .toast-content span {
            color: var(--dark);
            font-size: 0.95rem;
            line-height: 1.4;
        }
        
        .toast-close {
            background: none;
            border: none;
            color: var(--gray-400);
            cursor: pointer;
            padding: var(--space-xs);
            border-radius: var(--radius-sm);
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .toast-close:hover {
            color: var(--dark);
            background: var(--gray-100);
        }
        
        .confetti-particle {
            animation: confettiFall linear forwards;
        }
        
        @keyframes confettiFall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(150%);
            }
            to {
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(toastStyles);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe cards for animations
    const cards = document.querySelectorAll('.expertise-card, .project-card, .achievement-card, .experience-card, .info-card');
    cards.forEach(card => observer.observe(card));
}

// Performance optimization for scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        updateActiveNav();
        animateRoadmap();
    }, 50);
});

// Add intersection observer for better performance
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, {
    threshold: 0.1
});

// Observe sections for animations
sections.forEach(section => sectionObserver.observe(section));

// Form backup - Local storage fallback
function saveFormToLocalStorage(name, email, message) {
    const formData = {
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toISOString(),
        submitted: false // Mark as not submitted yet
    };
    
    // Save to localStorage
    const savedForms = JSON.parse(localStorage.getItem('contactForms') || '[]');
    savedForms.push(formData);
    localStorage.setItem('contactForms', JSON.stringify(savedForms));
    
    console.log('Form data saved to localStorage as backup');
    return true;
}

// Retry failed submissions
function retryFailedSubmissions() {
    const savedForms = JSON.parse(localStorage.getItem('contactForms') || '[]');
    const failedForms = savedForms.filter(form => !form.submitted);
    
    if (failedForms.length > 0) {
        console.log(`Found ${failedForms.length} failed form submissions to retry`);
        // You could implement a retry mechanism here
    }
}

// Check for failed submissions on page load
retryFailedSubmissions();