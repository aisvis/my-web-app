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

    // Static image list with error handling
    async function fetchImages() {
        try {
            // Explicit list of image paths
            return [
                'GaleryImages/Gost_CShading_Beauty_View18.jpg',
                'GaleryImages/Gost_CShading_Beauty_View53.jpg',
                'GaleryImages/Kipr_CShading_Beauty_View520000.jpg',
                'GaleryImages/Kuhnya-Gostinay_CShading_Beauty_View17.jpg',
                'GaleryImages/SR2_View09.jpg',
                'GaleryImages/TauHouse (11).jpg'
            ];
        } catch (error) {
            console.error('Error loading images:', error);
            showLoading(false);
            return [];
        }
    }

    // Load gallery images with loading indicator
    async function loadGallery() {
        if (!gallery) {
            console.error('Gallery element not found');
            showLoading(false);
            return;
        }
        
        try {
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
        } catch (error) {
            console.error('Error loading gallery:', error);
        } finally {
            showLoading(false);
        }
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
