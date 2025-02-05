// script.js
const carousel = document.querySelector('.carousel');
let currentIndex = 0;
const cardWidth = 320; // Ширина карточки + отступы
const totalCards = 10;

function moveCarousel(direction) {
    if (direction === 'next') {
        if (currentIndex < totalCards - 3) {
            currentIndex++;
        } else {
            currentIndex = 0; // Зацикливание
        }
    } else if (direction === 'prev') {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalCards - 3; // Зацикливание
        }
    }
    carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

// Добавляем кнопки для управления каруселью
document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.createElement('button');
    prevButton.innerText = '←';
    prevButton.style.position = 'absolute';
    prevButton.style.left = '10px';
    prevButton.style.top = '50%';
    prevButton.style.transform = 'translateY(-50%)';
    prevButton.style.zIndex = '10';
    prevButton.onclick = () => moveCarousel('prev');

    const nextButton = document.createElement('button');
    nextButton.innerText = '→';
    nextButton.style.position = 'absolute';
    nextButton.style.right = '10px';
    nextButton.style.top = '50%';
    nextButton.style.transform = 'translateY(-50%)';
    nextButton.style.zIndex = '10';
    nextButton.onclick = () => moveCarousel('next');

    document.querySelector('.carousel-container').appendChild(prevButton);
    document.querySelector('.carousel-container').appendChild(nextButton);
});
