document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GESTION DU LOADER ---
    const loader = document.getElementById('page-loader');
    if (loader) {
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 600);
        });
    }

    // --- 2. MENU BURGER ---
    const burgerBtn = document.getElementById('burgerBtn');
    const nav = document.querySelector('.main-nav');
    const body = document.body;

    if (burgerBtn && nav) {
        const toggleMenu = () => {
            const isOpen = nav.classList.toggle('open');
            burgerBtn.classList.toggle('active');
            body.classList.toggle('menu-open');
            burgerBtn.setAttribute('aria-expanded', isOpen);
        };
        burgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => { if (nav.classList.contains('open')) toggleMenu(); });
        });
    }

    // --- 3. ANIMATION AU SCROLL ---
    const revealElements = document.querySelectorAll('[data-animate]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => revealObserver.observe(el));

// --- 4. PORTFOLIO : VERSION SÉCURISÉE ---
const initPortfolio = () => {
    const projects = document.querySelectorAll('.project');
    
    console.log("Portfolio initialisé :", projects.length, "projets trouvés.");

    projects.forEach(card => {
        const hint = card.querySelector('.project-hint');

        if (hint) {
            // On utilise onclick directement pour éviter les doublons d'écouteurs
            hint.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log("Bouton cliqué pour :", card.querySelector('h3').innerText);

                const isOpen = card.classList.contains('is-tapped');

                // Fermer les autres
                projects.forEach(p => p.classList.remove('is-tapped'));

                // Ouvrir/Fermer l'actuel
                if (!isOpen) {
                    card.classList.add('is-tapped');
                }
            };
        }

        // Fermer en cliquant sur la carte ouverte (sauf sur le lien)
        card.onclick = (e) => {
            if (e.target.tagName === 'A') return;
            if (card.classList.contains('is-tapped')) {
                card.classList.remove('is-tapped');
            }
        };
    });

    // Fermeture si clic à l'extérieur
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.project')) {
            projects.forEach(p => p.classList.remove('is-tapped'));
        }
    });
};

// Lancement au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}

    // --- 5. FORMULAIRE ---
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
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            const email = form.email.value.trim();
            
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Envoi...';

            try {
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
                    showToast('Message envoyé !');
                    form.reset();
                } else { throw new Error(); }
            } catch (err) {
                showToast('Erreur lors de l\'envoi.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});