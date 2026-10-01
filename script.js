/* ================= Page Loader ================= */

const pageLoader = document.getElementById('page-loader');

function hideLoader() {
    if (!pageLoader) return;
    pageLoader.classList.add('hidden');
}

window.addEventListener('load', hideLoader);

/* Safety fallback: never let the loader get stuck if the 'load' event fails to fire */
setTimeout(hideLoader, 5000);

/* ================= Sidebar mobile navigation ================= */

const burger = document.getElementById('burger');
const navOverlay = document.getElementById('navigation-panel');
const navBackdrop = document.getElementById('nav-backdrop');
const navClose = document.getElementById('navClose');
const menuLinks = document.querySelectorAll('.menu a');

function openNav() {
    if (!navOverlay) return;
    navOverlay.classList.add('open');
    navOverlay.setAttribute('aria-hidden', 'false');
    if (burger) {
        burger.setAttribute('aria-expanded', 'true');
    }
    if (navBackdrop) {
        navBackdrop.classList.add('open');
        navBackdrop.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
}

function closeNav() {
    if (!navOverlay) return;
    navOverlay.classList.remove('open');
    navOverlay.setAttribute('aria-hidden', 'true');
    if (burger) {
        burger.setAttribute('aria-expanded', 'false');
    }
    if (navBackdrop) {
        navBackdrop.classList.remove('open');
        navBackdrop.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
}

/* Open the sidebar from the burger icon */
if (burger) {
    burger.addEventListener('click', openNav);
}

/* Close via the ✕ button */
if (navClose) {
    navClose.addEventListener('click', closeNav);
}

/* Close when clicking the backdrop */
if (navBackdrop) {
    navBackdrop.addEventListener('click', closeNav);
}

/* Close after clicking any navigation link */
menuLinks.forEach(link => {
    link.addEventListener('click', closeNav);
});

/* Close with the Escape key */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navOverlay && navOverlay.classList.contains('open')) {
        closeNav();
    }
});

/* ================= Header & Sidebar search bar ================= */

const headerSearchInput = document.getElementById('header-search-input');
const sidebarSearchInput = document.getElementById('sidebar-search-input');

/* Press '/' to focus the search field (matches the kbd hint shown in the bar) */
document.addEventListener('keydown', (e) => {
    /* Ignore when typing inside another input/textarea or using a modifier */
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === '/') {
        e.preventDefault();

        // If sidebar is open and has a search input, focus it
        if (navOverlay && navOverlay.classList.contains('open') && sidebarSearchInput) {
            sidebarSearchInput.focus();
            sidebarSearchInput.select();
        }
        // Otherwise focus header search
        else if (headerSearchInput) {
            headerSearchInput.focus();
            headerSearchInput.select();
        }
    }
});

/* Escape clears the field and blurs it */
[headerSearchInput, sidebarSearchInput].forEach(input => {
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                input.value = '';
                input.blur();
            }
        });
    }
});

/* Sidebar search form: prevent page reload on submit (search is decorative for now) */
const sidebarSearchForm = document.getElementById('sidebar-search-form');
if (sidebarSearchForm) {
    sidebarSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
    });
}

/* ================= Dark / Light Theme Toggle ================= */

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const root = document.documentElement;

/* Load saved theme preference or default to dark */
const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
    });
}

function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

/* ================= Scroll Progress Bar ================= */

const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

/* ================= Navbar scroll effect (shrink on scroll) ================= */

const header = document.querySelector('.header');
let lastScrollY = 0;

function handleNavScroll() {
    const currentScrollY = window.scrollY;

    if (header) {
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

/* ================= Active nav link on scroll ================= */

const navLinks = document.querySelectorAll('.nav-link, .menu a');
const sections = document.querySelectorAll('section[id], footer[id]');
let isClickScrolling = false;
let scrollTimeout = null;

function highlightActiveNav() {
    if (isClickScrolling) return;

    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightActiveNav, { passive: true });

/* ================= Scroll Reveal Animations (IntersectionObserver) ================= */

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ================= Hero entrance animations ================= */

const heroAnimateElements = document.querySelectorAll('.hero-animate');

/* Trigger hero animations shortly after load (after loader hides) */
function triggerHeroAnimations() {
    heroAnimateElements.forEach(el => {
        const delay = el.getAttribute('data-delay') || 0;
        setTimeout(() => {
            el.classList.add('visible');
        }, parseInt(delay, 10));
    });
}

/* Small delay so it starts as the loader fades out */
setTimeout(triggerHeroAnimations, 300);

/* ================= Hero parallax (mouse + scroll) ================= */

const hero = document.querySelector('.hero');
const shapes = document.querySelectorAll('.shape');
const dots = document.querySelector('.dots');
const heroImageWrap = document.querySelector('.hero-right');
const heroImage = document.querySelector('.hero-right img');

if (hero && window.matchMedia('(min-width: 769px)').matches) {
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xPercent = (clientX / innerWidth) - 0.5;
        const yPercent = (clientY / innerHeight) - 0.5;

        shapes.forEach((shape, index) => {
            const depth = (index + 1) * 20;
            shape.style.transform = `rotate(45deg) translate(${xPercent * depth}px, ${yPercent * depth}px)`;
        });

        if (dots) {
            dots.style.transform = `translate(${xPercent * 25}px, ${yPercent * 25}px)`;
        }

        if (heroImageWrap) {
            heroImageWrap.style.transform = `translate(${xPercent * -15}px, ${yPercent * -15}px)`;
        }
    });
}

