// ===== CONFIGURATION =====
const CONFIG = {
    scrollOffset: 100,
    animationDelay: 100,
    hoverIntensity: 1.2
};

// Determine base URL for GitHub Pages
const getBaseUrl = () => {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    if (hostname.endsWith('github.io') && pathname !== '/') {
        // For project pages like username.github.io/repo-name/
        const repoName = pathname.split('/')[1];
        return `/${repoName}`;
    }
    // For custom domains or root deployments (username.github.io/)
    return '';
};

const BASE_URL = getBaseUrl();

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    adjustHrefsForGitHubPages(); // Call this first to adjust all links
    initializeNavigation();
    initializeScrollEffects();
    initializeHoverEffects();
    initializeIntersectionObserver();
    initializeSmoothScrolling();
    initializeSvtLevels();
    initializeTabbedInterfaces();
    initializeExercises();
    initializeSideMenu();
    initializeVisionCarousel();
    initializeContactForm();
    initializeSmartNavigation();
});

// ===== SVT LEVELS =====
function initializeSvtLevels() {
    const collegeCard = document.getElementById('college-card');
    const lyceeCard = document.getElementById('lycee-card');
    const collegeGrid = document.getElementById('college-levels-grid');
    const lyceeGrid = document.getElementById('lycee-levels-grid');

    if (collegeCard && lyceeCard && collegeGrid && lyceeGrid) {
        collegeCard.addEventListener('click', () => {
            collegeGrid.style.display = 'grid';
            lyceeGrid.style.display = 'none';
            collegeCard.classList.add('active');
            lyceeCard.classList.remove('active');
        });

        lyceeCard.addEventListener('click', () => {
            lyceeGrid.style.display = 'grid';
            collegeGrid.style.display = 'none';
            lyceeCard.classList.add('active');
            collegeCard.classList.remove('active');
        });
    }
}

// ===== TABBED INTERFACES =====
function initializeTabbedInterfaces() {
    const allNavTabs = document.querySelectorAll('.nav-tabs');

    allNavTabs.forEach(navTab => {
        const tabs = navTab.querySelectorAll('.nav-link');
        const tabContent = navTab.nextElementSibling;

        if (!tabContent || !tabContent.classList.contains('tab-content')) {
            return; 
        }
        const panes = tabContent.querySelectorAll('.tab-pane');

        tabs.forEach(tab => {
            tab.addEventListener('click', function(event) {
                event.preventDefault();

                tabs.forEach(t => t.classList.remove('active'));
                panes.forEach(p => {
                    p.classList.remove('active', 'show');
                });

                this.classList.add('active');

                const targetPaneId = this.getAttribute('data-bs-target');
                const targetPane = tabContent.querySelector(targetPaneId);
                if (targetPane) {
                    targetPane.classList.add('active');
                    setTimeout(() => {
                        targetPane.classList.add('show');
                    }, 10);
                }
                
                if (navTab.id === 'myTab') {
                    if (history.pushState) {
                        history.pushState(null, null, targetPaneId);
                    } else {
                        location.hash = targetPaneId;
                    }
                }
            });
        });
    });

    const hash = window.location.hash;
    if (hash) {
        const mainTabToActivate = document.querySelector(`#myTab .nav-link[data-bs-target="${hash}"]`);
        if (mainTabToActivate) {
            mainTabToActivate.click();
        }
    }
}

// ===== EXERCISE INTERACTIVITY =====
function initializeExercises() {
    const qcmContainers = document.querySelectorAll('.qcm-container');

    qcmContainers.forEach(container => {
        const questions = container.querySelectorAll('li');

        questions.forEach(question => {
            const options = question.querySelectorAll('input[type="radio"]');
            const labels = question.querySelectorAll('.form-check-label');

            options.forEach((option, index) => {
                option.addEventListener('click', function() {
                    // Disable all options for this question
                    options.forEach(opt => opt.disabled = true);

                    const isCorrect = this.hasAttribute('data-correct');
                    const label = labels[index];

                    if (isCorrect) {
                        label.classList.add('correct-answer');
                    } else {
                        label.classList.add('incorrect-answer');
                        // Also show the correct answer
                        options.forEach((opt, idx) => {
                            if (opt.hasAttribute('data-correct')) {
                                labels[idx].classList.add('correct-answer');
                            }
                        });
                    }
                });
            });
        });
    });
}

