class columnsEditor extends HTMLElement {
    constructor() {
        super();
        this.Columns = []
        this.Name_Index = "Index";
        this.Name_Name = "Name";
        this.Name_Type = "Type";
        this.Name_Reference = "Reference";
        this.Type_Boolean = "Boolean";
        this.Type_Number = "Number";
        this.Type_Text = "Text";
        this.Type_Reference = "Reference";
        this.Reference_Help = "";
        this.types = [null];
        this.viewData = null;
        this.FileData = null;
    }

    saveData() {
        let cols = []
        this.Columns.forEach((col, index) => {
            cols.push(
                {
                    "Name": col["Name"],
                    "Type": this.getType(col["Type"]),
                    "Index": index + 1
                }
            )
        });
        this.FileData["Columns"] = cols;
        this.viewData.reload()
    }

    getType(type) {
        switch (type) {
            case this.Type_Boolean:
                return "Boolean";
                break;
            case this.Type_Number:
                return "Number";
                break;
            case this.Type_Text:
                return "Text";
                break;

            default:
                if (type.startsWith("!")) {
                    return type;
                }
                break;
        }
        return type;
    }


    LoadLang(start = false) {
        let style = this.querySelector("style#LanguageColumnsEditor");
        if (!style) {
            style = document.createElement("style");
            style.id = "LanguageColumnsEditor";
            this.appendChild(style);
        }
        style.innerHTML = `columns-editor #newCol::after {content: "+ ${Lang_Dictionary["columns_editor"]["new_column"]}";`

        this.Name_Index = Lang_Dictionary["columns_editor"]["names"]["index"];
        this.Name_Name = Lang_Dictionary["columns_editor"]["names"]["name"];
        this.Name_Type = Lang_Dictionary["columns_editor"]["names"]["type"];
        this.Name_Reference = Lang_Dictionary["columns_editor"]["names"]["reference"];
        this.types = [null];
        this.types.push(Lang_Dictionary["columns_editor"]["types"]["boolean"]);
        this.types.push(Lang_Dictionary["columns_editor"]["types"]["number"]);
        this.types.push(Lang_Dictionary["columns_editor"]["types"]["text"]);
        this.types.push(Lang_Dictionary["columns_editor"]["types"]["reference"]);

        this.Reference_Help = marked.parse(Lang_Dictionary["columns_editor"]["reference_help"]);

        // SEt Haders
        if (!start) {
            let nullDiv = document.createElement("div");
            (this.querySelector("th.Index span") ?? nullDiv).textContent = this.Name_Index;
            (this.querySelector("th.Name span") ?? nullDiv).textContent = this.Name_Name;
            (this.querySelector("th.Type span") ?? nullDiv).textContent = this.Name_Type;
            (this.querySelector("th.Reference span") ?? nullDiv).textContent = this.Name_Reference;
            this.querySelectorAll("custom-select").forEach(selector => {
                let valor = selector.getValue();
                selector.setOptions(this.types);
                switch (valor) {
                    case null:
                        selector.setValue(null);
                        break;
                    case this.Type_Boolean:
                        selector.setValue(Lang_Dictionary["columns_editor"]["types"]["boolean"]);
                        break;
                    case this.Type_Number:
                        selector.setValue(Lang_Dictionary["columns_editor"]["types"]["number"]);
                        break;
                    case this.Type_Text:
                        selector.setValue(Lang_Dictionary["columns_editor"]["types"]["text"]);
                        break;
                    case this.Type_Reference:
                        selector.setValue(Lang_Dictionary["columns_editor"]["types"]["reference"]);
                        break;

                    default:

                        break;

                }
            });

            this.querySelectorAll("help-tooltip").forEach(helper => {
                helper.init(this.Reference_Help);
            });
            
        }
        this.Type_Boolean = Lang_Dictionary["columns_editor"]["types"]["boolean"];
        this.Type_Number = Lang_Dictionary["columns_editor"]["types"]["number"];
        this.Type_Text = Lang_Dictionary["columns_editor"]["types"]["text"];
        this.Type_Reference = Lang_Dictionary["columns_editor"]["types"]["reference"];


    }

    init(FileData, viewData) {
        this.FileData = FileData;
        this.viewData = viewData;
        FileData["Columns"].forEach(col => {
            this.Columns[col["Index"] - 1] = {
                "Name": col["Name"],
                "Type": col["Type"]
            }

        });
        this.LoadLang(true)
        this.MakeHeaders();
        this.MakeData();
    }

    MakeHeader(id, name) {
        let th = document.createElement("th");
        th.classList.add(id);
        let span = document.createElement("span");
        span.textContent = name;
        th.appendChild(span);
        return th
    }

