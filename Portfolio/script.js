document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const likesCount = document.getElementById('likes-count');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const likeBtn = document.querySelector('.like-btn');
    
    let currentIndex = 0;
    let images = [];
    let touchStartX = 0;
    let touchEndX = 0;

    // Dynamic image loader
    async function fetchImages() {
        try {
            const response = await fetch('/GaleryImages/');
            const text = await response.text();
            const parser = new DOMParser();
            const html = parser.parseFromString(text, 'text/html');
            return Array.from(html.querySelectorAll('a'))
                .filter(a => a.href.match(/\.(jpe?g|png|webp)$/i))
                .map(a => a.href.replace(window.location.origin, ''));
        } catch (error) {
            console.error('Error fetching images:', error);
            return [];
        }
    }

    // Load gallery images with loading indicator
    async function loadGallery() {
        showLoading(true);
        
        const imageFiles = await fetchImages();
        gallery.innerHTML = '';
        
        imageFiles.forEach((src, index) => {
            const imgName = src.split('/').pop().split('.')[0];
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = imgName;
            img.loading = 'lazy';
            
            item.appendChild(img);
            gallery.appendChild(item);
            
            img.addEventListener('click', () => openLightbox(index));
        });
        
        images = imageFiles;
    }

    // Lightbox functions
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        updateLikesDisplay();
        document.addEventListener('keydown', handleKeyPress);
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.removeEventListener('keydown', handleKeyPress);
    }

    function updateLightboxImage() {
        lightboxImage.src = images[currentIndex];
        lightboxImage.alt = images[currentIndex].split('/').pop().split('.')[0];
    }

    // Navigation
    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxImage();
        updateLikesDisplay();
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxImage();
        updateLikesDisplay();
    }

    // Likes functionality
    function getLikes() {
        return JSON.parse(localStorage.getItem('imageLikes') || '{}');
    }

    function updateLikesDisplay() {
        const likes = getLikes();
        const currentImage = images[currentIndex];
        likesCount.textContent = likes[currentImage] || 0;
        likeBtn.classList.toggle('active', !!likes[currentImage]);
    }

    function handleLike() {
        const likes = getLikes();
        const currentImage = images[currentIndex];
        likes[currentImage] = likes[currentImage] ? 0 : 1;
        localStorage.setItem('imageLikes', JSON.stringify(likes));
        updateLikesDisplay();
    }

    // Event handlers
    function handleKeyPress(e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    }

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? showNext() : showPrev();
        }
    }

    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    likeBtn.addEventListener('click', handleLike);
    
    lightbox.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    // Loading indicator
    function showLoading(show) {
        const loader = document.getElementById('loading-indicator');
        if (loader) {
            loader.style.display = show ? 'flex' : 'none';
        }
    }

    // Initialize gallery
    loadGallery();

    // Auto-refresh every 5 minutes
    setInterval(() => {
        loadGallery();
    }, 300000);
});
