// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
});

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Error handling
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) errorElement.textContent = message;
}
function clearError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) errorElement.textContent = '';
}
function clearAllErrors() {
    ['firstName','lastName','email'].forEach(clearError);
}

// Form validation
function validateForm(formData) {
    let isValid = true;
    clearAllErrors();

    if (!formData.firstName.trim()) { showError('firstName','Le prénom est obligatoire'); isValid=false; }
    if (!formData.lastName.trim()) { showError('lastName','Le nom est obligatoire'); isValid=false; }
    if (!formData.email.trim()) { showError('email','L\'email est obligatoire'); isValid=false; }
    else if (!validateEmail(formData.email)) { showError('email','Adresse email invalide'); isValid=false; }

    return isValid;
}

// Toast notifications
function showToast(message, type='success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { if(toast.parentNode) toast.parentNode.removeChild(toast); }, 5000);
}

// Form submission
async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';

    const formData = {
        firstName: form.firstName.value.trim(),
        lastName: form.lastName.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim()
    };

    if(!validateForm(formData)) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer ma demande';
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/api/contact', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(formData)
        });
        if(!response.ok) throw new Error('Erreur serveur');
        showToast('Votre message a été envoyé avec succès !','success');
        form.reset();
    } catch(e) {
        console.error(e);
        showToast('Erreur lors de l\'envoi. Veuillez réessayer.','error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer ma demande';
    }
}

// Smooth scroll for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click', function(e){
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
});

// Real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if(!form) return;
    form.querySelectorAll('input,textarea').forEach(input=>{
        input.addEventListener('input', function(){ clearError(this.name); });
    });
});
