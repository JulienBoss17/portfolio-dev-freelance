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
    const projectsTrack = document.querySelector('.projects');
    const prevBtn = document.querySelector('.project-nav.prev');
    const nextBtn = document.querySelector('.project-nav.next');
    const projects = document.querySelectorAll('.project');

    if (projectsTrack) {
        projectsTrack.querySelectorAll('img').forEach(img => img.setAttribute('draggable', 'false'));
    }

    const getStepSize = () => {
        if (!projectsTrack || projects.length === 0) return 0;
        const firstCard = projects[0];
        const styles = window.getComputedStyle(projectsTrack);
        const gap = parseFloat(styles.gap) || 0;
        return firstCard.getBoundingClientRect().width + gap;
    };

    const updateNavState = () => {
        if (!projectsTrack || !prevBtn || !nextBtn) return;
        const maxScrollLeft = projectsTrack.scrollWidth - projectsTrack.clientWidth;
        prevBtn.disabled = projectsTrack.scrollLeft <= 4;
        nextBtn.disabled = projectsTrack.scrollLeft >= maxScrollLeft - 4;
    };

    if (projectsTrack && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            projectsTrack.scrollBy({ left: -getStepSize(), behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            projectsTrack.scrollBy({ left: getStepSize(), behavior: 'smooth' });
        });

        projectsTrack.addEventListener('scroll', updateNavState, { passive: true });
        window.addEventListener('resize', updateNavState);
        updateNavState();
    }

    projects.forEach(card => {
        const handleInteraction = (e) => {
            if (e.target.tagName === 'A') return;

            const isOpen = card.classList.contains('is-tapped');
            projects.forEach(p => p.classList.remove('is-tapped'));

            if (!isOpen) {
                card.classList.add('is-tapped');
            } else {
                card.classList.remove('is-tapped');
            }
        };

        card.addEventListener('click', handleInteraction);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.project')) {
            projects.forEach(p => p.classList.remove('is-tapped'));
        }
    });
};

initPortfolio();

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

document.addEventListener('DOMContentLoaded', () => {
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    const buttons = card.querySelectorAll('.switcher-btn');
    const contents = card.querySelectorAll('.pack-content');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');

        // 1. Retirer la classe active des boutons de cette carte
        buttons.forEach(b => b.classList.remove('active'));
        // 2. Retirer la classe active des contenus de cette carte
        contents.forEach(c => c.classList.remove('active'));

        // 3. Activer le bon bouton et le bon contenu
        btn.classList.add('active');
        card.querySelector(`.pack-content#${target}`).classList.add('active');
      });
    });
  });
});
