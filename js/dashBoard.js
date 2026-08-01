
class dashboard extends HTMLElement {
    constructor() {
        super();
        this.name = "";
        this.columnsName = []
        this.columnsIndex = []
        this.columnsWidth = [];
        this.rows = [];
        this.FileData = null;
        this.menu = null;
        this.Option_New_Column = "";
        this.Option_New_Row = "";
        this.Option_Delete = "";
        this.dashboard = null;
    }

    init(FileData, name, dashboard) {
        this.dashboard = dashboard;
        this.FileData = FileData;
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
        let name = document.createElement("input");
        name.classList.add("Name");
        name.type = this.textContent;
        name.value = this.name;
        name.size = 1;
        name.addEventListener("input", () => {
            let actual = this.FileData["Dashboards"][this.name];
            delete this.FileData["Dashboards"][this.name];
            this.FileData["Dashboards"][name.value] = actual;
            this.name = name.value;
        });

        this.menu = document.createElement("kebab-menu");
        this.menu.init(this.name, (e) => {
            switch (e.value.substring(2)) {
                case this.Option_Delete:
                    delete this.FileData["Dashboards"][this.name];
                    this.parentElement.removeChild(this);
                    break;
                case this.Option_New_Row: 
                    let new_row =this.default_row();
                    this.rows.push(new_row);
                    this.appendChild(this.MakeRow(new_row, this.rows.length-1));
                    this.Save();
                    break;
                case this.Option_New_Column:
                    this.columnsIndex.push(this.columnsIndex.length);
                    this.columnsName.push("");
                    this.rows.forEach(row=>{row.push("");});
                    this.Save();
                    this.reload();
                    break

                default:
                    break;
            }
        })
        this.appendChild(name);
        this.appendChild(this.menu);
        this.MakeHeaders();
        this.LoadData();
        this.LoadLang();
    }

    default_row() {
        let row = []
        this.columnsIndex.forEach(_ => {
            row.push("");
        });
        return row;
    }

    LoadLang() {
        this.Option_New_Column = Lang_Dictionary["dashboards_kebab_menu"]["new_column"];
        this.Option_New_Row = Lang_Dictionary["dashboards_kebab_menu"]["new_row"];
        this.Option_Delete = Lang_Dictionary["dashboards_kebab_menu"]["delete"];
        let Options = []
        Options.push(`+ ${this.Option_New_Column}`);
        Options.push(`+ ${this.Option_New_Row}`);
        Options.push(`× ${this.Option_Delete}`);
        this.menu.setOptions(Options);
    }
    reload() {
        this.innerHTML = "";
        this.Make()
    }

    MakeHeaders() {
        let trh = document.createElement("tr");
        trh.appendChild(document.createElement("br"));
        this.columnsIndex.forEach((index, n) => {
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
            input.addEventListener("input", () => {
                this.columnsName[index] = input.value;
                this.Save();
            })

            th.appendChild(input);
            let deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-col-btn");
            deleteBtn.innerHTML = "&times;";
            deleteBtn.addEventListener("click", () => {
                this.columnsIndex.splice(n, 1);
                this.columnsName.splice(n, 1);
                this.columnsWidth.splice(n, 1);
                this.rows.forEach(row => {
                    row.splice(index, 1);
                });
                this.Save();
                this.reload();
            });
            th.appendChild(deleteBtn)
            trh.appendChild(th);
        });
        trh.style.gridTemplateColumns = `16px repeat(${this.columnsIndex.length},auto)`
        this.appendChild(trh);
    }

    Save() {
        this.FileData["Dashboards"][this.name]["Data"] = {};
        this.rows.forEach(row => {
            let rowed = row.slice();
            this.FileData["Dashboards"][this.name]["Data"][rowed.shift()] = rowed;
        });
        this.FileData["Dashboards"][this.name]["Columns"] = [];
        this.columnsIndex.forEach(index => {
            this.FileData["Dashboards"][this.name]["Columns"].push({ "Name": this.columnsName[index], "Index": index + 1 });
        });

    }

    MakeRow(row, rowI) {
        let trd = document.createElement("tr");
        let deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-row-btn");
        deleteBtn.innerHTML = "&times;";
        deleteBtn.addEventListener("click", () => {
            this.rows.splice(rowI, 1);
            this.Save();
            this.reload();
        });
        trd.appendChild(deleteBtn);
        this.columnsIndex.forEach(index => {
            let value = row[index];
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
            input.addEventListener("input", () => {
                value = input.value;                
                this.rows[rowI][index] = input.value;
                this.Save();
            })
            td.appendChild(input);
            trd.appendChild(td)
        });


        trd.style.gridTemplateColumns = `16px repeat(${this.columnsIndex.length},auto)`;
        return trd;
    }

    LoadData() {
        this.rows.forEach((row, rowI) => {
            this.appendChild(this.MakeRow(row, rowI));
        });
    }
}

customElements.define("custom-dashboard", dashboard);



function dashboard_new_LoadLang() {
    if (dashboard_new) {
        dashboard_new.textContent = `+ ${Lang_Dictionary["dashboards_new"]}`;
        
    }
}

dashboard_new.addEventListener("click", ()=>{
        console.log(Lang_Dictionary["dashboards"]);
        
        FileData["Dashboards"][Lang_Dictionary["dashboards"]] = {
            "Columns":[{"Name": "-", "Index":1}],
            "Data": {"":[]}
        }
        let dash = document.createElement("custom-dashboard");
        dash.init(FileData, Lang_Dictionary["dashboards"], FileData["Dashboards"][Lang_Dictionary["dashboards"]]);
        dashboardView.appendChild(dash);

    })