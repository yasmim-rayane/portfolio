/**
 * =============================================================================
 * Portfolio Main Script
 * =============================================================================
 * 
 * Este é o arquivo principal de scripts do portfólio. Ele gerencia:
 * - Carregamento inicial da página (loader de primeira visita)
 * - Atualização automática do ano no rodapé
 * - Banner de status offline/online
 * - Registro do Service Worker para cache
 * - Inicialização dos módulos de tema e tradução
 * 
 * Módulos importados:
 * - translation.js: Sistema de internacionalização (PT/EN)
 * - theme.js: Sistema de alternância entre tema claro/escuro
 * =============================================================================
 */

// ============================================================================
// IMPORTAÇÃO DE MÓDULOS
// ============================================================================

// Importa o sistema de tradução (auto-inicializa internamente)
import './translation.js';

// Importa o sistema de tema (auto-inicializa internamente)
import './theme.js';

// Log de versão para debugging
console.info('[app] scripts loaded v3');

// ============================================================================
// LOADER DE PRIMEIRA VISITA
// ============================================================================

/**
 * Flag para evitar múltiplas inicializações do loader
 * @type {boolean}
 */
let __loaderInit = false;

/**
 * Inicializa o loader de primeira visita
 * 
 * Exibe uma animação de carregamento apenas na primeira vez que o usuário
 * visita o site (verificado via localStorage). Melhora a percepção de
 * qualidade e profissionalismo da aplicação.
 * 
 * Comportamento:
 * - Primeira visita: exibe loader por 1.2 segundos
 * - Visitas subsequentes: remove o loader imediatamente
 * - Bloqueia scroll durante a exibição do loader
 * 
 * @returns {void}
 */
function initLoader() {
    // Previne múltiplas execuções
    if (__loaderInit) return;
    __loaderInit = true;
    
    // Busca o elemento do loader no DOM
    const loader = document.getElementById('page-initial-loader');
    if (!loader) return;
    
    // Verifica se é a primeira visita (não existe chave 'visitedSite' no localStorage)
    const firstVisit = !localStorage.getItem('visitedSite');
    
    if (firstVisit) {
        // PRIMEIRA VISITA: Exibe o loader
        
        // Bloqueia o scroll da página durante o loader
        document.body.classList.add('no-scroll');
        
        // Remove a classe 'hidden' e torna o loader visível
        loader.classList.remove('hidden');
        loader.style.display = 'flex';
        
        // Após 1.2 segundos, esconde o loader
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
            
            // Marca que o site foi visitado
            localStorage.setItem('visitedSite', '1');
            
            // Remove o elemento do DOM após animação (600ms)
            setTimeout(() => loader.remove(), 600);
        }, 1200);
    } else {
        // VISITAS SUBSEQUENTES: Remove o loader imediatamente
        loader.remove();
    }
}

// ============================================================================
// ATUALIZAÇÃO DO ANO NO RODAPÉ
// ============================================================================

/**
 * Atualiza o ano no rodapé automaticamente
 * 
 * Busca o elemento do rodapé e substitui qualquer ano de 4 dígitos
 * pelo ano atual. Garante que o copyright sempre esteja atualizado
 * sem necessidade de manutenção manual.
 * 
 * Exemplo: "© 0123 Yasmim Rayane" → "© 2026 Yasmim Rayane"
 * 
 * @returns {void}
 */
function updateYear() {
    // Busca o elemento do rodapé pelo atributo data-i18n-html
    const el = document.querySelector('[data-i18n-html="footer"]');
    if (!el) return;
    
    // Obtém o ano atual
    const current = new Date().getFullYear();
    
    // Substitui qualquer número de 4 dígitos pelo ano atual
    // Regex: \b\d{4}\b - procura por 4 dígitos consecutivos entre word boundaries
    el.innerHTML = el.innerHTML.replace(/\b\d{4}\b/, current);
}

// ============================================================================
// BANNER DE STATUS OFFLINE
// ============================================================================

/**
 * Atualiza a visibilidade do banner de status offline
 * 
 * Mostra um banner fixo no topo da página quando o usuário perde
 * conexão com a internet. Fornece feedback visual importante sobre
 * o estado da conectividade.
 * 
 * Estados:
 * - Online: banner oculto (display: none)
 * - Offline: banner visível com mensagem de aviso
 * 
 * @returns {void}
 */
function updateOfflineBanner() {
    // Busca o elemento do banner no DOM
    const banner = document.getElementById('offline-banner');
    if (!banner) return;
    
    // Mostra ou oculta baseado no estado de conexão
    // navigator.onLine retorna true se conectado, false se offline
    banner.style.display = navigator.onLine ? 'none' : 'block';
}

// ============================================================================
// SERVICE WORKER
// ============================================================================

/**
 * Registra o Service Worker para cache offline
 * 
 * Service Workers permitem que a aplicação funcione offline,
 * carregue mais rápido e forneça uma experiência semelhante a apps nativos.
 * 
 * O Service Worker (sw.js) gerencia:
 * - Cache de arquivos estáticos (HTML, CSS, JS, imagens)
 * - Estratégia de fallback para modo offline
 * - Atualização de cache quando novos assets estão disponíveis
 * 
 * Compatibilidade: Só registra se o navegador suportar Service Workers
 * 
 * @returns {void}
 */
function registerSW() {
    // Verifica se o navegador suporta Service Workers
    if ('serviceWorker' in navigator) {
        // Registra o Service Worker
        // Erros são silenciosamente ignorados para não quebrar a aplicação
        navigator.serviceWorker.register('assets/config/sw.js').catch(() => {});
    }
}

// ============================================================================
// INICIALIZAÇÃO PRINCIPAL
// ============================================================================

/**
 * Função de boot que inicializa todos os sistemas
 * 
 * Esta função centraliza a inicialização de todos os componentes
 * principais da aplicação. É chamada tanto quando o DOM carrega
 * quanto imediatamente se o DOM já estiver carregado.
 * 
 * Ordem de inicialização:
 * 1. Loader de primeira visita
 * 2. Atualização do ano no rodapé
 * 3. Banner de status offline
 * 4. Service Worker
 * 
 * @returns {void}
 */
function boot() {
    initLoader();
    updateYear();
    updateOfflineBanner();
    registerSW();
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

/**
 * Inicializa quando o DOM estiver completamente carregado
 * Garante que todos os elementos existam antes de manipulá-los
 */
document.addEventListener('DOMContentLoaded', boot);

/**
 * Atualiza o ano após troca de idioma
 * O evento 'i18n:applied' é disparado pelo módulo translation.js
 * quando o idioma é alterado
 */
document.addEventListener('i18n:applied', updateYear);

/**
 * Mostra o banner quando a conexão for perdida
 * Escuta mudanças no estado de conectividade do navegador
 */
window.addEventListener('offline', updateOfflineBanner);

/**
 * Oculta o banner quando a conexão for restaurada
 * Escuta mudanças no estado de conectividade do navegador
 */
window.addEventListener('online', updateOfflineBanner);

// ============================================================================
// INICIALIZAÇÃO ANTECIPADA
// ============================================================================

/**
 * Tentativa de boot antecipado
 * 
 * Se o DOM já tiver sido carregado quando este script executar,
 * chama boot() imediatamente em vez de esperar pelo evento DOMContentLoaded.
 * 
 * Estados do document.readyState:
 * - 'loading': documento ainda carregando
 * - 'interactive': DOM carregado, recursos ainda carregando
 * - 'complete': tudo carregado
 */
if (document.readyState !== 'loading') boot();