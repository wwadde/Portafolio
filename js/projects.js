const projects = [
    {
        title: "Simulacion credito bancario",
        description: "Aplicacion web en microservicios con descubrimiento de servicios, autenticacion y autorizacion, y frontend en Angular.",
        technologies: ["Java", "Springboot", "PostgreSQL", "Angular", "Docker"],
        link: "https://github.com/wwadde/simulacion-credito-bancario"
    },
    {
        title: "Cobranza",
        description: "Aplicacion web para gestionar préstamos con roles de administrador y cobrador, visualización de estadísticas, generación de reportes y monitoreo de métricas.",
        technologies: ["Java", "Springboot", "PostgreSQL", "Docker", "JavaScript", "TailwindCSS", "JasperReports", "Prometheus", "Grafana", "JTE", "JUnit", "Mockito"],
        link: "https://cobranza.work"
    },
];

function displayProjects() {
    const projectsContainer = document.getElementById('projects-container');
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.classList.add('project');

        projectElement.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
            <a href="${project.link}" target="_blank">View Project</a>
        `;

        projectsContainer.appendChild(projectElement);
    });
}
