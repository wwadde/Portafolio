import esTranslations from '../locales/es.json';
import enTranslations from '../locales/en.json';

const translations = {
    es: flattenObject(esTranslations),
    en: flattenObject(enTranslations),
};

let currentLang = "en";

function flattenObject(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, key) => {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(acc, flattenObject(obj[key], newKey));
        } else {
            acc[newKey] = obj[key];
        }
        return acc;
    }, {});
}

export function t(key) {
    return translations[currentLang]?.[key] ?? key;
}

export function getLang() {
    return currentLang;
}

export function setLang(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    applyTranslations();
}

export function toggleLang() {
    setLang(currentLang === "es" ? "en" : "es");
}

export function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const value = t(key);
        if (value) el.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        const value = t(key);
        if (value) el.placeholder = value;
    });

    const langLabel = document.getElementById("lang-label");
    if (langLabel) {
        langLabel.textContent = currentLang === "es" ? "EN" : "ES";
    }

    document.documentElement.lang = currentLang;
}