function initializeSideMenu() {
    const menuIcon = document.getElementById('floating-menu-icon');
    const sideMenu = document.getElementById('side-menu');
    const closeBtn = document.getElementById('close-menu-btn');

    if (menuIcon && sideMenu && closeBtn) {
        menuIcon.addEventListener('click', () => {
            sideMenu.style.width = '250px';
        });

        closeBtn.addEventListener('click', () => {
            sideMenu.style.width = '0';
        });
    }
}

// ===== VISION CAROUSEL =====
function initializeVisionCarousel() {
    const carousel = document.getElementById('vision-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const prevBtn = carousel.querySelector('.carousel-control.prev');
    const nextBtn = carousel.querySelector('.carousel-control.next');
    
    let currentSlide = 0;
    let autoPlayInterval = null;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
        updateDots(index);
        currentSlide = index;
    }

    function updateDots(index) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) {
                dot.classList.add('active');
            }
        });
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    function startAutoPlay() {
        stopAutoPlay(); // Prevent multiple intervals
        autoPlayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => {
            showSlide(i);
        });
        dotsContainer.appendChild(dot);
    });

    // Event Listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
    });
    
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Initialize
    showSlide(0);
    startAutoPlay();
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const roleSelect = document.getElementById('contact-role');
    const studentFields = document.getElementById('student-fields');
    const teacherFields = document.getElementById('teacher-fields');
    const donorFields = document.getElementById('donor-fields');

    // Helper to clear and disable fields within a container
    function clearAndDisableFields(container) {
        const inputs = container.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.value = ''; // Clear value
            input.disabled = true; // Disable
            input.removeAttribute('required'); // Remove required attribute
        });
        container.classList.remove('visible');
    }

    // Helper to enable fields within a container and set required if needed
    function enableAndSetRequiredFields(container) {
        const inputs = container.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.disabled = false; // Enable
            // Add required attribute back if it was originally present or based on logic
            // For simplicity, let's assume all dynamic fields are required when visible
            input.setAttribute('required', 'true');
        });
        container.classList.add('visible');
    }

    function toggleFormFields() {
        // Clear and disable all dynamic fields first
        clearAndDisableFields(studentFields);
        clearAndDisableFields(teacherFields);
        clearAndDisableFields(donorFields);

        // Show and enable fields based on selected role
        const selectedRole = roleSelect.value;
        if (selectedRole === 'Élève') {
            enableAndSetRequiredFields(studentFields);
        } else if (selectedRole === 'Enseignant') {
            enableAndSetRequiredFields(teacherFields);
        } else if (selectedRole === 'Donateur') {
            enableAndSetRequiredFields(donorFields);
        }
    }

    // Attach event listener to role select
    roleSelect.addEventListener('change', toggleFormFields);

    // Call on initial load to set correct visibility
    toggleFormFields();

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('contact-name').value;
        const role = roleSelect.value;
        const subject = document.getElementById('contact-subject').value;
        const whatsappNum = document.getElementById('contact-whatsapp').value;

        let message = `Bonjour, je suis ${name}.
Je vous contacte en tant que : ${role}.
`;

        // Add dynamic fields to message only if they are visible and have a value
        if (role === 'Élève') {
            const studentClass = document.getElementById('contact-class').value;
            const studentSchool = document.getElementById('contact-school').value;
            if (studentClass) message += `Ma classe est : ${studentClass}.
`;
            if (studentSchool) message += `Mon établissement est : ${studentSchool}.
`;
        } else if (role === 'Enseignant') {
            const teacherSchool = document.getElementById('contact-teacher-school').value;
            const levelsInterested = document.getElementById('contact-levels-interested').value;
            if (teacherSchool) message += `Mon établissement est : ${teacherSchool}.
`;
            if (levelsInterested) message += `Niveaux intéressés : ${levelsInterested}.
`;
        } else if (role === 'Donateur') {
            const donationAmount = document.getElementById('contact-amount').value;
            if (donationAmount) message += `Montant du don souhaité : ${donationAmount} FCFA.
`;
        }

        message += `
Le sujet de ma demande est : ${subject}.
`;
        message += `
Mon numéro WhatsApp est : ${whatsappNum}`;

        const whatsappUrl = `https://wa.me/241077045354?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    });
}


// ===== NAVIGATION =====
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            animateHamburger(navToggle);
        });
    }
    
    // Fermer le menu en cliquant sur un lien
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                resetHamburger(navToggle);
            }
        });
    });
}

function animateHamburger(toggle) {
    const bars = toggle.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (toggle.parentElement.querySelector('.nav-menu').classList.contains('active')) {
            // Animation pour le menu ouvert
            if (index === 0) {
                bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            } else if (index === 1) {
                bar.style.opacity = '0';
            } else if (index === 2) {
                bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
            }
        } else {
            // Animation pour le menu fermé
            bar.style.transform = '';
            bar.style.opacity = '';
        }
    });
}

function resetHamburger(toggle) {
    const bars = toggle.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.style.transform = '';
        bar.style.opacity = '';
    });
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.neon-nav');
    const menuIcon = document.getElementById('floating-menu-icon');

    // Hide floating icon by default if navbar is visible
    if (navbar && menuIcon) {
        menuIcon.style.opacity = '0';
        menuIcon.style.pointerEvents = 'none';
    }

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (navbar && menuIcon) {
            // Effet de disparition/réapparition de la navbar
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                navbar.style.transform = 'translateY(-100%)';
                menuIcon.style.opacity = '1';
                menuIcon.style.pointerEvents = 'auto';
            } else {
                navbar.style.transform = 'translateY(0)';
                menuIcon.style.opacity = '0';
                menuIcon.style.pointerEvents = 'none';
            }
        }
        
        lastScrollTop = scrollTop;
        
        // Effet de parallaxe sur les éléments
        applyParallaxEffects(scrollTop);
    });
}

function applyParallaxEffects(scrollTop) {
    const parallaxElements = document.querySelectorAll('.hero-glow, .vision-glow, .coordonnateur-glow');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translate(-50%, calc(-50% + ${yPos}px))`;
    });
}

