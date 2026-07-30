class DataSetTreeNode extends HTMLElement {
    constructor() {
        super();
        this.Nodeparent = null
        this.clave = null;
        this.graph = null;
    }

    getPath() {
        if (this.Nodeparent == null) {
            return [this.clave];
        }
        return [...this.Nodeparent.getPath(), this.clave];
    }

    setData(clave, valor, graph, Nodeparent = null) {
        this.clave = clave;
        this.Nodeparent = Nodeparent;
        this.graph = graph;
        this.innerHTML = "";
        this.level = document.createElement("div");
        this.level.classList.add("level");
        this.appendChild(this.level);

        this.next_level = document.createElement("div");
        this.next_level.classList.add("next_level");
        this.appendChild(this.next_level);


        const isObject = valor !== null && typeof valor === "object";

        if (clave === "NewButton" && valor === true) {
            this.classList.add("is-new-btn-node");
            const button = document.createElement("button");
            button.textContent = "+ Agregar Nodo";
            button.addEventListener("click", () => {
                this.graph.newValue(this.getPath());
                const child = document.createElement("dataset-tree-node");
                let NewButton = {};
                Datasets.AddNewButton(NewButton);
                child.setData("", NewButton, this.graph, this.Nodeparent);

                this.parentElement.insertBefore(child, this);
            })
            this.level.appendChild(button);
        } else {
            // Input editable (Sin icono)
            const input = document.createElement("input");
            input.addEventListener("input", () => {
                this.graph.setValue(this.getPath(), input.value)
                this.clave = input.value;
            })
            input.value = clave;
            this.level.appendChild(input);

            // Botón de eliminar
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-node-btn");
            deleteBtn.innerHTML = "&times;";
            deleteBtn.title = "Eliminar nodo";
            deleteBtn.onclick = (e) => {
                this.graph.deleteValue(this.getPath());
                e.stopPropagation();
                this.remove();
            };
            this.level.appendChild(deleteBtn);
        }

        // Renderizado recursivo de hijos
        if (isObject) {
            for (const [k, v] of Object.entries(valor)) {
                const child = document.createElement("dataset-tree-node");
                child.setData(k, v, this.graph, this);
                this.next_level.appendChild(child);
            }
        } else {
            // Si es un nodo hoja sin hijos, removemos el contenedor contenedor secundario
            this.next_level.remove();
        }

    }
}

if (!customElements.get("dataset-tree-node")) {
    customElements.define("dataset-tree-node", DataSetTreeNode);
}
class Datasets {
    constructor(dataSet, root) {
        this.dataSet = dataSet;
        this.Tree = root;
        this.make()
    }

    make(){
        this.AddNewButton(this.dataSet);
        for (const [clave, valor] of Object.entries(this.dataSet)) {
            const node = document.createElement("dataset-tree-node");
            node.setData(clave, valor, this);
            this.Tree.appendChild(node);
        }
    }

    newValue(path){
        let actual = this.dataSet;
        for (let i = 0; i < path.length - 1; i++) {
            actual = actual[path[i]];
        }
        let NewButton = {};
        this.AddNewButton(NewButton);
        actual[""] = NewButton;
    }

    setValue(path, value) {
        let actual = this.dataSet;
        for (let i = 0; i < path.length - 1; i++) {
            actual = actual[path[i]];
        }

        let old_value = actual[path.at(-1)]
        delete actual[path.at(-1)];
        actual[value] = old_value;
    }

    deleteValue(path) {
        let actual = this.dataSet;
        for (let i = 0; i < path.length - 1; i++) {
            actual = actual[path[i]];
        }
        delete actual[path.at(-1)];
    }


    get() {
        const copia = JSON.parse(JSON.stringify(this.dataSet));
        this.removeNewButtons(copia);
        this.replaceEmptyObjects(copia);
        console.log(copia);

    }

    AddNewButton(obj){
        Datasets.AddNewButton(obj);
    }
    static AddNewButton(obj) {   
        obj.NewButton = true;        
        for (const [key, valor] of Object.entries(obj)) {
            let value = valor
            if (valor == null) {
                obj[key] = {};
                value = obj[key];
            }
            if (value !== null && typeof value === "object") {
                this.AddNewButton(value);
            } 
        }
    }

    removeNewButtons(obj) {
        if (obj === null || typeof obj !== "object") return;
        if (obj.NewButton) {
            delete obj.NewButton;
        }
        for (const valor of Object.values(obj)) {
            this.removeNewButtons(valor);
        }

    }
    replaceEmptyObjects(obj) {
        if (obj === null || typeof obj !== "object") return;

        for (const clave in obj) {
            const valor = obj[clave];

            if (
                valor &&
                typeof valor === "object" &&
                !Array.isArray(valor)
            ) {
                if (Object.keys(valor).length === 0) {
                    obj[clave] = null;
                } else {
                    this.replaceEmptyObjects(valor);
                }
            }
        }
    }

}

