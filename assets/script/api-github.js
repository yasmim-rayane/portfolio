/*
    TO DO: Fetch GitHub repositories and display them on the portfolio page

    - Use GitHub API to get repository data
        - Repository name
        - Description
        - URL
        - Languages/technologies used
        - Last updated date

    - Change classes on HTML and CSS styles accordingly
        - Card layout for each project
        - Title layout
        - Description layout
        - Link to GitHub repository
        - Languages/technologies used
        - Last updated date

    Notice that the cache is being used for the entire page, which may affect the freshness of the data.
    Consider implementing a strategy to refresh the GitHub data periodically if needed.

    Probably, set an expiration time for the cached data and refetch from the API when the data is stale.
*/

async function getProjects() {
    const url = 'https://api.github.com/users/yasmim-rayane/repos?sort=updated&direction=desc';
    const projectContainer = document.querySelector('.projects-container');

    try {
        const response = await fetch(url);
        const projects = await response.json();

        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');
            projectCard.innerHTML = `
                <a href="${project.html_url}" target="_blank" class="project-title">${project.name}</a>
                <p class="project-description">${project.description || 'No description available.'}</p>
                <p class="project-updated">Last updated: ${new Date(project.updated_at).toLocaleDateString()}</p>
            `;
            projectContainer.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
    }
}

getProjects();