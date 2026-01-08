/**
 * Fetch GitHub repositories and display them on the portfolio page
 * 
 * Features:
 * - Fetches the 5 most recent repositories from GitHub API
 * - Displays repository name, description, languages, and last update date
 * - Uses existing project-list styling for consistency
 * - Implements cache with 1-day expiration to reduce API calls
 */

const GITHUB_CACHE_KEY = 'github_repos_cache';
const GITHUB_CACHE_TIMESTAMP_KEY = 'github_repos_timestamp';
const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds

/**
 * Check if cached data is still valid
 */
function isCacheValid() {
    const timestamp = localStorage.getItem(GITHUB_CACHE_TIMESTAMP_KEY);
    if (!timestamp) return false;
    
    const now = Date.now();
    const cacheAge = now - parseInt(timestamp, 10);
    
    return cacheAge < CACHE_EXPIRATION_MS;
}

/**
 * Get cached GitHub data if available and valid
 */
function getCachedData() {
    if (!isCacheValid()) {
        // Cache expired, clear it
        localStorage.removeItem(GITHUB_CACHE_KEY);
        localStorage.removeItem(GITHUB_CACHE_TIMESTAMP_KEY);
        return null;
    }
    
    const cached = localStorage.getItem(GITHUB_CACHE_KEY);
    if (!cached) return null;
    
    try {
        return JSON.parse(cached);
    } catch (error) {
        console.error('Error parsing cached data:', error);
        return null;
    }
}

/**
 * Save GitHub data to cache
 */
function setCacheData(data) {
    try {
        localStorage.setItem(GITHUB_CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(GITHUB_CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
        console.error('Error saving to cache:', error);
    }
}

/**
 * Fetch GitHub repositories from API or cache
 */
async function fetchGitHubRepos() {
    // Try to get from cache first
    const cachedData = getCachedData();
    if (cachedData) {
        console.info('[GitHub API] Using cached data');
        return cachedData;
    }
    
    // Fetch from API if cache is invalid or empty
    console.info('[GitHub API] Fetching fresh data from API');
    const url = 'https://api.github.com/users/yasmim-rayane/repos?sort=updated&direction=desc&per_page=5';
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const projects = await response.json();
    
    // Save to cache
    setCacheData(projects);
    
    return projects;
}

/**
 * Display GitHub projects on the page
 */
function displayProjects(projects) {
    const projectList = document.querySelector('#projects .project-list');

    if (!projectList) {
        console.error('Project list container not found');
        return;
    }

    // Clear existing content
    projectList.innerHTML = '';
    
    // Limit to 5 most recent projects
    const recentProjects = projects.slice(0, 5);

    recentProjects.forEach(project => {
        const listItem = document.createElement('li');
        listItem.classList.add('mb-4');
        
        // Get primary language or languages from topics
        const language = project.language || 'N/A';
        
        // Format the update date
        const updateDate = new Date(project.updated_at).getFullYear();
        
        // Clean up project name (replace hyphens with spaces and capitalize)
        const displayName = project.name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
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
        
        projectList.appendChild(listItem);
    });
}

/**
 * Main function to load and display GitHub projects
 */
async function getGitHubProjects() {
    try {
        const projects = await fetchGitHubRepos();
        displayProjects(projects);
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        
        // Try to display cached data even if expired as fallback
        const cachedData = localStorage.getItem(GITHUB_CACHE_KEY);
        if (cachedData) {
            try {
                const projects = JSON.parse(cachedData);
                console.info('[GitHub API] Using expired cache as fallback');
                displayProjects(projects);
                return;
            } catch (e) {
                // Ignore parse errors
            }
        }
        
        // Display error message to user only if no cache available
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

// Wait for DOM to be fully loaded before fetching projects
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', getGitHubProjects);
} else {
    getGitHubProjects();
}