import { displayProjects } from './projects.js';
import { toggleLang, applyTranslations } from './i18n.js';
import { initSectionNavigation } from './sectionNavigation.js';
import { displayContactInfo, updateCV, initContactSection } from './contactSection.js';
import { initCodeEditor } from './editor.js';
import { showBootScreen } from './terminal.js';

document.addEventListener('DOMContentLoaded', async function () {
    const langToggle = document.getElementById('lang-toggle');

    const { syncNavbarToScroll } = initSectionNavigation({
        onLazySectionsReveal: () => {
            displayContactInfo(true);
            updateCV(true);
        },
    });

    initContactSection();
    displayProjects();

    langToggle?.addEventListener('click', function () {
        toggleLang();
        displayProjects();
        displayContactInfo();
        updateCV();
    });

    applyTranslations();

    document.body.classList.add("loading");

    await showBootScreen();

    document.body.classList.remove("loading");
    
    initCodeEditor();

    syncNavbarToScroll();
});
