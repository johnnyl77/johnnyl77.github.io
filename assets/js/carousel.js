/**
 * Carousel Functionality
 * Handles image/video carousels on projects page
 */

const carousels = {};
const youtubePlayersReady = {};
let youtubeAPIReady = false;

// Load YouTube IFrame API
if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Called automatically when YouTube API is ready
window.onYouTubeIframeAPIReady = function() {
    youtubeAPIReady = true;
    // Initialize any YouTube players that were waiting
    document.querySelectorAll('.carousel-container').forEach(carousel => {
        initYouTubePlayers(carousel.id);
    });
};

/**
 * Toggle carousel visibility and scroll to center it
 */
function toggleCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    const button = document.querySelector(`[onclick="toggleCarousel('${carouselId}')"]`);
    
    if (!carousel) return;
    
    const isActive = carousel.classList.contains('active');
    
    if (isActive) {
        // Closing carousel - pause all videos in this carousel
        pauseAllVideos(carouselId);
        carousel.classList.remove('active');
        if (button) button.classList.remove('active');
    } else {
        // Opening carousel
        carousel.classList.add('active');
        if (button) button.classList.add('active');
        
        // Wait for CSS transition to complete, then scroll
        setTimeout(() => {
            // Get the carousel's position after it has expanded
            const carouselRect = carousel.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Calculate position to center carousel in viewport
            // We want the carousel's vertical center to align with the viewport's center
            const carouselTopAbsolute = carouselRect.top + scrollTop;
            const carouselCenter = carouselTopAbsolute + (carouselRect.height / 2);
            const viewportCenter = scrollTop + (viewportHeight / 2);
            
            // Calculate how much to scroll to center the carousel
            const scrollOffset = carouselCenter - viewportCenter;
            
            // Smooth scroll to center the carousel
            window.scrollTo({
                top: scrollTop + scrollOffset,
                behavior: 'smooth'
            });
        }, 450); // Wait for the 0.4s CSS transition to complete
    }
}

/**
 * Pause all videos in a carousel
 */
function pauseAllVideos(carouselId) {
    const carousel = carousels[carouselId];
    if (!carousel) return;
    
    carousel.slides.forEach((slide) => {
        const video = slide.querySelector('video');
        const iframe = slide.querySelector('iframe');
        
        if (video) {
            video.pause();
        }
        
        if (iframe && carousel.youtubePlayers) {
            const player = carousel.youtubePlayers.get(iframe);
            if (player && player.pauseVideo) {
                player.pauseVideo();
            }
        }
    });
}

/**
 * Initialize a carousel by ID
 */
function initCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicatorsContainer = carousel.querySelector('.carousel-indicators');
    
    carousels[carouselId] = {
        currentIndex: 0,
        totalSlides: slides.length,
        track: track,
        slides: slides,
        youtubePlayers: new Map() // Store YouTube player instances
    };
    
    // Create indicators
    for (let i = 0; i < slides.length; i++) {
        const indicator = document.createElement('button');
        indicator.classList.add('indicator');
        indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(carouselId, i));
        indicatorsContainer.appendChild(indicator);
    }
    
    // Initialize caption for first slide
    const captionDisplay = carousel.querySelector('.carousel-caption-display');
    if (captionDisplay && slides.length > 0) {
        const firstCaption = slides[0].getAttribute('data-caption');
        captionDisplay.textContent = firstCaption || '';
    }
    
    // Set volume and pause HTML5 videos that aren't visible
    slides.forEach((slide, index) => {
        const video = slide.querySelector('video');
        if (video) {
            video.volume = 0.3; // Set default volume to 30%
            if (index !== 0) {
                video.pause();
            }
        }
    });
    
    // Initialize YouTube players if API is ready
    if (youtubeAPIReady) {
        initYouTubePlayers(carouselId);
    }
}

/**
 * Initialize YouTube IFrame Players for a carousel
 */
