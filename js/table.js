class viewData extends HTMLElement {
    constructor() {
        super();
        this.columnsName = [];
        this.columnsType = [];
        this.columnsWidth = [];
        this.columnsIndex = [];
        this.data = [];
        window.addEventListener('resize', () => {
            this.rezise()
        })
    }

    rezise() {
        this.columnsWidth = []
        this.columnsIndex.forEach(index => {
            this.columnsWidth.push(Math.max(window.innerWidth / 10, window.innerWidth / this.columnsName.length))
            let stylecolumn = document.getElementById(`column_${index}_${this.columnsName[index].replaceAll(" ", "-")}`);
            stylecolumn.innerHTML = `.column_${index}_${this.columnsName[index].replaceAll(" ", "-")}{
                width: ${this.columnsWidth[index]}px;
            }`;
        });



    }

    init(columns = [], data = []) {
        columns.forEach((node, index) => {
            this.columnsType.push(node["Type"])
            this.columnsName.push(node["Name"]);
            this.columnsIndex[node["Index"] - 1] = index;
            this.columnsWidth.push(Math.max(window.innerWidth / 10, window.innerWidth / columns.length))
        })

        this.data = data;
        this.MakeHeaders();
        this.LoadData();
        this.newRow()
    }

    MakeHeaders() {
        let trh = document.createElement("tr");
        this.columnsIndex.forEach(index => {
            let stylecolumn = document.createElement("style");
            stylecolumn.id = `column_${index}_${this.columnsName[index].replaceAll(" ", "-")}`;
            stylecolumn.innerHTML = `.column_${index}_${this.columnsName[index].replaceAll(" ", "-")}{
                width: ${this.columnsWidth[index]}px;
            }`;
            document.body.appendChild(stylecolumn);
            let th = document.createElement("th");
            th.classList.add(`column_${index}_${this.columnsName[index].replaceAll(" ", "-")}`);
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
                let stylecolumn = document.getElementById(`column_${index}_${this.columnsName[index].replaceAll(" ", "-")}`);
                this.columnsWidth[index] += parseFloat(e.clientX - slicer_StartX);
                stylecolumn.innerHTML = `.column_${index}_${this.columnsName[index].replaceAll(" ", "-")}{
                width: ${this.columnsWidth[index]}px;
            }`;
                slicer_StartX = null;

            });
            th.appendChild(slicer)
            th.appendChild(input);
            trh.appendChild(th);
        });
        trh.style.gridTemplateColumns = `repeat(${this.columnsType.length},auto)`
        this.appendChild(trh);
    }

    LoadData() {
        this.data.forEach((row, rowI) => {
            this.MakeRow(row, rowI)
        });
    }

    MakeRow(row, rowI) {
        let trd = document.createElement("tr");
        this.columnsIndex.forEach(index => {
            const value = row[index];
            let td = document.createElement("td");
            td.classList.add(`column_${index}_${this.columnsName[index].replaceAll(" ", "-")}`);
            let input = document.createElement("input");
            let addInput = true;
            if (this.columnsType[index].toLowerCase() != "boolean") {
                input.value = value;
                input.addEventListener("change", () => { this.data[rowI][index] = input.value; })
            }
            switch (this.columnsType[index].toLowerCase()) {
                case "boolean":
                    addInput = false;
                    input.type = "checkbox";
                    input.checked = value;
                    input.addEventListener("change", () => { this.data[rowI][index] = input.checked; })
                    let toggle = document.createElement("toggle-switch");
                    input.id = `switch_${this.columnsName[index]}_${rowI}`;
                    toggle.appendChild(input);
                    let label = document.createElement("label");
                    label.setAttribute("for", `switch_${this.columnsName[index]}_${rowI}`);
                    toggle.appendChild(label);
                    td.appendChild(toggle);
                    break;
                case "text":
                    input.type = "text";
                    break;
                case "number":
                    input.type = "number";
                    break;
                default:
                    if (this.columnsType[index].startsWith("!")) {
                        addInput = false;
                        let level = DatasetLevelCount(this.columnsType[index]);
                        let dataset = DatasetName(this.columnsType[index]);
                        let name = `select_${this.columnsName[index]}`;

                        const select = document.createElement("custom-select");
                        select.init(rowI, name, (e) => {
                            this.data[rowI][index] = select.getValue();
                            trd.childNodes.forEach(elem => {
                                const element = elem.firstChild;
                                if (element.getAttribute("data-reference") == name) {
                                    element.setValue(null);
                                    element.setTree(select.getTreeSelect())
                                }
                            });

                            // console.log(e);
                        })

                        if (level == 1) {
                            select.setTree(FileData["Datasets"][dataset]);
                        } else {
                            let reference = DatasetReference(this.columnsType[index]);
                            select.setAttribute("data-reference", `select_${reference}`)
                            trd.childNodes.forEach(elem => {
                                const element = elem.firstChild;
                                if (element.getAttribute("data-name") == `select_${reference}`) {
                                    select.setTree(element.getTreeSelect())
                                }

                            });

                        }

                        select.setValue(value);
                        td.appendChild(select);
                    }
                    break;
            }
            if (addInput) {
                td.appendChild(input);
            }
            trd.appendChild(td)



        });


        trd.style.gridTemplateColumns = `repeat(${this.columnsType.length},auto)`
        this.appendChild(trd);
    }

    default_row() {
        function default_type(type) {
            switch (type.toLowerCase()) {
                case "boolean":
                    return false
                    break;
                case "text":
                    return "";
                    break;
                case "number":
                    return 0;
                    break;
                default:
                    if (type.toLowerCase().startsWith("!")) {
                        return null
                    }
                    break;
            }
        }
        let row = [];
        this.columnsType.forEach(type => {
            row.push(default_type(type));
        });

        return row
    }

    newRow() {
        let newRow = document.createElement("tr");
        newRow.id = "nowRow";
        this.columnsName.forEach((name, index) => {
            let td = document.createElement("td");
            td.classList.add(`column_${index}_${this.columnsName[index].replaceAll(" ", "-")}`);
            newRow.appendChild(td);
        });
        newRow.addEventListener("click", (e) => {
            let defaurow = this.default_row();
            this.removeChild(newRow);
            this.MakeRow(defaurow, this.data.length)
            this.data.push(defaurow);
            this.appendChild(newRow);

        })
        newRow.style.gridTemplateColumns = `repeat(${this.columnsType.length},auto)`
        this.appendChild(newRow);
    }
    getColumnIndex(name) {
        let index = 0;
        while (index < this.columnsName.length) {
            if (this.columnsName[index] == name) {
                return this.columnsIndex[index]
            }
            index++
        }
    }

    getData(){return this.data}
     getColumns(){
        let columns = [];
        this.columnsIndex.forEach(index => {
            let nodo = {};
            nodo["Type"] = this.columnsType[index]
            nodo["Name"] = this.columnsName[index];
            nodo["Index"] = index+1;
            columns.push(nodo);
        });
        return columns;
     }

}

customElements.define("view-data", viewData);