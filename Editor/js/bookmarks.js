const BookmarkDash = document.getElementById("BookmarkDash");
const BookmarkDatasets = document.getElementById("BookmarkDataSets");
const BookmarkColumns = document.getElementById("BookmarkColumns");

function toggleDahboards() {
    if (document.body.getAttribute("data-mode") != "Dash:Pannel") {
        document.body.setAttribute("data-mode", "Dash:Pannel");
        document.querySelectorAll("custom-dashboard").forEach(element => {element.reload()});
    } else {
        document.body.setAttribute("data-mode", "Load");
    }
}

BookmarkDash.addEventListener("click", () => {toggleDahboards();})


function toggleDataSets() {
    if (document.body.getAttribute("data-mode") != "DataSets:Pannel") {
        document.body.setAttribute("data-mode", "DataSets:Pannel");
    } else {
        document.body.setAttribute("data-mode", "Load");
    }
}
BookmarkDatasets.addEventListener("click", () => {toggleDataSets();})
function toggleColumns() {
    if (document.body.getAttribute("data-mode") != "Columns:Pannel") {
        document.body.setAttribute("data-mode", "Columns:Pannel");
    } else {
        document.body.setAttribute("data-mode", "Load");
    }
}
BookmarkColumns.addEventListener("click", () => {toggleColumns();})


function BookmarkLoadLang() {
    BookmarkDash.firstElementChild.textContent = Lang_Dictionary["dashboards"];
    BookmarkDatasets.firstElementChild.textContent = Lang_Dictionary["datasets"];
    BookmarkColumns.firstElementChild.textContent = Lang_Dictionary["columns"];
}



