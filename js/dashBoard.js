
class dashboard extends HTMLElement {
    constructor() {
        super();
        this.name = "";
        this.columnsName = []
        this.columnsIndex = []
        this.columnsWidth = [];
        this.rows = []
    }

    init(name, dashboard) {
        this.name = name;
        dashboard["Columns"].forEach((node, index) => {
            this.columnsName.push(node["Name"]);
            this.columnsIndex[node["Index"] - 1] = index;
        });

        Object.keys(dashboard["Data"]).forEach(key => {
            let novo = []
            novo.push(key);
            dashboard["Data"][key].forEach(e => { novo.push(e); });
            this.rows.push(novo);
        });
        this.Make();
    }
    Make() {
        let name = document.createElement("h2");
        name.textContent = this.name;
        this.appendChild(name);
        this.MakeHeaders()
        this.LoadData()
    }
    
    reload(){
        this.innerHTML = "";
        this.Make()
    }

    MakeHeaders() {
        let trh = document.createElement("tr");
        this.columnsIndex.forEach(index => {
            this.columnsWidth[index] = Math.max(120, (this.columnsName[index].length * 10) + 30);
            // this.columnsWidth[index] = Math.max(window.innerWidth / 100 * 8, (this.columnsName[index].length * 20) + window.innerWidth / 100 * 2);
            let stylecolumn = document.createElement("style");
            stylecolumn.id = `dash_${this.name.replace(/\s+/g, "_")}_column_${index}_${this.columnsName[index].replaceAll(" ", "-")}`;
            stylecolumn.innerHTML = `.dash_${this.name.replace(/\s+/g, "_")}_column_${index}_${this.columnsName[index].replaceAll(" ", "-")}{
                width: ${this.columnsWidth[index]}px;
            }`;
            document.body.appendChild(stylecolumn);
            let th = document.createElement("th");
            th.classList.add(`dash_${this.name.replace(/\s+/g, "_")}_column_${index}_${this.columnsName[index].replaceAll(" ", "-")}`);
            let input = document.createElement("input");
            input.type = "text"
            input.value = this.columnsName[index];
            input.addEventListener("change", () => {
                this.columnsName[index] = input.value;
            })
            let slicer = document.createElement("div");
            slicer.classList.add("thSlicer");
            slicer.draggable = true;
            let slicer_StartX = null;
            slicer.addEventListener("dragstart", (e) => { slicer_StartX = e.clientX; });
            slicer.addEventListener("dragend", (e) => {
                let stylecolumn = document.getElementById(`dash_${this.name.replace(/\s+/g, "_")}_column_${index}_${this.columnsName[index].replaceAll(" ", "-")}`);
                this.columnsWidth[index] += parseFloat(e.clientX - slicer_StartX);
                stylecolumn.innerHTML = `.dash_${this.name.replace(/\s+/g, "_")}_column_${index}_${this.columnsName[index].replaceAll(" ", "-")}{
                width: ${this.columnsWidth[index]}px;
            }`;
                slicer_StartX = null;

            });
            th.appendChild(slicer);
            th.appendChild(input);
            trh.appendChild(th);
        });
        trh.style.gridTemplateColumns = `repeat(${this.columnsIndex.length},auto)`
        this.appendChild(trh);
    }


    LoadData() {
        this.rows.forEach((row, rowI) => {
            let trd = document.createElement("tr");
            this.columnsIndex.forEach(index => {
                const value = row[index];
                let td = document.createElement("td");
                td.classList.add(`dash_${this.name.replace(/\s+/g, "_")}_column_${index}_${this.columnsName[index].replaceAll(" ", "-")}`);
                let input = document.createElement("input");
                input.type = "text"
                input.value = engine.resolveValue(value);
                input.addEventListener("focus", () => {
                    input.value = value;
                })
                input.addEventListener("blur", () => {
                    input.value = engine.resolveValue(value);
                })
                input.addEventListener("copy", (event) => {
                    event.preventDefault();

                    event.clipboardData.setData("text/plain", engine.resolveValue(value));
                });
                td.appendChild(input);
                trd.appendChild(td)
            });


            trd.style.gridTemplateColumns = `repeat(${this.columnsIndex.length},auto)`
            this.appendChild(trd);
        });
    }
}

customElements.define("custom-dashboard", dashboard);