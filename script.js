const API_KEY = '24f1d15889454467b262b617b8c3c34c'; // Get from https://newsapi.org

// Map sources to bias/populist lean (optional UI enhancement)
const SOURCE_LABELS = {
  'the-grayzone': 'Critical',
  'breakthrough-news': 'Populist Left',
  'associated-press': 'Mainstream',
  'cnn': 'Mainstream',
  'xinhuanet.com': 'China State',
  'cgtn.com': 'China State'
};

// Fetch U.S. Power & Policy News
async function fetchUSNews() {
  const queries = [
    'U.S. economy corporate influence populist',
    'Federal Reserve inequality policy',
    'U.S. foreign policy global impact',
    'Michael Hudson economic analysis',
    'Wall Street vs Main Street'
  ];
  const query = encodeURIComponent(queries.join(' OR '));
  const url = `https://newsapi.org/v2/everything?q=${query}&sources=the-grayzone,breakthrough-news,associated-press,cnn&sortBy=publishedAt&language=en&pageSize=6&apiKey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const container = document.getElementById('us-news');
    
    if (data.articles && data.articles.length > 0) {
      data.articles.slice(0, 6).forEach(article => {
        const sourceName = article.source.id || 'Unknown';
        const label = SOURCE_LABELS[sourceName] || 'General';
        
        const card = document.createElement('div');
        card.className = 'article-card';
        card.innerHTML = `
          <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
          <p>${truncate(article.description, 180)}</p>
          <div class="article-meta">
            <span class="source-badge">${label}</span>
            ${article.source.name} • ${formatDate(article.publishedAt)}
          </div>
        `;
        container.appendChild(card);
      });
    } else {
      container.innerHTML = '<p>No recent U.S. news found.</p>';
    }
  } catch (err) {
    console.error('Error fetching U.S. news:', err);
    document.getElementById('us-news').innerHTML = '<p>Failed to load U.S. news.</p>';
  }
}

// Fetch Chinese News (Translated)
async function fetchChinaNews() {
  // We'll use Xinhua and CGTN via NewsAPI (limited Chinese coverage)
  // For better results, we can later add a proxy or translation layer
  const url = `https://newsapi.org/v2/everything?domains=xinhuanet.com,cgtn.com&language=en&sortBy=publishedAt&pageSize=5&apiKey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const container = document.getElementById('china-news');

    if (data.articles && data.articles.length > 0) {
      data.articles.slice(0, 5).forEach(article => {
        const isTranslated = !article.content?.includes('Chinese') && article.url.includes('english');
        const label = isTranslated ? 'Translated' : 'English-First';

        const card = document.createElement('div');
        card.className = 'article-card';
        card.innerHTML = `
          <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
          <p>${truncate(article.description, 160)}</p>
          <div class="article-meta">
            <span class="source-badge">${label}</span>
            ${article.source.name} • ${formatDate(article.publishedAt)}
          </div>
        `;
        container.appendChild(card);
      });
    } else {
      container.innerHTML = '<p>No recent Chinese news found.</p>';
    }
  } catch (err) {
    console.error('Error fetching China news:', err);
    container.innerHTML = '<p>Failed to load China news.</p>';
  }
}

// Daily Digest (Simple version — can be expanded)
function generateDigest() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const digest = document.getElementById('daily-digest');
  digest.innerHTML = `
    <p><strong>📅 ${today}</strong></p>
    <p><strong>U.S.:</strong> Growing debate over Fed policy and wealth inequality. Corporate lobbying surges ahead of 2024 elections.</p>
    <p><strong>China:</strong> Central economic work conference emphasizes "high-quality development" amid global trade shifts.</p>
    <p><strong>Global:</strong> U.S.-China tech tensions rise as semiconductor restrictions expand.</p>
    <p><em>— Compiled by Global Pulse</em></p>
  `;
}

// Utilities
function truncate(str, n) {
  return str?.length > n ? str.slice(0, n) + '...' : str;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Dark Mode Toggle
document.getElementById('darkModeToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// On Load
window.onload = () => {
  // Set theme
  const saved = localStorage.getItem('theme');
  document.documentElement.setAttribute('data-theme', saved || 'dark');

  // Fetch news
  fetchUSNews();
  fetchChinaNews();
  generateDigest();
};
