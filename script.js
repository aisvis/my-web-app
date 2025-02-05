// script.js
const carousel = document.querySelector('.carousel');
const cards = document.querySelectorAll('.card');
const cardWidth = carousel.offsetWidth / 3; // Ширина одной карточки
let currentIndex = 0;

function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    // Добавляем класс 'center' для центральной карточки
    cards.forEach((card, index) => {
        card.classList.toggle('center', index === currentIndex + 1);
    });
}

// Листание вправо/влево
function moveCarousel(direction) {
    if (direction === 'next') {
        if (currentIndex < cards.length - 3) {
            currentIndex++;
        } else {
            currentIndex = 0; // Зацикливание
        }
    } else if (direction === 'prev') {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = cards.length - 3; // Зацикливание
        }
    }
    updateCarousel();
}

// Поддержка клавиш на клавиатуре
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') moveCarousel('next');
    if (e.key === 'ArrowLeft') moveCarousel('prev');
});

// Поддержка свайпов
let startX = 0;
carouselContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

carouselContainer.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    if (endX < startX - 50) moveCarousel('next'); // Свайп влево
    if (endX > startX + 50) moveCarousel('prev'); // Свайп вправо
});

// Инициализация
updateCarousel();
