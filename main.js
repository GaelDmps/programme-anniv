// Fonction pour afficher une section spécifique
function showSection(sectionId) {
    // Cacher toutes les sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Retirer la classe active de tous les onglets
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Afficher la section sélectionnée
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Activer l'onglet correspondant
    const activeTab = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Sauvegarder la section active dans le localStorage (si disponible)
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem('activeSection', sectionId);
    }
}

// Fonction pour calculer le budget total
function calculateTotalBudget(participants = 8) {
    // Budget alimentaire et matériel créatif (achat groupé)
    const courses = 195;
    const materielCreatif = 25;
    // Activités payantes par personne
    const activitesParPersonne = 20;
    // Total groupe
    const totalGroupe = courses + materielCreatif + activitesParPersonne * participants;
    // Total par personne
    const totalParPersonne = totalGroupe / participants;
    return { totalGroupe, totalParPersonne };
}

// Fonction pour mettre à jour le budget total affiché
function updateBudgetTotal() {
    const participants = countConfirmedParticipants() || 8;
    const { totalGroupe, totalParPersonne } = calculateTotalBudget(participants);
    const totalElement = document.querySelector('.total-amount');
    if (totalElement) {
        totalElement.textContent = `${totalGroupe.toFixed(2)}€`;
    }
    const perPersonElement = document.querySelector('.total-per-person');
    if (perPersonElement) {
        perPersonElement.textContent = `Soit ${totalParPersonne.toFixed(2)}€ par personne`;
    }
}

// Fonction pour compter les participants confirmés
function countConfirmedParticipants() {
    const confirmedParticipants = document.querySelectorAll('.participant.confirmed');
    return confirmedParticipants.length;
}

// Fonction pour compter les participants en attente
function countPendingParticipants() {
    const pendingParticipants = document.querySelectorAll('.participant.pending');
    return pendingParticipants.length;
}

// Fonction pour créer un résumé des participants
function createParticipantSummary() {
    const confirmed = countConfirmedParticipants();
    const pending = countPendingParticipants();
    const total = confirmed + pending;
    
    return {
        confirmed,
        pending,
        total
    };
}

// Fonction pour afficher des statistiques (optionnel)
function displayStats() {
    const stats = createParticipantSummary();
    const totalBudget = calculateTotalBudget();
    
    console.log(`📊 Statistiques du weekend:
    - Participants confirmés: ${stats.confirmed}
    - Participants en attente: ${stats.pending}
    - Total participants: ${stats.total}
    - Budget par personne: ${totalBudget}€
    - Budget total estimé: ${totalBudget * stats.confirmed}€`);
}

// Fonction pour animer l'apparition des éléments
function animateElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Observer tous les éléments avec animation
    const elementsToAnimate = document.querySelectorAll('.activity-card, .participant, .materiel-category, .course-category, .budget-item');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// Fonction pour gérer le responsive des cartes
function handleResponsiveCards() {
    const cards = document.querySelectorAll('.activity-card, .participant, .materiel-category, .course-category');
    
    function checkWidth() {
        cards.forEach(card => {
            if (window.innerWidth <= 768) {
                card.style.minHeight = 'auto';
            }
        });
    }
    
    window.addEventListener('resize', checkWidth);
    checkWidth(); // Vérifier immédiatement
}

// Fonction pour ajouter des effets de survol dynamiques
function addHoverEffects() {
    const cards = document.querySelectorAll('.activity-card, .participant, .materiel-category, .course-category, .budget-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Fonction pour gérer les liens externes
function handleExternalLinks() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Ajouter une petite animation au clic
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Fonction pour ajouter des raccourcis clavier
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Raccourcis numériques pour changer de section
        if (e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const sections = ['planning', 'participants', 'materiel', 'courses', 'budget'];
            const sectionIndex = parseInt(e.key) - 1;
            if (sections[sectionIndex]) {
                showSection(sections[sectionIndex]);
            }
        }
        
        // Flèches gauche/droite pour naviguer
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            const sections = ['planning', 'participants', 'materiel', 'courses', 'budget'];
            const currentSection = document.querySelector('.section.active').id;
            const currentIndex = sections.indexOf(currentSection);
            
            let newIndex;
            if (e.key === 'ArrowLeft') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
            } else {
                newIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
            }
            
            showSection(sections[newIndex]);
        }
    });
}

// Fonction pour ajouter un effet de particules (optionnel)
function addParticleEffect() {
    const header = document.querySelector('header');
    if (!header) return;
    
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.backgroundColor = '#FFFF00';
        particle.style.borderRadius = '50%';
        particle.style.opacity = '0.7';
        particle.style.animation = `float ${3 + Math.random() * 2}s ease-in-out infinite`;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        header.appendChild(particle);
    }
}

// Fonction d'initialisation principale
function init() {
    console.log('🌴 Weekend Corp - Initialisation...');
    
    // Vérifier si on a une section sauvegardée
    if (typeof(Storage) !== "undefined") {
        const savedSection = localStorage.getItem('activeSection');
        if (savedSection) {
            showSection(savedSection);
        }
    }
    
    // Mettre à jour le budget total
    updateBudgetTotal();
    
    // Afficher les statistiques dans la console
    displayStats();
    
    // Ajouter les animations
    setTimeout(() => {
        animateElements();
        handleResponsiveCards();
        addHoverEffects();
        handleExternalLinks();
        addKeyboardShortcuts();
        addParticleEffect();
    }, 100);
    
    console.log('✅ Initialisation terminée!');
    console.log('💡 Astuce: Utilisez les touches 1-5 pour naviguer entre les sections');
    console.log('💡 Astuce: Utilisez les flèches gauche/droite pour naviguer');
}

// Ajouter l'animation CSS pour les particules
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    header {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}