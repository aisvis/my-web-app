// Лайтбокс
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.querySelector('.lightbox-content');
const lightboxCaption = document.querySelector('.lightbox-caption');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentIndex = 0;
const images = document.querySelectorAll('.gallery-image');
const captions = document.querySelectorAll('.caption');

// Открытие лайтбокса
images.forEach((img, index) => {
  img.addEventListener('click', () => {
    currentIndex = index;
    openLightbox();
  });
});

function openLightbox() {
  lightbox.style.display = 'flex';
  updateLightbox();
}

function updateLightbox() {
  lightboxContent.src = images[currentIndex].src;
  lightboxCaption.textContent = captions[currentIndex].textContent;
}

// Закрытие лайтбокса
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

// Навигация (вперед/назад)
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateLightbox();
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateLightbox();
});

// Закрытие по клику вне изображения
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
  }
});
