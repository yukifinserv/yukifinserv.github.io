// Yuki Finserv Website JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initEMICalculator();
    initCallbackModal();
    initSmoothScroll();
    initFormHandlers();
    initAnimations();

    console.log('🚀 Yuki Finserv website loaded successfully!');
});

// Mobile Menu Functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// EMI Calculator Functionality
function initEMICalculator() {
    const loanAmountSlider = document.getElementById('loanAmount');
    const interestRateSlider = document.getElementById('interestRate');
    const tenureSlider = document.getElementById('tenure');

    if (loanAmountSlider && interestRateSlider && tenureSlider) {
        // Initial calculation
        calculateEMI();

        // Add event listeners for real-time updates
        loanAmountSlider.addEventListener('input', calculateEMI);
        interestRateSlider.addEventListener('input', calculateEMI);
        tenureSlider.addEventListener('input', calculateEMI);
    }
}

function calculateEMI() {
    const loanAmount = document.getElementById('loanAmount').value;
    const interestRate = document.getElementById('interestRate').value;
    const tenure = document.getElementById('tenure').value;

    // Update display values
    document.getElementById('loanAmountValue').textContent = formatCurrency(loanAmount);
    document.getElementById('interestRateValue').textContent = interestRate + '%';
    document.getElementById('tenureValue').textContent = tenure + ' years';

    // Calculate EMI using the formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const P = parseFloat(loanAmount);
    const r = parseFloat(interestRate) / 12 / 100; // Monthly interest rate
    const n = parseFloat(tenure) * 12; // Number of months

    let emi = 0;
    if (r > 0) {
        const factor = Math.pow(1 + r, n);
        emi = (P * r * factor) / (factor - 1);
    } else {
        emi = P / n; // Simple division if interest rate is 0
    }

    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    // Update display
    document.getElementById('emiAmount').textContent = formatCurrency(Math.round(emi));
    document.getElementById('totalPayment').textContent = formatCurrency(Math.round(totalPayment));
    document.getElementById('totalInterest').textContent = formatCurrency(Math.round(totalInterest));
}

// Format currency for Indian Rupees
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// Callback Modal Functionality
function initCallbackModal() {
    const modal = document.getElementById('callbackModal');
    const closeBtn = document.querySelector('.close');

    if (modal && closeBtn) {
        // Close modal when clicking X
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Open callback modal
function openCallbackForm() {
    const modal = document.getElementById('callbackModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Smooth Scroll Navigation
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form Handlers
function initFormHandlers() {
    // Main callback form
    const callbackForm = document.getElementById('callbackForm');
    if (callbackForm) {
        callbackForm.addEventListener('submit', handleCallbackSubmission);
    }

    // Modal callback form
    const modalCallbackForm = document.getElementById('modalCallbackForm');
    if (modalCallbackForm) {
        modalCallbackForm.addEventListener('submit', handleModalCallbackSubmission);
    }
}

function handleCallbackSubmission(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        loanType: formData.get('loanType'),
        amount: formData.get('amount'),
        message: formData.get('message')
    };

    // Validate required fields
    if (!data.name || !data.phone || !data.loanType) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Validate phone number (basic validation)
    if (!isValidPhoneNumber(data.phone)) {
        showNotification('Please enter a valid phone number.', 'error');
        return;
    }

    // Simulate form submission
    showNotification('Thank you! We will contact you within 24 hours.', 'success');
    e.target.reset();

    // In a real application, you would send this data to your server
    console.log('Callback request submitted:', data);
}

function handleModalCallbackSubmission(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        loanType: formData.get('loanType')
    };

    // Validate required fields
    if (!data.name || !data.phone || !data.loanType) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Validate phone number
    if (!isValidPhoneNumber(data.phone)) {
        showNotification('Please enter a valid phone number.', 'error');
        return;
    }

    // Close modal and show success message
    document.getElementById('callbackModal').style.display = 'none';
    showNotification('Thank you! We will call you back within 24 hours.', 'success');
    e.target.reset();

    console.log('Modal callback request submitted:', data);
}

// Phone number validation
function isValidPhoneNumber(phone) {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Animation system
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .loan-card, .agent-card, .testimonial-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimization
window.addEventListener('scroll', throttle(function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, 100));

// Error handling
window.addEventListener('error', function(e) {
    console.error('Website error:', e.error);
    // In production, you might want to report this to your error tracking service
});

// Add some custom CSS for animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }

    .header.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
    }

    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            flex-direction: column;
            background: white;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            padding: 1rem;
        }

        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }

        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;
document.head.appendChild(style);

// Export functions for global use
window.openCallbackForm = openCallbackForm;
window.calculateEMI = calculateEMI;