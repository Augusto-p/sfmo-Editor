let FileData = null
let columnsType = [];
let columnsName = [];
const inputFile = document.getElementById("FileLoad");
const SaveButton = document.getElementById("Save");
const dataView = document.getElementById("Data");
const engine = new FormulaEngine(dataView);
const dashboardView = document.getElementById("Dashboards");
const datasetView =document.getElementById("DataSets");
const body = document.body;
let DataSet = null;

inputFile.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (file && !file.name.toLowerCase().endsWith(".sfmo")) {
        alert("Solo se permiten archivos .sfmo");
        e.target.value = ""; // Limpiar la selección
    }
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
        const contenido = event.target.result;
        FileData = JSON.parse(contenido)

        ViewData()
    };

    reader.readAsText(file);
})

function ViewData() {
    if (!FileData) { return }
    dashboardView.innerHTML = "";
    datasetView.innerHTML = "";
    dataView.clear();

    document.body.setAttribute("data-Mode", "Load");
    let columns = FileData["Columns"];
    let columnsType = []
    let columnsName = []
    columns.forEach((node, index) => {
        columnsType.push(node["Type"])
        columnsName.push(node["Name"])
    });

    dataView.init(FileData["Columns"], FileData["Data"]);

    Object.keys(FileData["Dashboards"]).forEach(name => {
        let dash = document.createElement("custom-dashboard");
        dash.init(name, FileData["Dashboards"][name])
        dashboardView.appendChild(dash);
    });
    DataSet = new Datasets(FileData["Datasets"], datasetView);
}

function OpenLink(url, download = null) {
    const link = document.createElement('a');
    link.style.opacity = 0;
    link.href = url;
    if (download != null) {link.download = download;}
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
}


function LoadFileLoadLang() {
    inputFile.parentElement.querySelector("span").textContent = Lang_Dictionary["drag & drop files here to upload"];
    inputFile.parentElement.querySelector("button").textContent = Lang_Dictionary["select files to upload"];
}