/* Subtle scroll parallax for hero shapes */
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight && hero) {
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.15;
            const currentTransform = shape.style.transform;
            /* Avoid overwriting the mouse-move transform; only apply when not hovering */
        });
        if (heroImage && scrollY < 600) {
            heroImage.style.opacity = Math.max(0, 1 - scrollY / 600);
        }
    }
}, { passive: true });

/* ================= Back to Top button ================= */

const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
    if (!backToTopBtn) return;
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
}

window.addEventListener('scroll', toggleBackToTop, { passive: true });

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ================= Smooth scroll for nav links ================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();

            isClickScrolling = true;

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === href) {
                    link.classList.add('active');
                }
            });

            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isClickScrolling = false;
            }, 1000);
        }
    });
});

/* ================= Contact form validation ================= */

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formStatusText = document.getElementById('formStatusText');
const formStatusIcon = document.getElementById('formStatusIcon');
const contactSubmit = document.getElementById('contactSubmit');
const contactSubmitText = document.getElementById('contactSubmitText');
let isContactSubmitting = false;

function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (input) input.classList.add('invalid');
    if (input) input.setAttribute('aria-invalid', 'true');
    if (errorEl) errorEl.textContent = message;
}

function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (input) input.classList.remove('invalid');
    if (input) input.setAttribute('aria-invalid', 'false');
    if (errorEl) errorEl.textContent = '';
}

function setContactSubmitting(isSubmitting) {
    isContactSubmitting = isSubmitting;
    if (contactSubmit) {
        contactSubmit.disabled = isSubmitting;
        contactSubmit.setAttribute('aria-disabled', String(isSubmitting));
    }
    if (contactSubmitText) {
        contactSubmitText.textContent = isSubmitting ? t('contact.sending') : t('contact.send');
    }
    if (contactForm) {
        contactForm.setAttribute('aria-busy', String(isSubmitting));
    }
}

function showFormStatus(type, messageKey) {
    if (!formSuccess) return;
    formSuccess.classList.toggle('error', type === 'error');
    formSuccess.classList.add('show');
    if (formStatusIcon) {
        formStatusIcon.className = type === 'error'
            ? 'fa-solid fa-circle-exclamation'
            : 'fa-solid fa-circle-check';
    }
    if (formStatusText) {
        formStatusText.textContent = t(messageKey);
    }
}

function hideFormStatus() {
    if (!formSuccess) return;
    formSuccess.classList.remove('show', 'error');
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (isContactSubmitting) return;

        let isValid = true;
        hideFormStatus();

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        const honeypotInput = document.getElementById('company');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const subject = subjectInput ? subjectInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';
        const company = honeypotInput ? honeypotInput.value.trim() : '';

        /* Name validation */
        if (name.length < 2) {
            showError('name', 'nameError', t('contact.nameRequired'));
            isValid = false;
        } else {
            clearError('name', 'nameError');
        }

        /* Email validation */
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('email', 'emailError', t('contact.emailInvalid'));
            isValid = false;
        } else {
            clearError('email', 'emailError');
        }

        /* Message validation */
        if (message.length < 10) {
            showError('message', 'messageError', t('contact.msgTooShort'));
            isValid = false;
        } else {
            clearError('message', 'messageError');
        }

        if (!isValid) return;

        setContactSubmitting(true);

        // Simulate a network request delay, then show a fake success message
        setTimeout(() => {
            showFormStatus('success', 'contact.success');
            contactForm.reset();
            setTimeout(hideFormStatus, 4000);
            setContactSubmitting(false);
        }, 1500);
    });

    /* Real-time clearing of errors as the user types */
    ['name', 'email', 'subject', 'message'].forEach(field => {
        const el = document.getElementById(field);
        if (el) {
            el.addEventListener('input', () => {
                clearError(field, field + 'Error');
                hideFormStatus();
            });
        }
    });
}

/* ================= Animate stats / counters on scroll (optional flourish) ================= */
/* Currently no counters in the layout, but the hook is here for future use */

/* ================= Tilt effect on service cards ================= */

const tiltCards = document.querySelectorAll('.service-card, .project-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (window.matchMedia('(max-width: 768px)').matches) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ================= Star Background Generator ================= */
function generateStars(n) {
    let value = `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
    for (let i = 2; i <= n; i++) {
        value += `, ${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
    }
    return value;
}

const starsContainer = document.getElementById('stars-container');
if (starsContainer) {
    const shadows1 = generateStars(700);
    const shadows2 = generateStars(250);
    const shadows3 = generateStars(100);
    const style = document.createElement('style');
    style.innerHTML = `
        #stars { width: 1px; height: 1px; background: transparent; box-shadow: ${shadows1}; animation: animStar 150s linear infinite; }
        #stars:after { content: " "; position: absolute; top: 2000px; width: 1px; height: 1px; background: transparent; box-shadow: ${shadows1}; }
        #stars2 { width: 2px; height: 2px; background: transparent; box-shadow: ${shadows2}; animation: animStar 200s linear infinite; }
        #stars2:after { content: " "; position: absolute; top: 2000px; width: 2px; height: 2px; background: transparent; box-shadow: ${shadows2}; }
        #stars3 { width: 3px; height: 3px; background: transparent; box-shadow: ${shadows3}; animation: animStar 250s linear infinite; }
        #stars3:after { content: " "; position: absolute; top: 2000px; width: 3px; height: 3px; background: transparent; box-shadow: ${shadows3}; }
        
        @keyframes animStar {
            from { transform: translateY(0px); }
            to { transform: translateY(-2000px); }
        }
    `;
    document.head.appendChild(style);
}

/* ================= Language Switch (EN / KU) ================= */
/* Handled by i18n.js (translations dictionary + applyLanguage engine). */