function initYouTubePlayers(carouselId) {
    const carousel = carousels[carouselId];
    if (!carousel || !window.YT || !window.YT.Player) return;
    
    carousel.slides.forEach((slide, index) => {
        const iframe = slide.querySelector('iframe[src*="youtube.com"]');
        if (iframe && !carousel.youtubePlayers.has(iframe)) {
            // Give iframe an ID if it doesn't have one
            if (!iframe.id) {
                iframe.id = `youtube-${carouselId}-${index}`;
            }
            
            // Create YouTube player instance
            const player = new YT.Player(iframe.id, {
                events: {
                    'onReady': (event) => {
                        // Pause if not the current slide
                        if (index !== carousel.currentIndex) {
                            event.target.pauseVideo();
                        }
                    }
                }
            });
            
            carousel.youtubePlayers.set(iframe, player);
        }
    });
}

/**
 * Move carousel in specified direction
 */
function moveCarousel(carouselId, direction) {
    const carousel = carousels[carouselId];
    if (!carousel) return;
    
    carousel.currentIndex += direction;
    
    // Wrap around
    if (carousel.currentIndex < 0) {
        carousel.currentIndex = carousel.totalSlides - 1;
    } else if (carousel.currentIndex >= carousel.totalSlides) {
        carousel.currentIndex = 0;
    }
    
    updateCarousel(carouselId);
}

/**
 * Go to specific slide
 */
function goToSlide(carouselId, index) {
    const carousel = carousels[carouselId];
    if (!carousel) return;
    
    carousel.currentIndex = index;
    updateCarousel(carouselId);
}

/**
 * Update carousel display
 */
function updateCarousel(carouselId) {
    const carousel = carousels[carouselId];
    const offset = -carousel.currentIndex * 100;
    carousel.track.style.transform = `translateX(${offset}%)`;
    
    // Update indicators
    const carouselElement = document.getElementById(carouselId);
    const indicators = carouselElement.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === carousel.currentIndex);
    });
    
    // Update caption display
    const currentSlide = carousel.slides[carousel.currentIndex];
    const caption = currentSlide.getAttribute('data-caption');
    const captionDisplay = carouselElement.querySelector('.carousel-caption-display');
    if (captionDisplay) {
        captionDisplay.textContent = caption || '';
    }
    
    // Handle video play/pause for all video types
    // Both HTML5 videos and YouTube videos maintain their playback position when paused
    carousel.slides.forEach((slide, index) => {
        const video = slide.querySelector('video');
        const iframe = slide.querySelector('iframe');
        
        // Handle HTML5 videos
        if (video) {
            video.volume = 0.3; // Ensure volume stays at 30%
            if (index === carousel.currentIndex) {
                video.play().catch(() => {}); // Resume playback from saved position
            } else {
                video.pause(); // Pause and save current playback position
            }
        }
        
        // Handle YouTube videos
        if (iframe && carousel.youtubePlayers) {
            const player = carousel.youtubePlayers.get(iframe);
            if (player && player.pauseVideo && player.playVideo) {
                if (index === carousel.currentIndex) {
                    // Only play if not already playing
                    player.getPlayerState().then(state => {
                        // YouTube player state: 1 = playing, 2 = paused
                        if (state !== 1) {
                            player.playVideo(); // Resume from saved position
                        }
                    }).catch(() => {
                        // Fallback if getPlayerState fails
                        player.playVideo();
                    });
                } else {
                    player.pauseVideo(); // Pause and save current position
                }
            }
        }
    });
}

/**
 * Initialize all carousels on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.carousel-container').forEach(carousel => {
        initCarousel(carousel.id);
    });
});

/**
 * Keyboard navigation support
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const direction = e.key === 'ArrowLeft' ? -1 : 1;
        
        // Find carousel currently in viewport
        Object.keys(carousels).forEach(carouselId => {
            const element = document.getElementById(carouselId);
            if (element) {
                const rect = element.getBoundingClientRect();
                // Check if carousel is in upper half of viewport
                if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                    moveCarousel(carouselId, direction);
                }
            }
        });
    }
});