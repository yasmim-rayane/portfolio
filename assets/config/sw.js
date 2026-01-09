/**
 * =============================================================================
 * Service Worker - Cache Strategy
 * =============================================================================
 * 
 * Service Worker para gerenciamento de cache offline do portfólio.
 * Implementa uma estratégia de "Cache-First" para assets estáticos,
 * melhorando significativamente a performance e permitindo funcionamento offline.
 * 
 * Estratégia de Cache:
 * 1. Verifica se o recurso está no cache
 * 2. Se estiver, retorna imediatamente (rápido!)
 * 3. Se não estiver, busca da rede e cacheia para uso futuro
 * 4. Em caso de falha de rede, tenta fallback para index.html
 * 
 * Ciclo de Vida:
 * - install: baixa e cacheia assets estáticos
 * - activate: limpa caches antigos
 * - fetch: intercepta requisições e serve do cache quando possível
 * =============================================================================
 */

// ============================================================================
// CONFIGURAÇÃO DO CACHE
// ============================================================================

/**
 * Nome da versão do cache
 * IMPORTANTE: Incremente a versão quando houver mudanças nos assets para forçar
 * atualização do cache em todos os clientes
 * 
 * @constant {string}
 */
const CACHE_NAME = 'portfolio-static-v1';

/**
 * Lista de assets estáticos para pré-cache
 * 
 * Estes arquivos são baixados e armazenados durante a instalação do Service Worker,
 * garantindo que estejam disponíveis offline desde o início.
 * 
 * Incluídos:
 * - Página principal (index.html)
 * - Folhas de estilo (CSS)
 * - Scripts JavaScript
 * - Ícones e imagens essenciais
 * 
 * @constant {Array<string>}
 */
const STATIC_ASSETS = [
    'index.html',
    'assets/css/style.css',
    'assets/css/translation.css',
    'assets/script/script.js',
    'assets/script/translation.js',
    'assets/script/theme.js',
    'assets/script/api-github.js',
    'assets/images/Rainbow Marble.ico',
    'assets/images/icons/usa-flag.svg',
    'assets/images/icons/brazil-flag.png',
    'assets/images/icons/dark-mode-icon.svg'
];

// ============================================================================
// EVENTO: INSTALL
// ============================================================================

/**
 * Evento de instalação do Service Worker
 * 
 * Executado quando o Service Worker é instalado pela primeira vez ou
 * quando uma nova versão é detectada. Esta fase é ideal para pré-cachear
 * assets críticos.
 * 
 * Processo:
 * 1. skipWaiting() - ativa o novo Service Worker imediatamente
 * 2. Abre o cache com o nome definido em CACHE_NAME
 * 3. Adiciona todos os assets da lista STATIC_ASSETS ao cache
 * 
 * @param {ExtendableEvent} e - Evento de instalação
 */
self.addEventListener('install', e => {
    // Ativa o novo Service Worker imediatamente, sem esperar
    // que as abas antigas sejam fechadas
    self.skipWaiting();
    
    // waitUntil garante que o Service Worker não seja considerado instalado
    // até que todo o cache seja concluído
    e.waitUntil(
        caches.open(CACHE_NAME)              // Abre (ou cria) o cache
            .then(c => c.addAll(STATIC_ASSETS)) // Adiciona todos os assets
    );
});

// ============================================================================
// EVENTO: ACTIVATE
// ============================================================================

/**
 * Evento de ativação do Service Worker
 * 
 * Executado quando o Service Worker se torna ativo. Esta fase é ideal
 * para limpeza de caches antigos, garantindo que apenas a versão atual
 * dos assets seja mantida.
 * 
 * Processo:
 * 1. Lista todas as chaves de cache existentes
 * 2. Filtra caches que não correspondem ao CACHE_NAME atual
 * 3. Deleta caches antigos
 * 4. Assume controle de todas as páginas abertas imediatamente
 * 
 * @param {ExtendableEvent} e - Evento de ativação
 */
self.addEventListener('activate', e => {
    e.waitUntil(
        // Obtém todas as chaves de cache
        caches.keys().then(keys =>
            Promise.all(
                // Para cada chave que não seja a atual, deleta o cache
                keys
                    .filter(k => k !== CACHE_NAME)  // Filtra caches antigos
                    .map(k => caches.delete(k))     // Deleta cada cache antigo
            )
        )
        // Assume controle imediato de todas as páginas
        // Sem isso, o SW só controlaria páginas abertas após refresh
        .then(() => self.clients.claim())
    );
});

// ============================================================================
// EVENTO: FETCH
// ============================================================================

/**
 * Evento de interceptação de requisições
 * 
 * Intercepta TODAS as requisições de rede feitas pela aplicação e
 * implementa a estratégia de cache. Este é o coração do Service Worker.
 * 
 * Estratégia implementada: Cache-First
 * 1. Busca no cache primeiro
 * 2. Se encontrar, retorna imediatamente (super rápido!)
 * 3. Se não encontrar, busca da rede
 * 4. Cacheia a resposta da rede para uso futuro (apenas assets estáticos)
 * 5. Em caso de falha, tenta fallback para index.html
 * 
 * Filtros aplicados:
 * - Apenas requisições GET são cacheadas
 * - Apenas requisições do mesmo origin são cacheadas
 * - Apenas tipos de arquivo específicos são cacheados dinamicamente
 * 
 * @param {FetchEvent} e - Evento de fetch
 */
self.addEventListener('fetch', e => {
    const req = e.request;
    
    // Ignora requisições que não sejam GET ou de origem diferente
    // Requisições POST/PUT/DELETE não devem ser cacheadas
    // Requisições externas (APIs, CDNs) também não
    if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
    
    // respondWith permite interceptar e customizar a resposta
    e.respondWith(
        // ETAPA 1: Busca no cache
        caches.match(req).then(cached => {
            // Se encontrou no cache, retorna imediatamente
            if (cached) return cached;
            
            // ETAPA 2: Não está no cache - busca da rede
            return fetch(req).then(res => {
                // Clona a resposta pois ela só pode ser lida uma vez
                const copy = res.clone();
                
                // ETAPA 3: Cacheia apenas tipos de arquivo estáticos
                // Regex: verifica se a URL termina com extensões de assets estáticos
                if (/\.(css|js|png|svg|ico|jpg|jpeg|webp)$/.test(req.url)) {
                    // Adiciona ao cache de forma assíncrona (não bloqueia a resposta)
                    caches.open(CACHE_NAME).then(c => c.put(req, copy));
                }
                
                // Retorna a resposta da rede ao cliente
                return res;
                
            }).catch(() => 
                // ETAPA 4: Fallback - se a rede falhar e não houver cache,
                // tenta retornar a página principal (útil para SPAs)
                caches.match('index.html')
            );
        })
    );
});
