/**
 * reusPlay+ Video Player
 */

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('videoPlayer');
    const playerWrapper = document.getElementById('playerWrapper');
    const playerHeader = document.getElementById('playerHeader');
    const playerControls = document.getElementById('playerControls');
    const playerOverlay = document.getElementById('playerOverlay');
    const centerPlayBtn = document.getElementById('centerPlayBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const timeDisplay = document.getElementById('timeDisplay');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const episodesBtn = document.getElementById('episodesBtn');
    const episodesSidebar = document.getElementById('episodesSidebar');
    const closeSidebar = document.getElementById('closeSidebar');

    if (!video) return;

    let controlsTimeout;
    let isPlaying = false;

    function showControls() {
        playerHeader?.classList.remove('player-header--hidden');
        playerControls?.classList.remove('player-controls--hidden');
        playerOverlay?.classList.remove('player-overlay--hidden');
        clearTimeout(controlsTimeout);
        if (isPlaying) {
            controlsTimeout = setTimeout(hideControls, 3000);
        }
    }

    function hideControls() {
        if (isPlaying && !episodesSidebar?.classList.contains('episodes-sidebar--open')) {
            playerHeader?.classList.add('player-header--hidden');
            playerControls?.classList.add('player-controls--hidden');
            playerOverlay?.classList.add('player-overlay--hidden');
        }
    }

    playerWrapper?.addEventListener('mousemove', showControls);

    playerWrapper?.addEventListener('click', (e) => {
        if (e.target === video || e.target === playerWrapper || e.target.closest('.player-video')) {
            togglePlay();
        }
    });

    function togglePlay() {
        if (video.paused) {
            video.play();
            isPlaying = true;
            if (playIcon) {
                playIcon.innerHTML = '<path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clip-rule="evenodd"/>';
            }
            centerPlayBtn?.classList.add('player-center-play--hidden');
        } else {
            video.pause();
            isPlaying = false;
            if (playIcon) {
                playIcon.innerHTML = '<path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd"/>';
            }
            centerPlayBtn?.classList.remove('player-center-play--hidden');
        }
        showControls();
    }

    playPauseBtn?.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
    centerPlayBtn?.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });

    video.addEventListener('timeupdate', () => {
        const percent = (video.currentTime / video.duration) * 100;
        if (progressFill) progressFill.style.width = percent + '%';
        if (timeDisplay) {
            const current = formatTime(video.currentTime);
            const duration = formatTime(video.duration);
            timeDisplay.textContent = `${current} / ${duration}`;
        }
    });

    progressBar?.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = percent * video.duration;
    });

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    fullscreenBtn?.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            playerWrapper?.requestFullscreen().catch(() => { });
        } else {
            document.exitFullscreen();
        }
    });

    episodesBtn?.addEventListener('click', () => episodesSidebar?.classList.toggle('episodes-sidebar--open'));
    closeSidebar?.addEventListener('click', () => episodesSidebar?.classList.remove('episodes-sidebar--open'));

    document.querySelectorAll('.ep-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.ep-item').forEach(i => i.classList.remove('ep-item--active'));
            item.classList.add('ep-item--active');
            episodesSidebar?.classList.remove('episodes-sidebar--open');
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        switch (e.code) {
            case 'Space': e.preventDefault(); togglePlay(); break;
            case 'ArrowLeft': video.currentTime = Math.max(0, video.currentTime - 10); break;
            case 'ArrowRight': video.currentTime = Math.min(video.duration, video.currentTime + 10); break;
            case 'ArrowUp': e.preventDefault(); video.volume = Math.min(1, video.volume + 0.1); break;
            case 'ArrowDown': e.preventDefault(); video.volume = Math.max(0, video.volume - 0.1); break;
            case 'KeyF': fullscreenBtn?.click(); break;
            case 'Escape': episodesSidebar?.classList.remove('episodes-sidebar--open'); break;
        }
    });

    showControls();
});
