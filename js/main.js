import { displayProjects } from './projects.js';
import { toggleLang, applyTranslations } from './i18n.js';
import { initSectionNavigation } from './sectionNavigation.js';
import { displayContactInfo, updateCV, initContactSection } from './contactSection.js';
import { initCodeEditor } from './editor.js';
import { showBootScreen, shouldShowBootScreen, markBootScreenAsShown, animateHero } from './terminal.js';

document.addEventListener('DOMContentLoaded', async function () {
    const langToggle = document.getElementById('lang-toggle');

    initContactSection();
    displayProjects();

    const { syncNavbarToScroll, observeRevealItems } = initSectionNavigation({
        onLazySectionsReveal: () => {
            displayContactInfo(true);
            updateCV(true);
        },
    });

    document.addEventListener('projects-rendered', () => {
        observeRevealItems();
    });


    langToggle?.addEventListener('click', function () {
        toggleLang();
        displayProjects();
        displayContactInfo();
        updateCV();
        observeRevealItems();
    });

    applyTranslations();

    if (shouldShowBootScreen()) {

        document.body.classList.add("loading");
        await showBootScreen();
        markBootScreenAsShown();
        document.body.classList.remove("loading");

    } else {
        document.getElementById("boot-screen")?.remove();
    }

    await animateHero();

    initCodeEditor();

    syncNavbarToScroll();
});
