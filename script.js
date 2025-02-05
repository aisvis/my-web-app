// script.js

// Функция для создания галереи
function createGallery() {
  const gallery = document.getElementById('gallery');
  const totalImages = 13; // Количество изображений

  for (let i = 1; i <= totalImages; i++) {
    const imageName = `Images/Image (${i}).jpg`; // Путь к изображению
    const captionText = `Название ${i}`; // Подпись к изображению

    // Создаем элемент галереи
    const galleryItem = document.createElement('div');
    galleryItem.classList.add('gallery-item');

    // Добавляем изображение
    const img = document.createElement('img');
    img.src = imageName;
    img.alt = captionText;
    img.classList.add('gallery-image');
    img.loading = 'lazy'; // Ленивая загрузка

    // Добавляем подпись
    const caption = document.createElement('div');
    caption.classList.add('caption');
    caption.textContent = captionText;

    // Собираем элемент
    galleryItem.appendChild(img);
    galleryItem.appendChild(caption);

    // Добавляем в галерею
    gallery.appendChild(galleryItem);
  }
}

// Инициализация галереи
document.addEventListener('DOMContentLoaded', () => {
  createGallery();

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
});