// ===== HOVER EFFECTS =====
function initializeHoverEffects() {
    // Effets sur les cartes de disciplines
    const disciplineCards = document.querySelectorAll('.discipline-card');
    disciplineCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            enhanceCardGlow(this);
        });
        
        card.addEventListener('mouseleave', function() {
            resetCardGlow(this);
        });
    });
    
    // Effets sur les boutons néon
    const neonButtons = document.querySelectorAll('.neon-btn-green');
    neonButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            enhanceButtonGlow(this);
        });
        
        button.addEventListener('mouseleave', function() {
            resetButtonGlow(this);
        });
    });
    
    // Effets sur les liens de navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            pulseElement(this);
        });
    });
}

function enhanceCardGlow(card) {
    const glow = card.querySelector('.card-glow');
    if (glow) {
        glow.style.opacity = '0.4';
        glow.style.filter = 'blur(60px)';
        glow.style.width = '120px';
        glow.style.height = '120px';
    }
}

function resetCardGlow(card) {
    const glow = card.querySelector('.card-glow');
    if (glow) {
        glow.style.opacity = '0.2';
        glow.style.filter = 'blur(40px)';
        glow.style.width = '100px';
        glow.style.height = '100px';
    }
}

function enhanceButtonGlow(button) {
    button.style.boxShadow = '0 0 20px var(--neon-green), 0 0 40px var(--neon-green)';
}

function resetButtonGlow(button) {
    button.style.boxShadow = '';
}

function pulseElement(element) {
    element.style.transform = 'scale(1.05)';
    setTimeout(() => {
        element.style.transform = '';
    }, 300);
}

// ===== INTERSECTION OBSERVER =====
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateOnScroll(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer les sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Observer les cartes de disciplines
    const cards = document.querySelectorAll('.discipline-card');
    cards.forEach((card, index) => {
        observer.observe(card);
    });
}

function animateOnScroll(element) {
    if (element.classList.contains('discipline-card')) {
        // Animation spécifique pour les cartes
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.style.transition = 'all 0.6s ease-out';
    } else if (element.tagName === 'SECTION') {
        // Animation pour les sections
        const content = element.querySelector('.container');
        if (content) {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }
    }
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    // Gestion du scroll fluide pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - CONFIG.scrollOffset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== UTILITAIRES =====
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
    };
}

