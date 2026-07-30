const new_file_btn = document.getElementById("New_File_btn");
const open_file_btn = document.getElementById("Open_file_btn");
const save_file_btn = document.getElementById("Save_file_btn");
const privacy_policy_btn = document.getElementById("Privacy_Policy_btn");
const terms_of_service_btn = document.getElementById("Terms_of_Service_btn");
const faq_btn = document.getElementById("FAQ_btn");
const github_btn = document.getElementById("GitHub_btn");
const language_selector = document.querySelector("language-selector");

new_file_btn.addEventListener("click", () => { });

open_file_btn.addEventListener("click", () => inputFile.click());

save_file_btn.addEventListener("click", () => {
    FileData["Columns"] = dataView.getColumns();
    FileData["Data"] = dataView.getData();
    const blob = new Blob([JSON.stringify(FileData)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    OpenLink(url, inputFile.files[0].name);
    URL.revokeObjectURL(url);
});

privacy_policy_btn.addEventListener("click", () => { OpenLink(`/Legal/Privacy_Policy.html?lang=${Lang}`); });

terms_of_service_btn.addEventListener("click", () => { OpenLink(`/Legal/Terms_of_Service.html?lang=${Lang}`); });

faq_btn.addEventListener("click", () => { OpenLink(`/Legal/FAQ.html?lang=${Lang}`); });

github_btn.addEventListener("click", () => { OpenLink(`https://github.com/Augusto-p/sfmo-Editor`); });

function HeaderLoadLang() {
    privacy_policy_btn.firstElementChild.textContent = Lang_Dictionary["privacy policy"];
    terms_of_service_btn.firstElementChild.textContent = Lang_Dictionary["terms of service"];
    faq_btn.firstElementChild.textContent = Lang_Dictionary["FAQ"];
    language_selector.setValue(Lang);
}

language_selector.init(-1, "language", (e) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("lang", language_selector.getValue());
    const searchString = new URLSearchParams(searchParams).toString();
    const newUrl = `${window.location.pathname}?${searchString}${window.location.hash}`;
    window.history.pushState({}, "", newUrl);
    getLang_Dictionary();

});

language_selector.setOptions([
    { code: "en", name: "English", flag: "/App/Flags/uk.svg" },
    { code: "es", name: "Español", flag: "/App/Flags/es.svg" },
    { code: "pt", name: "Português", flag: "/App/Flags/pt.svg" },
    { code: "fr", name: "Française", flag: "/App/Flags/fr.svg" },
    { code: "it", name: "Italiano", flag: "/App/Flags/it.svg" },
    { code: "de", name: "Deutsche", flag: "/App/Flags/de.svg" },
    { code: "ru", name: "Русский", flag: "/App/Flags/ru.svg" },

]);