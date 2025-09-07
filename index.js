// Mobile-Friendly Newspaper JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    setCurrentDate();
    
    // Initialize smooth scrolling for navigation
    initializeNavigation();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize reading progress
    initializeReadingProgress();
    
    // Initialize image lazy loading
    initializeLazyLoading();
    
    // Initialize share functionality
    initializeShareButtons();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize dark mode toggle
    initializeDarkMode();
});

// Set current date in Kinyarwanda
function setCurrentDate() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    
    // Convert to Kinyarwanda months and days
    const kinyarwandaMonths = {
        'January': 'Mutarama', 'February': 'Gashyantare', 'March': 'Werurwe',
        'April': 'Mata', 'May': 'Gicurasi', 'June': 'Kamena',
        'July': 'Nyakanga', 'August': 'Kanama', 'September': 'Nzeri',
        'October': 'Ukwakira', 'November': 'Ugushyingo', 'December': 'Ukuboza'
    };
    
    const kinyarwandaDays = {
        'Monday': 'Kuwa mbere', 'Tuesday': 'Kuwa kabiri', 'Wednesday': 'Kuwa gatatu',
        'Thursday': 'Kuwa kane', 'Friday': 'Kuwa gatanu', 'Saturday': 'Kuwa gatandatu',
        'Sunday': 'Ku cyumweru'
    };
    
    const dateStr = now.toLocaleDateString('en-US', options);
    const parts = dateStr.split(' ');
    const dayName = kinyarwandaDays[parts[0]] || parts[0];
    const monthName = kinyarwandaMonths[parts[1]] || parts[1];
    const day = parts[2];
    const year = parts[3];
    
    const kinyarwandaDate = `${dayName}, ${day} ${monthName} ${year}`;
    
    const dateElement = document.getElementById('currentDate');
    const publishDateElement = document.getElementById('publishDate');
    
    if (dateElement) {
        dateElement.textContent = kinyarwandaDate;
    }
    
    if (publishDateElement) {
        publishDateElement.textContent = kinyarwandaDate;
    }
}

// Initialize smooth scrolling navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');
                
                // Smooth scroll to target
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], article[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Initialize mobile menu
function initializeMobileMenu() {
    // Create mobile menu button
    const nav = document.querySelector('.navigation');
    const navMenu = document.querySelector('.nav-menu');
    
    if (nav && navMenu) {
        const mobileMenuButton = document.createElement('button');
        mobileMenuButton.className = 'mobile-menu-button';
        mobileMenuButton.innerHTML = '☰';
        mobileMenuButton.setAttribute('aria-label', 'Fungura menu');
        
        // Add mobile menu styles
        const style = document.createElement('style');
        style.textContent = `
            .mobile-menu-button {
                display: none;
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                margin-left: auto;
            }
            
            @media (max-width: 767px) {
                .mobile-menu-button {
                    display: block;
                }
                
                .nav-menu {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: #1e3c72;
                    flex-direction: column;
                    padding: 1rem;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }
                
                .nav-menu.active {
                    display: flex;
                }
                
                .nav-menu li {
                    margin: 0.5rem 0;
                }
                
                .nav-link {
                    display: block;
                    padding: 1rem;
                    border-radius: 8px;
                    text-align: center;
                }
            }
        `;
        document.head.appendChild(style);
        
        nav.appendChild(mobileMenuButton);
        
        mobileMenuButton.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu when clicking on a link
        navMenu.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                navMenu.classList.remove('active');
                mobileMenuButton.innerHTML = '☰';
            }
        });
    }
}

// Initialize reading progress indicator
function initializeReadingProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
    
    // Add progress bar styles
    const style = document.createElement('style');
    style.textContent = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(30, 60, 114, 0.2);
            z-index: 1001;
        }
        
        .reading-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #1e3c72, #2a5298);
            width: 0%;
            transition: width 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    document.body.insertBefore(progressBar, document.body.firstChild);
    
    // Update progress on scroll
    window.addEventListener('scroll', updateReadingProgress);
}

// Update reading progress
function updateReadingProgress() {
    const article = document.querySelector('.main-article');
    if (!article) return;
    
    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.scrollY;
    
    const progress = Math.min(
        Math.max((scrollTop - articleTop + windowHeight) / articleHeight, 0),
        1
    );
    
    const progressFill = document.querySelector('.reading-progress-fill');
    if (progressFill) {
        progressFill.style.width = `${progress * 100}%`;
    }
}

