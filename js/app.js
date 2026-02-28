/**
 * reusPlay+ Main JavaScript
 * Core functionality for the streaming website
 */

// Header scroll behavior
document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  
  if (header && header.classList.contains('header--transparent')) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.remove('header--transparent');
        header.classList.add('header--solid');
      } else {
        header.classList.remove('header--solid');
        header.classList.add('header--transparent');
      }
    });
  }
});

// Smooth page transitions
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('animate-fade-in');
});

// Drama card click handler
document.querySelectorAll('.drama-card').forEach(card => {
  card.addEventListener('click', function(e) {
    if (!e.target.closest('a')) {
      window.location.href = 'detail.html';
    }
  });
});

// Utility: Format number with K/M suffix
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
}

// Utility: Format duration
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Local storage helpers for My List
const MyList = {
  KEY: 'reusplay_mylist',
  
  get() {
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : [];
  },
  
  add(drama) {
    const list = this.get();
    if (!list.find(d => d.id === drama.id)) {
      list.push(drama);
      localStorage.setItem(this.KEY, JSON.stringify(list));
    }
  },
  
  remove(dramaId) {
    const list = this.get().filter(d => d.id !== dramaId);
    localStorage.setItem(this.KEY, JSON.stringify(list));
  },
  
  has(dramaId) {
    return this.get().some(d => d.id === dramaId);
  }
};

// Watch history
const WatchHistory = {
  KEY: 'reusplay_history',
  
  get() {
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : [];
  },
  
  add(drama, episode, progress) {
    let history = this.get();
    const existing = history.findIndex(h => h.dramaId === drama.id);
    
    const entry = {
      dramaId: drama.id,
      title: drama.title,
      image: drama.image,
      episode: episode,
      progress: progress,
      timestamp: Date.now()
    };
    
    if (existing >= 0) {
      history[existing] = entry;
    } else {
      history.unshift(entry);
    }
    
    // Keep only last 20 items
    history = history.slice(0, 20);
    localStorage.setItem(this.KEY, JSON.stringify(history));
  }
};

console.log('reusPlay+ loaded');
