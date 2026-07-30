const LegalView = document.getElementById("Legal");
const LegalTitle = LegalView.querySelector("#Title");
const LegalContent = LegalView.querySelector("#ContentView");
const LegalBack_Btn = LegalView.querySelector("#Back_btn");

function ViewFAQ() {
    if (document.body.getAttribute("data-mode") != "Legal:FAQ") {
        document.body.setAttribute("data-mode", "Legal:FAQ");
    } else {
        document.body.setAttribute("data-mode", "Load");
    }
    const searchString = new URLSearchParams(window.location.search).toString();
    const newUrl = `${window.location.pathname.split("/Legal/")[0]}/Legal/FAQ?${searchString}${window.location.hash}`;
    window.history.pushState({}, "", newUrl);
    document.head.querySelector("title").textContent = `${Lang_Dictionary["FAQ"]} - SFMO Editor`;
    LegalTitle.textContent = Lang_Dictionary["Legal"]["Title FAQ"];
    Load_Legal_Content("FAQ");
}

function ViewPrivacyPolicy() {
    if (document.body.getAttribute("data-mode") != "Legal:FAQ") {
        document.body.setAttribute("data-mode", "Legal:FAQ");
    } else {
        document.body.setAttribute("data-mode", "Load");
    }
    const searchString = new URLSearchParams(window.location.search).toString();
    const newUrl = `${window.location.pathname.split("/Legal/")[0]}/Legal/Privacy_Policy?${searchString}${window.location.hash}`;
    window.history.pushState({}, "", newUrl);
    document.head.querySelector("title").textContent = `${Lang_Dictionary["privacy policy"]} - SFMO Editor`;
    LegalTitle.textContent = Lang_Dictionary["Legal"]["Title privacy policy"];
    Load_Legal_Content("Privacy_Policy");
}

function ViewTermsOfService() {
    if (document.body.getAttribute("data-mode") != "Legal:FAQ") {
        document.body.setAttribute("data-mode", "Legal:FAQ");
    } else {
        document.body.setAttribute("data-mode", "Load");
    }
    const searchString = new URLSearchParams(window.location.search).toString();

    const newUrl = `${window.location.pathname.split("/Legal/")[0]}/Legal/Terms_of_Service?${searchString}${window.location.hash}`;
    window.history.pushState({}, "", newUrl);
    document.head.querySelector("title").textContent = `${Lang_Dictionary["terms of service"]} - SFMO Editor`;
    LegalTitle.textContent = Lang_Dictionary["Legal"]["Title terms of service"];
    Load_Legal_Content("Terms_of_Service");
}

async function Load_Legal_Content(name) {
    fetch(`${window.location.pathname.split("/Legal/")[0]}Laws/${Lang}/${name}.md`).then(res => {
        if (res.status == 200) {
            return res.text();
        }
    }).then(data => {
        LegalContent.innerHTML = marked.parse(data);
    });
}

LegalBack_Btn.addEventListener("click", () => {
    if (FileData == null) {
        document.body.setAttribute("data-mode", "NoLoad");
    } else {
        document.body.setAttribute("data-mode", "Load");
    }
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("lang", language_selector.getValue());
    const searchString = new URLSearchParams(searchParams).toString();

    const newUrl = `${window.location.pathname.split("/Legal/")[0]}?${searchString}${window.location.hash}`;
    window.history.pushState({}, "", newUrl);
    document.head.querySelector("title").textContent = `SFMO Editor`;
})
