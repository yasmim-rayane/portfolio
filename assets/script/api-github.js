/**
 * =============================================================================
 * GitHub API Integration Module
 * =============================================================================
 * 
 * Este módulo gerencia a integração com a API do GitHub para exibir 
 * automaticamente os repositórios mais recentes no portfólio.
 * 
 * Funcionalidades principais:
 * - Busca os 5 repositórios mais recentes da API do GitHub
 * - Exibe nome, descrição, linguagem principal e ano de atualização
 * - Utiliza as classes CSS existentes para manter consistência visual
 * - Implementa sistema de cache com expiração de 1 hora para reduzir requisições
 * - Fornece fallback com dados em cache expirado em caso de falha na API
 * 
 * Sistema de Cache:
 * - Armazena dados no localStorage do navegador
 * - Expira automaticamente após 1 hora
 * - Reduz requisições à API de centenas para apenas 1 por hora
 * - Melhora performance e experiência do usuário
 * =============================================================================
 */

// ============================================================================
// CONSTANTES DE CONFIGURAÇÃO
// ============================================================================

/**
 * Chave para armazenar os dados dos repositórios no localStorage
 * @constant {string}
 */
const GITHUB_CACHE_KEY = 'github_repos_cache';

/**
 * Chave para armazenar o timestamp da última atualização do cache
 * @constant {string}
 */
const GITHUB_CACHE_TIMESTAMP_KEY = 'github_repos_timestamp';

/**
 * Tempo de expiração do cache em milissegundos (1 hora = 3.600.000 ms)
 * Após este período, os dados serão buscados novamente da API
 * @constant {number}
 */
const CACHE_EXPIRATION_MS = 60 * 60 * 1000; // 1 hora em milissegundos

// ============================================================================
// FUNÇÕES DE GERENCIAMENTO DE CACHE
// ============================================================================

/**
 * Verifica se os dados em cache ainda são válidos
 * 
 * A validação é feita comparando o tempo atual com o timestamp armazenado.
 * Se a diferença for menor que CACHE_EXPIRATION_MS, o cache é considerado válido.
 * 
 * @returns {boolean} true se o cache é válido, false caso contrário
 */
function isCacheValid() {
    // Busca o timestamp da última atualização do cache
    const timestamp = localStorage.getItem(GITHUB_CACHE_TIMESTAMP_KEY);
    
    // Se não houver timestamp, o cache não existe ou é inválido
    if (!timestamp) return false;
    
    // Calcula a idade do cache (tempo desde a última atualização)
    const now = Date.now();
    const cacheAge = now - parseInt(timestamp, 10);
    
    // Retorna true se o cache ainda está dentro do período de validade
    return cacheAge < CACHE_EXPIRATION_MS;
}

/**
 * Obtém os dados em cache se estiverem disponíveis e válidos
 * 
 * Esta função verifica primeiro se o cache é válido. Se não for,
 * remove os dados expirados e retorna null. Se for válido, tenta
 * fazer o parse dos dados JSON armazenados.
 * 
 * @returns {Array|null} Array de repositórios ou null se cache inválido/inexistente
 */
function getCachedData() {
    // Verifica se o cache ainda é válido
    if (!isCacheValid()) {
        // Cache expirado - remove os dados antigos para economizar espaço
        localStorage.removeItem(GITHUB_CACHE_KEY);
        localStorage.removeItem(GITHUB_CACHE_TIMESTAMP_KEY);
        return null;
    }
    
    // Busca os dados em cache
    const cached = localStorage.getItem(GITHUB_CACHE_KEY);
    if (!cached) return null;
    
    // Tenta fazer o parse do JSON
    try {
        return JSON.parse(cached);
    } catch (error) {
        // Se houver erro no parse, loga e retorna null
        console.error('Error parsing cached data:', error);
        return null;
    }
}

/**
 * Salva os dados dos repositórios no cache
 * 
 * Armazena tanto os dados quanto o timestamp atual no localStorage.
 * Usa try-catch para lidar com possíveis erros (ex: limite de armazenamento).
 * 
 * @param {Array} data - Array de objetos de repositórios do GitHub
 */
function setCacheData(data) {
    try {
        // Converte os dados para JSON e armazena no localStorage
        localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify(data));
        
        // Armazena o timestamp atual para controlar a expiração
        localStorage.setItem(GITHUB_CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
        // Loga erros (ex: quota excedida do localStorage)
        console.error('Error saving to cache:', error);
    }
}

// ============================================================================
// FUNÇÕES DE REQUISIÇÃO À API
// ============================================================================

/**
 * Busca repositórios do GitHub (via API ou cache)
 * 
 * Implementa a lógica de cache-first:
 * 1. Tenta obter dados do cache válido
 * 2. Se não houver cache válido, faz requisição à API
 * 3. Salva os dados da API no cache para uso futuro
 * 
 * URL da API: https://api.github.com/users/yasmim-rayane/repos
 * Parâmetros:
 * - sort=updated: ordena por data de atualização
 * - direction=desc: ordem decrescente (mais recentes primeiro)
 * - per_page=5: limita a 5 repositórios
 * 
 * @async
 * @returns {Promise<Array>} Promise que resolve com array de repositórios
 * @throws {Error} Se a requisição à API falhar
 */
async function fetchGitHubRepos() {
    // ETAPA 1: Tenta usar dados em cache
    const cachedData = getCachedData();
    if (cachedData) {
        console.info('[GitHub API] Using cached data');
        return cachedData;
    }
    
    // ETAPA 2: Cache inválido/inexistente - busca dados da API
    console.info('[GitHub API] Fetching fresh data from API');
    
    // Monta a URL com parâmetros para obter os 5 repositórios mais recentes
    const url = 'https://api.github.com/users/yasmim-rayane/repos?sort=updated&direction=desc&per_page=5';
    
    // Faz a requisição à API do GitHub
    const response = await fetch(url);
    
    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }
    
    // Converte a resposta para JSON
    const projects = await response.json();
    
    // ETAPA 3: Salva os dados no cache para uso futuro
    setCacheData(projects);
    
    return projects;
}

