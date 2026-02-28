/**
 * reusPlay+ API Service
 * Dramabox API Integration
 */

const API_BASE = 'https://dramabox.sansekai.my.id/api/dramabox';

const DramaAPI = {
  /**
   * Get trending/popular dramas
   */
  async getTrending() {
    try {
      const response = await fetch(`${API_BASE}/trending`);
      if (!response.ok) throw new Error('Failed to fetch trending');
      return await response.json();
    } catch (error) {
      console.error('Error fetching trending:', error);
      return [];
    }
  },

  /**
   * Get latest dramas
   */
  async getLatest() {
    try {
      const response = await fetch(`${API_BASE}/latest`);
      if (!response.ok) throw new Error('Failed to fetch latest');
      return await response.json();
    } catch (error) {
      console.error('Error fetching latest:', error);
      return [];
    }
  },

  /**
   * Get popular search dramas
   */
  async getPopularSearch() {
    try {
      const response = await fetch(`${API_BASE}/populersearch`);
      if (!response.ok) throw new Error('Failed to fetch popular search');
      return await response.json();
    } catch (error) {
      console.error('Error fetching popular search:', error);
      return [];
    }
  },

  /**
   * Get VIP/featured dramas
   */
  async getVIP() {
    try {
      const response = await fetch(`${API_BASE}/vip`);
      if (!response.ok) throw new Error('Failed to fetch VIP');
      return await response.json();
    } catch (error) {
      console.error('Error fetching VIP:', error);
      return null;
    }
  },

  /**
   * Search dramas by query
   * @param {string} query - Search term
   */
  async search(query) {
    try {
      const response = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search');
      return await response.json();
    } catch (error) {
      console.error('Error searching:', error);
      return [];
    }
  },

  /**
   * Get drama detail by bookId
   * @param {string} bookId - Drama ID
   */
  async getDetail(bookId) {
    try {
      const response = await fetch(`${API_BASE}/detail?bookId=${bookId}`);
      if (!response.ok) throw new Error('Failed to fetch detail');
      return await response.json();
    } catch (error) {
      console.error('Error fetching detail:', error);
      return null;
    }
  },

  /**
   * Get all episodes with streaming URLs
   * @param {string} bookId - Drama ID
   */
  async getAllEpisodes(bookId) {
    try {
      const response = await fetch(`${API_BASE}/allepisode?bookId=${bookId}`);
      if (!response.ok) throw new Error('Failed to fetch episodes');
      return await response.json();
    } catch (error) {
      console.error('Error fetching episodes:', error);
      return [];
    }
  },

  /**
   * Get random drama with video
   */
  async getRandom() {
    try {
      const response = await fetch(`${API_BASE}/randomdrama`);
      if (!response.ok) throw new Error('Failed to fetch random');
      return await response.json();
    } catch (error) {
      console.error('Error fetching random:', error);
      return [];
    }
  }
};

/**
 * Proxy image URL to bypass CORS
 */
function proxyImage(url) {
  if (!url) return '';
  // Use Vercel API proxy in production, direct URL in development
  const isProduction = window.location.hostname !== 'localhost';
  if (isProduction) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}

/**
 * Create drama card HTML
 * @param {Object} drama - Drama data
 * @param {number} rank - Optional rank number
 */
function createDramaCard(drama, rank = null) {
  const bookId = drama.bookId;
  const title = drama.bookName || drama.title || 'Untitled';
  const cover = proxyImage(drama.coverWap || drama.cover || '');
  const episodes = drama.chapterCount || '?';
  const tag = drama.tags?.[0] || '';
  const hotCode = drama.rankVo?.hotCode || '';

  // Placeholder with gradient
  const placeholder = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%231a1a2e'/%3E%3Cstop offset='100%25' stop-color='%23111'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='300' height='400'/%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%23666' font-family='sans-serif' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E`;


  // If ranked, use different layout
  if (rank) {
    return `
        <article class="drama-card drama-card--ranked">
          <span class="drama-card__rank">${rank}</span>
          <div class="drama-card__content">
            <a href="detail.html?id=${bookId}" class="drama-card__poster">
              ${hotCode ? `<span class="drama-card__badge">${hotCode}</span>` : ''}
              <img src="${cover}" alt="${title}" class="drama-card__image" loading="lazy" referrerpolicy="no-referrer" crossorigin="anonymous" onerror="this.onerror=null;this.src='${placeholder}'">
              <div class="drama-card__play">
                <span class="drama-card__play-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd"/></svg>
                </span>
              </div>
            </a>
            <div class="drama-card__info">
              <h3 class="drama-card__title">${title}</h3>
              <p class="drama-card__meta">${episodes} Eps${tag ? ' • ' + tag : ''}</p>
            </div>
          </div>
        </article>
      `;
  }

  return `
    <article class="drama-card">
      <a href="detail.html?id=${bookId}" class="drama-card__poster">
        ${hotCode ? `<span class="drama-card__badge">${hotCode}</span>` : ''}
        <img src="${cover}" alt="${title}" class="drama-card__image" loading="lazy" referrerpolicy="no-referrer" crossorigin="anonymous" onerror="this.onerror=null;this.src='${placeholder}'">
        <div class="drama-card__play">
          <span class="drama-card__play-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd"/></svg>
          </span>
        </div>
      </a>
      <div class="drama-card__info">
        <h3 class="drama-card__title">${title}</h3>
        <p class="drama-card__meta">${episodes} Eps${tag ? ' • ' + tag : ''}</p>
      </div>
    </article>
  `;
}

/**
 * Create skeleton loading cards
 * @param {number} count - Number of skeletons
 */
function createSkeletonCards(count = 6) {
  return Array(count).fill(`
    <div class="drama-card drama-card--skeleton">
      <div class="drama-card__poster skeleton"></div>
      <div class="drama-card__info">
        <div class="skeleton" style="height:16px;width:80%;margin-bottom:8px;border-radius:4px;"></div>
        <div class="skeleton" style="height:12px;width:50%;border-radius:4px;"></div>
      </div>
    </div>
  `).join('');
}

/**
 * Get video URL from episode data (prefer 720p)
 * @param {Object} episode - Episode data with cdnList
 */
function getVideoUrl(episode, quality = 720) {
  if (!episode?.cdnList?.[0]?.videoPathList) return null;

  const videoList = episode.cdnList[0].videoPathList;
  const preferred = videoList.find(v => v.quality === quality);

  if (preferred) return preferred.videoPath;

  // Fallback to default or first available
  const defaultVideo = videoList.find(v => v.isDefault === 1);
  return defaultVideo?.videoPath || videoList[0]?.videoPath;
}
