/**
 * =============================================================================
 * Shooting Stars Controller
 * =============================================================================
 *
 * Controla a animação dos meteoros / estrelas cadentes no header do portfólio.
 * Garante que apenas um meteoro cruze o céu por vez, em ordem alternada,
 * respeitando o tema escuro e a preferência de movimento reduzido.
 * =============================================================================
 */

let currentStar = 1;
const ANIMATION_DURATION = 1500; // 1.5s (sincronizado com @keyframes meteorStreak)
const INITIAL_DELAY = 1800; // 1.8s após carregar
const TOTAL_STARS = 5;

let cachedElements = null;

function cacheElements() {
    if (cachedElements) return cachedElements;

    cachedElements = {
        header: document.querySelector('header'),
        stars: [
            null,
            document.querySelector('.shooting-star-1'),
            document.querySelector('.shooting-star-2'),
            document.querySelector('.shooting-star-3'),
            document.querySelector('.shooting-star-4'),
            document.querySelector('.shooting-star-5')
        ]
    };

    return cachedElements;
}

function getNextPauseDelay() {
    return 3200 + Math.floor(Math.random() * 2600);
}

function animateShootingStar(starNumber) {
    const elements = cacheElements();
    if (!elements.header) return;

    if (document.body.getAttribute('data-theme') !== 'dark') {
        setTimeout(() => animateShootingStar(starNumber), 1200);
        return;
    }

    const element = elements.stars[starNumber];
    const className = `shooting-star-${starNumber}-active`;

    if (!element) return;

    element.classList.add(className);

    setTimeout(() => {
        element.classList.remove(className);

        setTimeout(() => {
            currentStar = (currentStar % TOTAL_STARS) + 1;
            animateShootingStar(currentStar);
        }, getNextPauseDelay());
    }, ANIMATION_DURATION);
}

function initShootingStars() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const elements = cacheElements();
    if (!elements.header) return;

    setTimeout(() => {
        animateShootingStar(1);
    }, INITIAL_DELAY);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initShootingStars, 400);
    });
} else {
    setTimeout(initShootingStars, 400);
}
