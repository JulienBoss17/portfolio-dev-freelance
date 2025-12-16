document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GESTION DU LOADER ---
    const loader = document.getElementById('page-loader');
    if (loader) {
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 600);
        });
    }

    // --- 2. MENU BURGER & RESPONSIVE ---
    const burgerBtn = document.getElementById('burgerBtn');
    const nav = document.querySelector('.main-nav');
    const body = document.body;

    if (burgerBtn && nav) {
        const toggleMenu = () => {
            const isOpen = nav.classList.toggle('open');
            burgerBtn.classList.toggle('active');
            body.classList.toggle('menu-open'); // Bloque le scroll
            burgerBtn.setAttribute('aria-expanded', isOpen);
        };

        burgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Fermer le menu si on clique sur un lien ou à l'extérieur
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('open')) toggleMenu();
            });
        });
    }

    // --- 3. ANIMATION AU SCROLL (Intersection Observer) ---
    const revealElements = document.querySelectorAll('[data-animate]');
    const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. GESTION DU FORMULAIRE & TOASTS ---
    const showToast = (message, type = 'success') => {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    };

    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validation simple
            const email = form.email.value.trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showToast('Email invalide', 'error');
                return;
            }

            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Envoi en cours...';

            try {
                // Remplacer l'URL par ton vrai endpoint de production plus tard
                const response = await fetch('https://portfolio.jubdev.fr/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        firstName: form.firstName.value,
                        lastName: form.lastName.value,
                        email: email,
                        message: form.message.value
                    })
                });

                if (response.ok) {
                    showToast('Message envoyé !', 'success');
                    form.reset();
                } else {
                    throw new Error();
                }
            } catch (err) {
                showToast('Erreur lors de l\'envoi.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});

document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('click', function() {
        // Enlève la classe active des autres cartes
        document.querySelectorAll('.project').forEach(c => {
            if (c !== card) c.classList.remove('is-tapped');
        });
        // Toggle la carte actuelle
        this.classList.toggle('is-tapped');
    });
});