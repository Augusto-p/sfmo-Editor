const language_selector = document.querySelector("language-selector");
language_selector.init("language", (e) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("lang", language_selector.getValue());
    const searchString = new URLSearchParams(searchParams).toString();
    const newUrl = `${window.location.pathname}?${searchString}${window.location.hash}`;
    window.history.pushState({}, "", newUrl);
    getLang_Dictionary();

});

language_selector.setOptions([
    { code: "en", name: "English", flag: "Editor/App/Flags/uk.svg" },
    { code: "es", name: "Español", flag: "Editor/App/Flags/es.svg" },
    { code: "pt", name: "Português", flag: "Editor/App/Flags/pt.svg" },
    { code: "fr", name: "Française", flag: "Editor/App/Flags/fr.svg" },
    { code: "it", name: "Italiano", flag: "Editor/App/Flags/it.svg" },
    { code: "de", name: "Deutsche", flag: "Editor/App/Flags/de.svg" },
    { code: "ru", name: "Русский", flag: "Editor/App/Flags/ru.svg" },
]);


// Contenedor para referencias del DOM
const elements = {
    header: {
        title: document.querySelector("header h1"),
        subtitle: document.querySelector("header .subtitle")
    },
    main: {
        whatIs: document.querySelector("main .what_is"),
        description: document.querySelector("main .description"),
        launchEditor: document.querySelector("main #Launch_Editor"),
        featuresTitle: document.querySelector("main .features-title"),
        featuresGrid: document.querySelector("main .features-grid"),
        howToUse: document.querySelector("main .how_to_use"),
        howToUseOl: document.querySelector("main .how_to_use_ol")
    },
    footer: {
        privacyPolicy: document.querySelector("footer .Privacy_Policy"),
        termsOfService: document.querySelector("footer .Terms_of_Service"),
        faq: document.querySelector("footer .FAQ"),
        copyright: document.querySelector("footer .copyright")
    }
};

// Funciones creadoras de componentes HTML
function makeHowToUseLi(html) {
    const li = document.createElement("li");
    li.innerHTML = html;
    return li;
}

function makeFeatureItem(title, description) {
    const div = document.createElement("div");
    div.classList.add("feature-item");

    const h3 = document.createElement("h3");
    h3.textContent = title;

    const p = document.createElement("p");
    p.innerHTML = description;

    div.append(h3, p);
    return div;
}

// Carga y renderizado del idioma
function LoadLang() {
    document.documentElement.setAttribute("lang", Lang);

    // Render Header
    elements.header.title.textContent = Lang_Dictionary["title"];
    elements.header.subtitle.innerHTML = Lang_Dictionary["subtitle"];

    // Render Main Text
    elements.main.whatIs.innerHTML = Lang_Dictionary["what_is"];
    elements.main.description.innerHTML = Lang_Dictionary["description"];
    elements.main.launchEditor.innerHTML = `${Lang_Dictionary["launch_editor"]} &rarr;`;
    elements.main.featuresTitle.innerHTML = Lang_Dictionary["features_title"];
    elements.main.howToUse.innerHTML = Lang_Dictionary["how_to_use"];

    // Render Footer
    elements.footer.privacyPolicy.innerHTML = Lang_Dictionary["privacy_policy"];
    elements.footer.termsOfService.innerHTML = Lang_Dictionary["terms_of_service"];
    elements.footer.faq.innerHTML = Lang_Dictionary["FAQ"];
    elements.footer.copyright.innerHTML = `&copy; ${new Date().getFullYear()} ${Lang_Dictionary["copyright"]}`;

    // Render Lista "Cómo usar"
    elements.main.howToUseOl.innerHTML = "";
    Lang_Dictionary["how_to_use_ol"].forEach((html) => {
        elements.main.howToUseOl.appendChild(makeHowToUseLi(html));
    });

    // Render Cuadrícula "Características"
    elements.main.featuresGrid.innerHTML = "";
    Lang_Dictionary["features"].forEach(({ title, description }) => {
        elements.main.featuresGrid.appendChild(makeFeatureItem(title, description));
    });

    // Actualizar selector de idioma
    language_selector.setValue(Lang);
}