    MakeHeaders() {
        let trh = document.createElement("tr");
        trh.appendChild(this.MakeHeader("Index", this.Name_Index));
        trh.appendChild(this.MakeHeader("Name", this.Name_Name));
        trh.appendChild(this.MakeHeader("Type", this.Name_Type));
        trh.appendChild(this.MakeHeader("Reference", this.Name_Reference));
        this.appendChild(trh);
    }

    MakeData() {
        this.querySelectorAll("tr:has(td), tr#newCol").forEach(e => { this.removeChild(e); })
        this.Columns.forEach((col, index) => {
            this.appendChild(this.MakeRow(index + 1, col["Name"], col["Type"]));

        });
        this.newCol();
    }

    MakeRow(index, name, type) {
        let trd = document.createElement("tr");
        trd.classList.add("row");
        // index
        let indexTD = document.createElement("td");
        indexTD.classList.add("index");
        let indexSpan = document.createElement("span");
        indexSpan.textContent = index;
        indexTD.appendChild(indexSpan);
        let indexUp = document.createElement("button");
        indexUp.classList.add("indexUp");
        indexUp.addEventListener("click", () => {
            let swap = this.Columns[index - 2];
            this.Columns[index - 2] = this.Columns[index - 1]
            this.Columns[index - 1] = swap;
            this.MakeData();
            this.saveData();
        });

        indexUp.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m280-400 200-200 200 200H280Z"/></svg>`;
        indexTD.appendChild(indexUp);
        let indexDown = document.createElement("button");
        indexDown.classList.add("indexDown");
        indexDown.addEventListener("click", () => {
            let swap = this.Columns[index - 1];
            this.Columns[index - 1] = this.Columns[index]
            this.Columns[index] = swap;
            this.MakeData();
            this.saveData();
        })
        indexDown.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-360 280-560h400L480-360Z"/></svg>`;
        indexTD.appendChild(indexDown);

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-column-btn");
        deleteBtn.innerHTML = "&times;";
        deleteBtn.addEventListener("click", ()=>{
            this.Columns.splice(index -1, 1);
            this.MakeData();
            this.saveData();
            
        })
        indexTD.appendChild(deleteBtn);
        trd.appendChild(indexTD);

        //Name
        let nameTD = document.createElement("td");
        let nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = name;
        nameInput.addEventListener("input", () => {
            this.Columns[index - 1]["Name"] = nameInput.value;
            name = nameInput.value;
            this.saveData();
        })
        nameTD.appendChild(nameInput);
        trd.appendChild(nameTD)

        // Type 
        let TypeTD = document.createElement("td");
        const TypeSelect = document.createElement("custom-select");
        TypeSelect.init(index, "Column_Editor_Type", (e) => {
            if (TypeSelect.getValue() != this.Type_Reference) {
                removeReference();
                type = TypeSelect.getValue();
                this.Columns[index - 1]["Type"] = TypeSelect.getValue();
                this.saveData();
            } else {
                addReference(this, "!");
                type = "!";
                thi.Columns[index - 1]["Type"] = "!";
                this.saveData();

            }
        })
        TypeSelect.setOptions(this.types);
        TypeTD.appendChild(TypeSelect);
        trd.appendChild(TypeTD);
        switch (type) {
            case null:
                TypeSelect.setValue(null);
                break;
            case "Boolean":
                TypeSelect.setValue(this.Type_Boolean);
                break;
            case "Number":
                TypeSelect.setValue(this.Type_Number);
                break;
            case "Text":
                TypeSelect.setValue(this.Type_Text);
                break;

            default:
                if (type&&type.startsWith("!")) {
                    TypeSelect.setValue(this.Type_Reference);
                    addReference(this, type);
                }
                break;
        }


        function removeReference() {
            let Reference = trd.querySelector("td.Reference");
            if (Reference) {
                trd.removeChild(Reference);
            }
        }
        function addReference(thi, value) {
            if (!value) { value = "!" }
            let referenceTD = document.createElement("td");
            referenceTD.classList.add("Reference")
            let referenceInput = document.createElement("input");
            referenceInput.type = "text";
            referenceInput.value = value;
            referenceInput.addEventListener("input", () => {
                thi.Columns[index - 1]["Type"] = referenceInput.value;
                type = referenceInput.value;
                thi.saveData();
            })
            referenceTD.appendChild(referenceInput);
            let help = document.createElement("help-tooltip");
            help.init(thi.Reference_Help);
            referenceTD.appendChild(help);
            trd.appendChild(referenceTD)
        }



        return trd;
    }



    newCol() {
        let newCol = document.createElement("tr");
        newCol.id = "newCol";
        newCol.addEventListener("click", (e) => {
            this.removeChild(newCol);
            let newColumn = this.MakeRow(this.Columns.length, "", null);
            this.appendChild(newColumn);
            this.appendChild(newCol);

        })
        this.appendChild(newCol);
    }

}

customElements.define("columns-editor", columnsEditor);

