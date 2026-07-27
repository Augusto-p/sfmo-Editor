let FileData = null
let columnsType = [];
let columnsName = [];
const inputFile = document.getElementById("FileLoad");
const SaveButton = document.getElementById("Save");
const dataView = document.getElementById("Data");
const dashboardView = document.getElementById("Dashboards");
inputFile.addEventListener("change", (e)=>{
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
    if (!FileData) {return}
    document.body.setAttribute("data-Mode", "Load");
    // dataView.innerHTML = "";
    // LoaD Columns 
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
}











function toggleDahboards() {
    if (document.body.getAttribute("data-mode") != "Dash") {
        document.body.setAttribute("data-mode", "Dash");
        document.querySelectorAll("custom-dashboard").forEach(element => {
            element.reload()
        });
    }else{
        document.body.setAttribute("data-mode", "Load");
    } 
}

document.getElementById("Bookmark").addEventListener("click", ()=>{
    toggleDahboards()
})

SaveButton.addEventListener("click", ()=>{
    FileData["Columns"] = dataView.getColumns();
    FileData["Data"] = dataView.getData();
    const blob = new Blob([JSON.stringify(FileData)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = inputFile.files[0].name;
  
    document.body.appendChild(link);
  link.click();

  // 4. Limpiar el elemento y liberar la memoria
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
    console.log(inputFile.files[0].name);
    console.log(FileData);
    
    
})


const engine = new FormulaEngine(dataView);