// Initialize lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';
                
                img.onload = function() {
                    img.style.opacity = '1';
                };
                
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize share functionality
function initializeShareButtons() {
    // Add share buttons to article
    const articleHeader = document.querySelector('.article-header');
    if (articleHeader) {
        const shareContainer = document.createElement('div');
        shareContainer.className = 'share-container';
        shareContainer.innerHTML = `
            <button class="share-button" onclick="shareArticle('facebook')">📘 Facebook</button>
            <button class="share-button" onclick="shareArticle('twitter')">🐦 Twitter</button>
            <button class="share-button" onclick="shareArticle('whatsapp')">💬 WhatsApp</button>
            <button class="share-button" onclick="copyLink()">📋 Koporera</button>
        `;
        
        // Add share button styles
        const style = document.createElement('style');
        style.textContent = `
            .share-container {
                display: flex;
                gap: 0.5rem;
                margin-top: 1rem;
                flex-wrap: wrap;
            }
            
            .share-button {
                background: #1e3c72;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: all 0.3s ease;
            }
            
            .share-button:hover {
                background: #2a5298;
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
        
        articleHeader.appendChild(shareContainer);
    }
}

// Share article function
function shareArticle(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const text = encodeURIComponent('Soma iyi nkuru y'ingenzi ku sisitemu y'inguzanyo y'abanyeshuri ba Kaminuza y'u Rwanda');
    
    let shareUrl = '';
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Copy link function
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        // Show success message
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '✅ Koporowe!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#1e3c72';
        }, 2000);
    }).catch(() => {
        alert('Ntabwo washoboye gukoporora link. Gerageza uko ukoze.');
    });
}

// Initialize search functionality
function initializeSearch() {
    // Add search box to header
    const headerContent = document.querySelector('.header-content');
    if (headerContent) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <input type="text" id="searchInput" placeholder="Shakisha amakuru..." class="search-input">
            <button class="search-button" onclick="performSearch()">🔍</button>
        `;
        
        // Add search styles
        const style = document.createElement('style');
        style.textContent = `
            .search-container {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-left: 1rem;
            }
            
            .search-input {
                padding: 0.5rem;
                border: none;
                border-radius: 20px;
                background: rgba(255,255,255,0.2);
                color: white;
                width: 200px;
            }
            
            .search-input::placeholder {
                color: rgba(255,255,255,0.7);
            }
            
            .search-button {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 0.5rem;
                border-radius: 50%;
                cursor: pointer;
                width: 40px;
                height: 40px;
            }
            
            .search-button:hover {
                background: rgba(255,255,255,0.3);
            }
            
            @media (max-width: 767px) {
                .search-container {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
        
        headerContent.appendChild(searchContainer);
    }
}

// Perform search function
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (!searchTerm.trim()) return;
    
    const article = document.querySelector('.main-article');
    const text = article.textContent.toLowerCase();
    
    if (text.includes(searchTerm)) {
        // Highlight search term
        highlightSearchTerm(searchTerm);
        
        // Scroll to first occurrence
        const firstMatch = article.querySelector(`[data-highlighted="true"]`);
        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } else {
        alert('Ntabwo wabonye "' + searchTerm + '" mu nkuru.');
    }
}

// Highlight search term
function highlightSearchTerm(term) {
    // Remove previous highlights
    const highlighted = document.querySelectorAll('[data-highlighted="true"]');
    highlighted.forEach(el => {
        el.outerHTML = el.innerHTML;
    });
    
    // Add new highlights
    const article = document.querySelector('.main-article');
    const walker = document.createTreeWalker(
        article,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        const regex = new RegExp(`(${term})`, 'gi');
        
        if (regex.test(text)) {
            const highlightedHTML = text.replace(regex, '<mark data-highlighted="true" style="background: yellow; padding: 2px 4px; border-radius: 3px;">$1</mark>');
            const wrapper = document.createElement('span');
            wrapper.innerHTML = highlightedHTML;
            textNode.parentNode.replaceChild(wrapper, textNode);
        }
    });
}

// Initialize dark mode toggle
function initializeDarkMode() {
    // Add dark mode toggle to header
    const headerContent = document.querySelector('.header-content');
    if (headerContent) {
        const darkModeToggle = document.createElement('button');
        darkModeToggle.className = 'dark-mode-toggle';
        darkModeToggle.innerHTML = '🌙';
        darkModeToggle.setAttribute('aria-label', 'Hindura ubwoba');
        darkModeToggle.onclick = toggleDarkMode;
        
        // Add dark mode styles
        const style = document.createElement('style');
        style.textContent = `
            .dark-mode-toggle {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .dark-mode-toggle:hover {
                background: rgba(255,255,255,0.2);
            }
            
            .dark-mode {
                background-color: #1a1a1a !important;
                color: #e0e0e0 !important;
            }
            
            .dark-mode .main-article,
            .dark-mode .related-articles {
                background: #2d2d2d !important;
                color: #e0e0e0 !important;
            }
            
            .dark-mode .benefit-card,
            .dark-mode .challenge-item,
            .dark-mode .quote,
            .dark-mode .solution-item {
                background: #3d3d3d !important;
                color: #e0e0e0 !important;
            }
        `;
        document.head.appendChild(style);
        
        headerContent.appendChild(darkModeToggle);
    }
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const toggle = document.querySelector('.dark-mode-toggle');
    
    if (document.body.classList.contains('dark-mode')) {
        toggle.innerHTML = '☀️';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        toggle.innerHTML = '🌙';
        localStorage.setItem('darkMode', 'disabled');
    }
}

// Load dark mode preference
function loadDarkModePreference() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        const toggle = document.querySelector('.dark-mode-toggle');
        if (toggle) {
            toggle.innerHTML = '☀️';
        }
    }
}

// Load preferences on page load
window.addEventListener('load', loadDarkModePreference);

// Add smooth animations for better mobile experience
function addSmoothAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        .benefit-card,
        .challenge-item,
        .quote,
        .solution-item,
        .related-article {
            transition: all 0.3s ease;
        }
        
        .article-image,
        .hero-img {
            transition: transform 0.3s ease;
        }
        
        .article-image:hover,
        .hero-img:hover {
            transform: scale(1.02);
        }
        
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize smooth animations
addSmoothAnimations();

// Add touch gestures for mobile
function initializeTouchGestures() {
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Swipe left/right for navigation
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - next article
                console.log('Swipe left detected');
            } else {
                // Swipe right - previous article
                console.log('Swipe right detected');
            }
        }
        
        startX = 0;
        startY = 0;
    });
}

// Initialize touch gestures
initializeTouchGestures();