// ===== ANIMATIONS PERSONNALISÉES =====
function createParticleEffect(x, y, color) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = color;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    
    document.body.appendChild(particle);
    
    // Animation
    const animation = particle.animate([
        { 
            transform: 'translate(0, 0) scale(1)',
            opacity: 1
        },
        { 
            transform: 'translate(var(--tx), var(--ty)) scale(0)',
            opacity: 0
        }
    ], {
        duration: 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });
    
    // Direction aléatoire
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 100;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');
    
    animation.onfinish = () => {
        particle.remove();
    };
}

// ===== NAVIGATION INTELLIGENTE =====
function initializeSmartNavigation() {
    // Injecter les boutons de navigation s'ils n'existent pas
    let floatingNav = document.querySelector('.floating-nav');

    if (!floatingNav) {
        floatingNav = document.createElement('div');
        floatingNav.className = 'floating-nav';
        document.body.appendChild(floatingNav);
    }

    // Vider les boutons existants
    floatingNav.innerHTML = '';

    // Navigation contextuelle basée sur la page actuelle
    const currentPage = window.location.pathname.split('/').pop();
    const isIndexPage = currentPage === 'index.html' || currentPage === '';

    let showPrevBtn = true;
    let showNextBtn = true;
    let prevHref = '#';
    let nextHref = '#';
    let prevTitle = 'Navigation précédente';
    let nextTitle = 'Navigation suivante';

    // Déterminer la navigation intelligente
    if (currentPage.includes('Cahier_')) {
        // Sur un cahier type, navigation vers fiche de leçon
        prevHref = BASE_URL + '/' + currentPage.replace('Cahier_', 'Fiche_Lecon_');
        prevTitle = 'Retour à la fiche de leçon';
        nextHref = BASE_URL + '/SVT/2nde.html';
        nextTitle = 'Retour aux chapitres';
    } else if (currentPage.includes('Fiche_Lecon_')) {
        // Sur une fiche de leçon, navigation vers cahier type
        prevHref = BASE_URL + '/SVT/2nde.html';
        prevTitle = 'Retour aux chapitres';
        nextHref = BASE_URL + '/' + currentPage.replace('Fiche_Lecon_', 'Cahier_');
        nextTitle = 'Voir le cahier type';
    } else if (currentPage === '2nde.html') {
        // Sur la page principale de seconde
        prevHref = BASE_URL + '/index.html';
        prevTitle = 'Retour à l\'accueil';
        nextHref = BASE_URL + '/SVT/Seconde/Fiche_Lecon_2nde_Chapitre1.html';
        nextTitle = 'Commencer le chapitre 1';
    } else if (isIndexPage) {
        // Sur la page d'accueil - PAS DE PRÉCÉDENT
        showPrevBtn = false;
        nextHref = BASE_URL + '/SVT/6eme.html';
        nextTitle = 'Commencer par la 6ème';
    } else {
        // Pour les autres pages de niveau (6ème, 5ème, etc.)
        const niveau = currentPage.replace('.html', '');
        const niveaux = ['6eme', '5eme', '4eme', '3eme', '2nde', '1re', 'Terminale'];
        const currentIndex = niveaux.indexOf(niveau);

        if (currentIndex > 0) {
            prevHref = BASE_URL + '/SVT/' + niveaux[currentIndex - 1] + '.html';
            prevTitle = 'Vers ' + niveaux[currentIndex - 1];
        } else {
            prevHref = BASE_URL + '/index.html';
            prevTitle = 'Retour à l\'accueil';
        }

        if (currentIndex < niveaux.length - 1) {
            nextHref = BASE_URL + '/SVT/' + niveaux[currentIndex + 1] + '.html';
            nextTitle = 'Vers ' + niveaux[currentIndex + 1];
        } else {
            // Dernière page - PAS DE SUIVANT
            showNextBtn = false;
        }
    }

    // Créer le bouton précédent si nécessaire
    if (showPrevBtn) {
        const prevBtn = document.createElement('a');
        prevBtn.className = 'floating-nav-btn floating-nav-prev';
        prevBtn.href = prevHref;
        prevBtn.title = prevTitle;
        prevBtn.innerHTML = '←';
        prevBtn.style.display = 'none'; // Désactivé au démarrage
        floatingNav.appendChild(prevBtn);
    }

    // Créer le bouton suivant si nécessaire
    if (showNextBtn) {
        const nextBtn = document.createElement('a');
        nextBtn.className = 'floating-nav-btn floating-nav-next';
        nextBtn.href = nextHref;
        nextBtn.title = nextTitle;
        nextBtn.innerHTML = '→';
        nextBtn.style.display = 'none'; // Désactivé au démarrage
        floatingNav.appendChild(nextBtn);
    }

    // S'assurer que la navigation est toujours visible
    floatingNav.style.position = 'fixed';
    floatingNav.style.bottom = '30px';
    floatingNav.style.right = '30px';
    floatingNav.style.zIndex = '10000';
    floatingNav.style.display = 'flex';
    floatingNav.style.gap = '10px';

    // Ajouter la logique de gestion de l'affichage selon le scroll
    handleFloatingNavVisibility();
    window.addEventListener('scroll', handleFloatingNavVisibility);
    window.addEventListener('resize', handleFloatingNavVisibility);
}

