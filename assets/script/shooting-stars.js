/**
 * =============================================================================
 * Shooting Stars Controller
 * =============================================================================
 * 
 * Controla a animação das estrelas cadentes no header do portfólio.
 * Garante que apenas uma estrela caia por vez, em ordem alternada.
 * 
 * Sistema de 5 estrelas que caem em sequência alternada.
 * =============================================================================
 */

// Variáveis globais
let currentStar = 1;
const ANIMATION_DURATION = 3500; // 3.5 segundos
const PAUSE_BETWEEN_STARS = 4000; // 4 segundos
const INITIAL_DELAY = 3000; // 3 segundos
const TOTAL_STARS = 5; // Total de estrelas cadentes

// Cache dos elementos (evita múltiplas consultas ao DOM)
let cachedElements = null;

/**
 * Inicializa e armazena referências dos elementos
 */
function cacheElements() {
    if (cachedElements) return cachedElements;
    
    cachedElements = {
        header: document.querySelector('header'),
        stars: [
            null, // Index 0 não usado (estrelas começam de 1)
            document.querySelector('header'), // Estrela 1 usa ::before do header
            document.querySelector('.shooting-star-2'),
            document.querySelector('.shooting-star-3'),
            document.querySelector('.shooting-star-4'),
            document.querySelector('.shooting-star-5')
        ]
    };
    
    return cachedElements;
}

/**
 * Anima uma estrela cadente
 */
function animateShootingStar(starNumber) {
    const elements = cacheElements();
    
    if (!elements.header) return;
    
    // Verifica se está no modo escuro
    if (document.body.getAttribute('data-theme') !== 'dark') {
        setTimeout(() => animateShootingStar(starNumber), 1000);
        return;
    }
    
    // Pega o elemento e classe correspondente
    const element = elements.stars[starNumber];
    const className = `shooting-star-${starNumber}-active`;
    
    if (!element) return;
    
    // Adiciona classe para animar
    element.classList.add(className);
    
    // Remove após animação terminar e agenda a próxima estrela
    setTimeout(() => {
        element.classList.remove(className);
        
        setTimeout(() => {
            currentStar = (currentStar % TOTAL_STARS) + 1; // Cicla de 1 a 5
            animateShootingStar(currentStar);
        }, PAUSE_BETWEEN_STARS);
    }, ANIMATION_DURATION);
}

/**
 * Inicializa o sistema de estrelas cadentes
 */
function initShootingStars() {
    const elements = cacheElements();
    if (!elements.header) return;
    
    // Aguarda delay inicial e inicia
    setTimeout(() => {
        animateShootingStar(1);
    }, INITIAL_DELAY);
}

// Aguarda DOM estar pronto antes de inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initShootingStars, 500);
    });
} else {
    setTimeout(initShootingStars, 500);
}


