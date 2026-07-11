import { animate } from "animejs";

const banner = `
██╗    ██╗██╗██╗     ██╗     ██╗ █████╗ ███╗   ███╗
██║    ██║██║██║     ██║     ██║██╔══██╗████╗ ████║
██║ █╗ ██║██║██║     ██║     ██║███████║██╔████╔██║
██║███╗██║██║██║     ██║     ██║██╔══██║██║╚██╔╝██║
╚███╔███╔╝██║███████╗███████╗██║██║  ██║██║ ╚═╝ ██║
 ╚══╝╚══╝ ╚═╝╚══════╝╚══════╝╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
                                                   
 :: William's Portfolio ::                (v4.0.7)`

const lines = [

    {
        timestamp: "2026-07-10 16:32:14",
        level: "INFO",
        color: "text-emerald-400",
        logger: "c.w.PortfolioApplication",
        text: "Starting PortfolioApplication using Java 25"
    },

    {
        timestamp: "2026-07-10 16:32:14",
        level: "INFO",
        color: "text-emerald-400",
        logger: "c.w.PortfolioApplication",
        text: 'The following profile is active: "production"'
    },

    {
        timestamp: "2026-07-10 16:32:15",
        level: "INFO",
        color: "text-emerald-400",
        logger: "o.s.d.r.c.RepositoryConfig",
        text: "Bootstrapping Spring Data JPA."
    },

    {
        timestamp: "2026-07-10 16:32:15",
        level: "INFO",
        color: "text-emerald-400",
        logger: "o.s.d.r.c.RepositoryConfig",
        text: "Finished Spring Data repository scanning in 86 ms."
    },

    {
        timestamp: "2026-07-10 16:32:15",
        level: "INFO",
        color: "text-emerald-400",
        logger: "com.zaxxer.hikari.HikariDataSource",
        text: "HikariPool-1 - Starting..."
    },

    {
        timestamp: "2026-07-10 16:32:15",
        level: "INFO",
        color: "text-emerald-400",
        logger: "com.zaxxer.hikari.HikariDataSource",
        text: "HikariPool-1 - Start completed."
    },

    {
        timestamp: "2026-07-10 16:32:16",
        level: "INFO",
        color: "text-emerald-400",
        logger: "o.s.b.w.e.tomcat.TomcatWebServer",
        text: "Tomcat initialized with port 8080 (http)"
    },

    {
        timestamp: "2026-07-10 16:32:16",
        level: "INFO",
        color: "text-emerald-400",
        logger: "o.a.coyote.http11.Http11NioProtocol",
        text: 'Initializing ProtocolHandler ["http-nio-8080"]'
    },

    {
        timestamp: "2026-07-10 16:32:16",
        level: "INFO",
        color: "text-emerald-400",
        logger: "o.a.catalina.core.StandardService",
        text: "Starting service [Tomcat]"
    },

    {
        timestamp: "2026-07-10 16:32:16",
        level: "INFO",
        color: "text-emerald-400",
        logger: "o.a.catalina.core.StandardEngine",
        text: "Starting Servlet engine: Apache Tomcat/11.0.11"
    },

    {
        timestamp: "2026-07-10 16:32:17",
        level: "INFO",
        color: "text-emerald-400",
        logger: "o.s.b.w.s.c.ServletWebServerApplicationContext",
        text: "Root WebApplicationContext initialized in 1638 ms"
    },

    {
        timestamp: "2026-07-10 16:32:18",
        level: "INFO",
        color: "text-emerald-400",
        logger: "c.w.PortfolioApplication",
        text: "Started PortfolioApplication in 1.84 seconds (JVM running for 2.31)"
    }
];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeLine(terminal, line) {

    const div = document.createElement("div");

    div.className =
        "font-mono text-[13px] leading-6 whitespace-pre text-neutral-300";

    terminal.appendChild(div);

    const timestamp =
        `<span class="text-neutral-500">${line.timestamp}</span> `;

    const level =
        `<span class="${line.color} font-semibold">${line.level}</span> `;

    const logger =
        `<span class="text-violet-300">${line.logger}</span> - `;

        div.innerHTML = timestamp + level + logger + line.text;
}

export async function showBootScreen() {

    const screen = document.querySelector("#boot-screen");
    const terminal = document.querySelector("#boot-terminal");

    if (!screen || !terminal) return;

    terminal.innerHTML = "";

    const bannerDiv = document.createElement("div");

    bannerDiv.className =
        "font-mono text-[13px] leading-6 whitespace-pre text-neutral-300";

    terminal.appendChild(bannerDiv);
    bannerDiv.innerHTML = banner;

    for (const line of lines) {

        await typeLine(terminal, line);

        await sleep(600);

    }

    await sleep(1000);

    await animate(screen, {
        opacity: 0,
        duration: 700
    }).finished;

    screen.remove();

    const hero = document.querySelector("#hero-content");

    hero.classList.remove("opacity-0");

    await animate(hero, {
        opacity: [0, 1],
        duration: 400
    }).finished;

    const steps = hero.querySelectorAll(".hero-step");

    for (const step of steps) {

        animate(step, {
            opacity: [0, 1],
            translateY: [25, 0],
            duration: 600,
            easing: "easeOutExpo"
        });

        await sleep(410);

    }

}