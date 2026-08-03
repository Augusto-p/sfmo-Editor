const new_file_btn = document.getElementById("New_File_btn");
const open_file_btn = document.getElementById("Open_file_btn");
const save_file_btn = document.getElementById("Save_file_btn");
const privacy_policy_btn = document.getElementById("Privacy_Policy_btn");
const terms_of_service_btn = document.getElementById("Terms_of_Service_btn");
const faq_btn = document.getElementById("FAQ_btn");
const github_btn = document.getElementById("GitHub_btn");
const language_selector = document.querySelector("language-selector");

new_file_btn.addEventListener("click", () => {
    if (!FileDataFlag) {
        FileData = { "Columns": [{ "Name": "", "Index": 1, "Type": "text" }], "Datasets": {}, "Dashboards": {}, "Data": [] }
        ViewData();
        return
    }

    let alert = document.createElement("custom-confirm");
    alert.init(_ => { return }, _ => {
        FileData = { "Columns": [{ "Name": "", "Index": 1, "Type": "text" }], "Datasets": {}, "Dashboards": {}, "Data": [] }
        ViewData();
    });
    alert.setText(Lang_Dictionary["data loss alert"]["title"], Lang_Dictionary["data loss alert"]["description"], Lang_Dictionary["data loss alert"]["no"], Lang_Dictionary["data loss alert"]["yes"])
    body.appendChild(alert);


});

open_file_btn.addEventListener("click", () => {
    if (!FileDataFlag) {
        inputFile.click();
        return;
    }

    let alert = document.createElement("custom-confirm");
    alert.init(_ => { return }, _ => { inputFile.click(); });
    alert.setText(Lang_Dictionary["data loss alert"]["title"], Lang_Dictionary["data loss alert"]["description"], Lang_Dictionary["data loss alert"]["no"], Lang_Dictionary["data loss alert"]["yes"])
    body.appendChild(alert);
});

save_file_btn.addEventListener("click", () => {
    FileData["Data"] = dataView.getData();
    FileDataFlag = false;
    body.removeAttribute("data-save");
    FileDataHash = getFiledataHash();
    let obfuscate_data = ObfuscatedFile.obfuscate(FileData);
    const blob = new Blob([obfuscate_data], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    let Name = "file.sfmo";
    if (inputFile.files[0]) {
        Name = inputFile.files[0].name;
    }
    OpenLink(url, Name);
    URL.revokeObjectURL(url);
});

privacy_policy_btn.addEventListener("click", () => {
    let new_url = `${window.location.pathname.split("/Editor/")[0]}/Legal/Privacy_Policy`;
    window.location.pathname = new_url;
});

terms_of_service_btn.addEventListener("click", () => {let new_url = `${window.location.pathname.split("/Editor/")[0]}/Legal/Terms_of_Service`;
    window.location.pathname = new_url;});

faq_btn.addEventListener("click", () => {let new_url = `${window.location.pathname.split("/Editor/")[0]}/Legal/FAQ`;
    window.location.pathname = new_url;});

github_btn.addEventListener("click", () => { OpenLink(`https://github.com/Augusto-p/sfmo-Editor`); });

function HeaderLoadLang() {
    privacy_policy_btn.firstElementChild.textContent = Lang_Dictionary["privacy policy"];
    terms_of_service_btn.firstElementChild.textContent = Lang_Dictionary["terms of service"];
    faq_btn.firstElementChild.textContent = Lang_Dictionary["FAQ"];
    language_selector.setValue(Lang);
}

language_selector.init("language", (e) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("lang", language_selector.getValue());
    const searchString = new URLSearchParams(searchParams).toString();
    const newUrl = `${window.location.pathname}?${searchString}${window.location.hash}`;
    window.history.pushState({}, "", newUrl);
    getLang_Dictionary();

});

language_selector.setOptions([
    { code: "en", name: "English", flag: "App/Flags/uk.svg" },
    { code: "es", name: "Español", flag: "App/Flags/es.svg" },
    { code: "pt", name: "Português", flag: "App/Flags/pt.svg" },
    { code: "fr", name: "Française", flag: "App/Flags/fr.svg" },
    { code: "it", name: "Italiano", flag: "App/Flags/it.svg" },
    { code: "de", name: "Deutsche", flag: "App/Flags/de.svg" },
    { code: "ru", name: "Русский", flag: "App/Flags/ru.svg" },
]);


document.addEventListener("keydown", e => {
    if (e.target.matches("input, textarea, select") || e.target.isContentEditable) { return; }

    if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (FileDataHash != null) {
            save_file_btn.click();
        }
    }
    if (e.ctrlKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        open_file_btn.click();
    }

    if (e.ctrlKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        new_file_btn.click();
    }

    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        toggleDahboards()
    }

    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "x") {
        e.preventDefault();
        toggleDataSets();
    }
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        toggleColumns()
    }
});