// ============================================================================
// FUNÇÕES DE RENDERIZAÇÃO
// ============================================================================

/**
 * Exibe os repositórios do GitHub na página
 * 
 * Esta função cria elementos HTML dinamicamente para cada repositório e
 * os insere na lista de projetos existente. Mantém a mesma estrutura e
 * classes CSS dos projetos manuais para consistência visual.
 * 
 * Formatação aplicada:
 * - Nome: converte de kebab-case para Title Case (ex: "todo-list" → "Todo List")
 * - Descrição: usa a descrição do repositório ou mensagem padrão
 * - Linguagem: exibe a linguagem principal do projeto
 * - Data: exibe apenas o ano da última atualização
 * 
 * @param {Array} projects - Array de objetos de repositórios do GitHub
 */
function displayProjects(projects) {
    // Busca o container da lista de projetos no DOM
    const projectList = document.querySelector('#projects .project-list');

    // Verifica se o container existe
    if (!projectList) {
        console.error('Project list container not found');
        return;
    }

    // Limpa qualquer conteúdo existente (importante para recarregamentos)
    projectList.innerHTML = '';
    
    // Garante que apenas os 5 primeiros repositórios sejam exibidos
    const recentProjects = projects.slice(0, 5);

    // Itera sobre cada repositório para criar os elementos HTML
    recentProjects.forEach(project => {
        // Cria o elemento <li> para o projeto
        const listItem = document.createElement('li');
        listItem.classList.add('mb-4'); // Classe Bootstrap para margem inferior
        
        // Obtém a linguagem principal (ou 'N/A' se não disponível)
        const language = project.language || 'N/A';
        
        // Extrai apenas o ano da data de atualização
        const updateDate = new Date(project.updated_at).getFullYear();
        
        // Formata o nome do repositório de kebab-case para Title Case
        // Ex: "todo-list" → ["todo", "list"] → ["Todo", "List"] → "Todo List"
        const displayName = project.name
            .split('-')                                    // Divide por hífens
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza
            .join(' ');                                    // Junta com espaços
        
        // Constrói o HTML do item usando template literals
        // Mantém a mesma estrutura dos projetos manuais para consistência
        listItem.innerHTML = `
            <a class="project-title" rel="noopener noreferrer"
                href="${project.html_url}" target="_blank">
                ${displayName}
            </a>
            <div class="project-description">
                ${project.description || 'No description available.'}
            </div>
            <div>
                ${language !== 'N/A' ? `<span class="under-project">${language}</span>` : ''}
                <span class="under-project">${updateDate}</span>
            </div>
        `;
        
        // Adiciona o item à lista de projetos no DOM
        projectList.appendChild(listItem);
    });
}

// ============================================================================
// FUNÇÃO PRINCIPAL E INICIALIZAÇÃO
// ============================================================================

/**
 * Função principal que coordena a busca e exibição dos projetos
 * 
 * Fluxo de execução:
 * 1. Tenta buscar repositórios (cache ou API)
 * 2. Exibe os repositórios na página
 * 3. Em caso de erro:
 *    a. Tenta usar cache expirado como fallback
 *    b. Se não houver cache, exibe mensagem de erro ao usuário
 * 
 * Esta função implementa uma estratégia de fallback em camadas para
 * garantir a melhor experiência possível ao usuário.
 * 
 * @async
 */
async function getGitHubProjects() {
    try {
        // Tenta buscar e exibir os projetos
        const projects = await fetchGitHubRepos();
        displayProjects(projects);
        
    } catch (error) {
        // Loga o erro para debugging
        console.error('Error fetching GitHub projects:', error);
        
        // FALLBACK 1: Tenta usar cache expirado
        // Mesmo que o cache tenha expirado, é melhor mostrar dados antigos
        // do que nenhum dado, especialmente em caso de falha na API
        const cachedData = localStorage.getItem(GITHUB_CACHE_KEY);
        if (cachedData) {
            try {
                const projects = JSON.parse(cachedData);
                console.info('[GitHub API] Using expired cache as fallback');
                displayProjects(projects);
                return; // Sucesso com fallback - sai da função
            } catch (e) {
                // Se houver erro no parse, continua para o próximo fallback
            }
        }
        
        // FALLBACK 2: Exibe mensagem de erro ao usuário
        // Só chega aqui se não houver cache disponível
        const projectList = document.querySelector('#projects .project-list');
        if (projectList) {
            const errorItem = document.createElement('li');
            errorItem.classList.add('mb-4');
            errorItem.innerHTML = `
                <div class="project-description" style="color: var(--text-muted);">
                    Unable to load GitHub projects. Please try again later.
                </div>
            `;
            projectList.appendChild(errorItem);
        }
    }
}

// ============================================================================
// INICIALIZAÇÃO DO MÓDULO
// ============================================================================

/**
 * Garante que o código seja executado apenas após o DOM estar totalmente carregado
 * 
 * Este bloco verifica o estado de carregamento do documento:
 * - Se ainda está carregando: aguarda o evento DOMContentLoaded
 * - Se já carregou: executa imediatamente
 * 
 * Isso evita erros ao tentar manipular elementos que ainda não existem no DOM.
 */
if (document.readyState === 'loading') {
    // DOM ainda não carregou - aguarda evento
    document.addEventListener('DOMContentLoaded', getGitHubProjects);
} else {
    // DOM já carregado - executa imediatamente
    getGitHubProjects();
}