// Gestion de la visibilité des boutons de navigation selon la position
function handleFloatingNavVisibility() {
    const floatingNav = document.querySelector('.floating-nav');
    if (!floatingNav) return;

    const prevBtn = floatingNav.querySelector('.floating-nav-prev');
    const nextBtn = floatingNav.querySelector('.floating-nav-next');
    
    if (!prevBtn && !nextBtn) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

    // État 1 : Au démarrage - les deux boutons désactivés
    if (scrollTop === 0) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    // État 2 : Lorsque l'utilisateur veut revenir à la page précédente - seul le bouton de gauche apparaît
    if (scrollTop > 0 && scrollPercent < 0.1) {
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    // État 3 : Lorsque l'utilisateur est au milieu - les deux boutons apparaissent
    if (scrollPercent >= 0.1 && scrollPercent <= 0.9) {
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';
        return;
    }

    // État 4 : Lorsque l'utilisateur est proche du bas (de retour à la page d'accueil) - seul le bouton de droite apparaît
    if (scrollPercent > 0.9) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'flex';
        return;
    }
}

// ===== GESTION DES ERREURS =====
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});

// ===== EXPORT POUR UTILISATION EXTERNE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeScrollEffects,
        initializeHoverEffects,
        createParticleEffect,
        initializeSmartNavigation
    };
}

function adjustHrefsForGitHubPages() {
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        let href = link.getAttribute('href');
        // Only adjust if it's a relative path to an HTML file or a directory
        // and not an internal anchor link (#...) or an external link (http://...) or javascript
        if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('javascript')) {
            // Check if it's already correctly prefixed (e.g., if BASE_URL is empty)
            if (!href.startsWith(BASE_URL) && !href.startsWith('/')) {
                // Handle paths like "index.html" or "SVT/6eme.html"
                link.setAttribute('href', BASE_URL + '/' + href);
            } else if (href.startsWith('/') && !href.startsWith(BASE_URL)) {
                // Handle paths like "/SVT/6eme.html" if BASE_URL is not empty
                // This case might not be strictly needed if all paths are relative to root
                // but good for robustness.
                link.setAttribute('href', BASE_URL + href);
            }
        }
    });
}


// Gestion de la visibilité des boutons de navigation selon la position
function handleFloatingNavVisibility() {
    const floatingNav = document.querySelector('.floating-nav');
    if (!floatingNav) return;

    const prevBtn = floatingNav.querySelector('.floating-nav-prev');
    const nextBtn = floatingNav.querySelector('.floating-nav-next');
    
    if (!prevBtn && !nextBtn) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

    // État 1 : Au démarrage - les deux boutons désactivés
    if (scrollTop === 0) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    // État 2 : Lorsque l'utilisateur veut revenir à la page précédente - seul le bouton de gauche apparaît
    if (scrollTop > 0 && scrollPercent < 0.1) {
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    // État 3 : Lorsque l'utilisateur est au milieu - les deux boutons apparaissent
    if (scrollPercent >= 0.1 && scrollPercent <= 0.9) {
        if (prevBtn) prevBtn.style.display = 'flex';
        if (nextBtn) nextBtn.style.display = 'flex';
        return;
    }

    // État 4 : Lorsque l'utilisateur est proche du bas (de retour à la page d'accueil) - seul le bouton de droite apparaît
    if (scrollPercent > 0.9) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'flex';
        return;
    }
}

// ===== GESTION DES ERREURS =====
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});

// ===== EXPORT POUR UTILISATION EXTERNE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeScrollEffects,
        initializeHoverEffects,
        createParticleEffect,
        initializeSmartNavigation
    };
}