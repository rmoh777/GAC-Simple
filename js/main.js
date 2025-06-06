// News Data
const NEWS_ARTICLES = [
  {
    id: 'fcc-announces-new-lifeline-enhancements-2025',
    title: 'FCC Announces New Lifeline Program Enhancements for 2025',
    excerpt: 'The Federal Communications Commission has approved significant improvements to the Lifeline program, including expanded broadband access and increased monthly benefits for eligible households.',
    category: 'Policy Updates',
    date: '2025-05-28',
    author: 'Lifeline Connect Team'
  },
  {
    id: 'study-shows-40-percent-increase-lifeline-enrollment',
    title: 'Study Shows 40% Increase in Lifeline Enrollment',
    excerpt: 'A recent study reveals a significant increase in Lifeline program enrollment, highlighting the growing need for affordable connectivity solutions in underserved communities.',
    category: 'Research',
    date: '2025-05-15',
    author: 'Research Team'
  },
  {
    id: 'provider-spotlight-comparing-lifeline-plans',
    title: 'Provider Spotlight: Comparing Lifeline Plans',
    excerpt: 'An in-depth comparison of current Lifeline service providers, helping consumers make informed decisions about their connectivity options.',
    category: 'Provider Updates',
    date: '2025-05-01',
    author: 'Consumer Guide Team'
  }
];

// Mobile Menu Functionality
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('active');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
  const menu = document.getElementById('mobileMenu');
  const menuButton = document.querySelector('.mobile-menu-btn');
  
  if (menu && menu.classList.contains('active') && 
      !menu.contains(event.target) && 
      !menuButton.contains(event.target)) {
    menu.classList.remove('active');
  }
});

// News Card Rendering
function renderNewsCard(article) {
  return `
    <article class="news-card">
      <div class="news-card__content">
        <div class="news-card__category">${article.category}</div>
        <h3 class="news-card__title">${article.title}</h3>
        <p class="news-card__excerpt">${article.excerpt}</p>
        <div class="news-card__meta">
          <span>${article.author}</span>
          <time datetime="${article.date}">${formatDate(article.date)}</time>
        </div>
      </div>
    </article>
  `;
}

// Format date to readable format
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Render news grid
function renderNewsGrid(articles, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const html = articles.map(article => renderNewsCard(article)).join('');
  container.innerHTML = html;
}

// Set active navigation link
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href').replace('.html', '') === currentPage) {
      link.classList.add('active');
    }
  });
}

// Update copyright year
function updateCopyrightYear() {
  const yearElement = document.getElementById('copyrightYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Initialize all functionality
function init() {
  // Set active navigation
  setActiveNavLink();
  
  // Update copyright year
  updateCopyrightYear();
  
  // Render news if on news page
  const newsGrid = document.getElementById('newsGrid');
  if (newsGrid) {
    renderNewsGrid(NEWS_ARTICLES, 'newsGrid');
  }
  
  // Render all news if on news index page
  const allNewsGrid = document.getElementById('allNewsGrid');
  if (allNewsGrid) {
    renderNewsGrid(NEWS_ARTICLES, 'allNewsGrid');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Initialize the interview controller when the page loads (only on interview page)
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('stateSelect')) {
        window.interviewController = new InterviewController();
    }
}); 