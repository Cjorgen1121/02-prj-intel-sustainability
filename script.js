const rtlLanguages = new Set(["ar", "fa", "he", "ur", "dv", "ps", "yi"]);
const supportedLanguages = new Set(["en", "ar", "he", "fr", "es"]);

function getBrowserLanguage() {
  const browserLanguage = navigator.languages?.[0] || navigator.language || "en";
  return browserLanguage.toLowerCase().split("-")[0];
}

function getDetectedLanguage() {
  const browserLanguage = getBrowserLanguage();
  return supportedLanguages.has(browserLanguage) ? browserLanguage : "en";
}

function updatePageDirection(language) {
  const languageCode = language.toLowerCase().split("-")[0];
  const direction = rtlLanguages.has(languageCode) ? "rtl" : "ltr";

  document.documentElement.lang = languageCode;
  document.documentElement.dir = direction;
  document.body.dataset.direction = direction;
}

function updateLanguageStatus(language) {
  const status = document.querySelector("#language-status");
  const languageMenu = document.querySelector("#language-menu");
  const languageNames = {
    ar: "Arabic",
    he: "Hebrew",
    fr: "French",
    es: "Spanish",
    en: "English"
  };

  if (status) {
    status.textContent = `Language: ${language.toUpperCase()} (${document.documentElement.dir.toUpperCase()})`;
  }

  if (languageMenu) {
    languageMenu.firstChild.textContent = languageNames[language] || "English";
  }
}

function selectGoogleLanguage(language) {
  const googleLanguageSelect = document.querySelector(".goog-te-combo");

  updatePageDirection(language);
  updateLanguageStatus(language);

  if (!googleLanguageSelect) {
    return;
  }

  googleLanguageSelect.value = language === "en" ? "" : language;
  googleLanguageSelect.dispatchEvent(new Event("change"));
}

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: "en,ar,he,fr,es",
      autoDisplay: false
    },
    "google_translate_element"
  );

  const detectedLanguage = getDetectedLanguage();

  updatePageDirection(detectedLanguage);
  updateLanguageStatus(detectedLanguage);

  if (detectedLanguage !== "en") {
    window.setTimeout(() => selectGoogleLanguage(detectedLanguage), 300);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const detectedLanguage = getDetectedLanguage();

  updatePageDirection(detectedLanguage);
  updateLanguageStatus(detectedLanguage);

  document.querySelectorAll("[data-language]").forEach((languageButton) => {
    languageButton.addEventListener("click", () => {
      selectGoogleLanguage(languageButton.dataset.language);
    });
  });

  document.querySelectorAll('[data-bs-toggle="popover"]').forEach((popover) => {
    new bootstrap.Popover(popover);
  });
});