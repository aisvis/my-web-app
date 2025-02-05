// script.js
const carousel = document.querySelector('.carousel');
let isDragging = false;
let startX, startScrollLeft;

// Перемещение карусели
function moveCarousel(direction) {
    const cardWidth = carousel.querySelector('.card').offsetWidth + 10; // Ширина карточки + отступ
    if (direction === 'next') {
        carousel.scrollLeft += cardWidth * 3; // Листаем три карточки
    } else if (direction === 'prev') {
        carousel.scrollLeft -= cardWidth * 3;
    }
}

// Обработка нажатия клавиш
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') moveCarousel('next');
    if (e.key === 'ArrowLeft') moveCarousel('prev');
});

// Обработка перетаскивания мышью
carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
});

carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX) * 2; // Скорость перетаскивания
    carousel.scrollLeft = startScrollLeft - walk;
});

carousel.addEventListener('mouseup', () => {
    isDragging = false;
});

carousel.addEventListener('mouseleave', () => {
    isDragging = false;
});

// Обработка свайпа
let touchStartX = 0;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
});

carousel.addEventListener('touchmove', (e) => {
    if (!touchStartX) return;
    const touchEndX = e.touches[0].pageX;
    const deltaX = touchStartX - touchEndX;
    carousel.scrollLeft += deltaX * 2; // Скорость свайпа
    touchStartX = touchEndX;
});

carousel.addEventListener('touchend', () => {
    touchStartX = 0;
});
