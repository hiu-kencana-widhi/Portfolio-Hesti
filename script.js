/**
 * Hesti S.E. - Portfolio Website Script
 * Handling interactive features: Theme toggling, mobile nav, scrollspy, certificate modal, image lightbox, & form validation.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. THEME TOGGLING (DARK / LIGHT MODE)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check local storage for theme, default to 'light' on first access
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }

    // Toggle click event
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        // Save choice to local storage
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    /* ==========================================================================
       2. MOBILE MENU NAVIGATION
       ========================================================================== */
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu
    function toggleMobileMenu() {
        const isOpen = navLinksContainer.classList.contains('active');
        mobileMenuToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', !isOpen);
    }

    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Close menu when clicking outside navbar area on mobile
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && navLinksContainer.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    /* ==========================================================================
       3. ACTIVE SCROLL NAVIGATION (SCROLLSPY)
       ========================================================================== */
    const sections = document.querySelectorAll('section, header.hero-section');
    
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the middle view
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    /* ==========================================================================
       4. CERTIFICATE MODAL (PDF VIEW)
       ========================================================================== */
    const certCards = document.querySelectorAll('.cert-card');
    const certModal = document.getElementById('cert-modal');
    const certModalClose = document.getElementById('cert-modal-close');
    const certModalTitle = document.getElementById('cert-modal-title');
    const pdfViewer = document.getElementById('pdf-viewer');
    const pdfFallback = document.getElementById('pdf-fallback');
    const pdfDownloadLink = document.getElementById('pdf-download-link');

    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const pdfFile = card.getAttribute('data-pdf');
            const title = card.querySelector('.cert-title').textContent;
            
            // Set Modal Details
            certModalTitle.textContent = title;
            pdfDownloadLink.setAttribute('href', pdfFile);

            // Open Modal
            certModal.classList.add('active');
            certModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Stop background scrolling

            // On mobile devices, PDF rendering inside iframes is unreliable.
            // Direct download link works better on touch interfaces.
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            
            if (isTouchDevice) {
                pdfViewer.style.display = 'none';
                pdfFallback.style.display = 'flex';
            } else {
                pdfViewer.style.display = 'block';
                pdfFallback.style.display = 'none';
                pdfViewer.setAttribute('src', pdfFile);
            }
        });
    });

    // Close function
    function closeCertModal() {
        certModal.classList.remove('active');
        certModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        setTimeout(() => {
            pdfViewer.setAttribute('src', ''); // Clear iframe src
        }, 300);
    }

    certModalClose.addEventListener('click', closeCertModal);
    
    // Close on overlay click
    certModal.addEventListener('click', (e) => {
        if (e.target === certModal) {
            closeCertModal();
        }
    });

    /* ==========================================================================
       5. GALLERY LIGHTBOX POPUP
       ========================================================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentImageIndex = 0;
    const imagesData = [];

    // Pre-parse gallery items data
    galleryItems.forEach((item, index) => {
        imagesData.push({
            src: item.getAttribute('data-src'),
            caption: item.getAttribute('data-caption')
        });

        // Open Lightbox on item click
        item.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox(currentImageIndex);
        });
    });

    function openLightbox(index) {
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        updateLightboxContent(index);
    }

    function updateLightboxContent(index) {
        const item = imagesData[index];
        lightboxImg.setAttribute('src', item.src);
        lightboxCaption.textContent = item.caption;
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % imagesData.length;
        updateLightboxContent(currentImageIndex);
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + imagesData.length) % imagesData.length;
        updateLightboxContent(currentImageIndex);
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard support (Escape, Left/Right arrows)
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
        if (certModal.classList.contains('active')) {
            if (e.key === 'Escape') closeCertModal();
        }
    });

    /* ==========================================================================
       6. CONTACT FORM VALIDATION & SIMULATION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');
    const submitBtn = document.getElementById('btn-submit');
    const submitSpinner = document.getElementById('submit-spinner');
    const submitIcon = document.getElementById('submit-icon');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // Email verification regex
    function isValidEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    // Input validation checker
    function checkInput(input, errorElementId, validatorFn = null) {
        const formGroup = input.parentElement;
        let isValid = true;

        if (input.value.trim() === '') {
            isValid = false;
        } else if (validatorFn && !validatorFn(input.value.trim())) {
            isValid = false;
        }

        if (!isValid) {
            formGroup.classList.add('invalid');
        } else {
            formGroup.classList.remove('invalid');
        }

        return isValid;
    }

    // Dynamic field validation on input
    nameInput.addEventListener('input', () => checkInput(nameInput, 'name-error'));
    emailInput.addEventListener('input', () => checkInput(emailInput, 'email-error', isValidEmail));
    subjectInput.addEventListener('input', () => checkInput(subjectInput, 'subject-error'));
    messageInput.addEventListener('input', () => checkInput(messageInput, 'message-error'));

    // Handle form submit
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Check all fields
        const isNameValid = checkInput(nameInput, 'name-error');
        const isEmailValid = checkInput(emailInput, 'email-error', isValidEmail);
        const isSubjectValid = checkInput(subjectInput, 'subject-error');
        const isMessageValid = checkInput(messageInput, 'message-error');

        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            // Disable button, show loading spinner
            submitBtn.disabled = true;
            submitSpinner.classList.remove('hidden');
            submitIcon.style.display = 'none';

            // Simulate server request delay
            setTimeout(() => {
                // Reset states
                submitBtn.disabled = false;
                submitSpinner.classList.add('hidden');
                submitIcon.style.display = '';

                // Show success toast
                toastMessage.textContent = 'Pesan Anda berhasil dikirim! Terima kasih.';
                toast.classList.add('active');

                // Reset Form
                contactForm.reset();

                // Hide Toast after 4 seconds
                setTimeout(() => {
                    toast.classList.remove('active');
                }, 4000);

            }, 1500);
        }
    });
});
