class CustomSelect extends HTMLElement {
    constructor() {
        super();
        this.menuOpen = false;
        this.row = -1;
        this.name = "";
        this.absolute_name = "";
        this.options = []
        this.current = null;
        this.list = null;
        this.onChange = null
        this.tree = null
        this.value = null
    }

    // Pasamos los parámetros cuando instanciamos o mediante un método de inicialización
    init(row, name, onChange) {
        this.row = row;
        this.name = name;
        this.absolute_name = `${name}_${row}`
        this.onChange = onChange;

        this.classList.add("select-box");
        this.setAttribute("data-name", this.name);
        this.current = document.createElement("div");
        this.current.classList.add("current");
        this.current.tabIndex = 0;
        this.list = document.createElement("ul");

        this.addEventListener("click", () => {
            if (this.menuOpen) {
                this.current.blur();
            } else {
                this.menuOpen = true;
            }
        });

        this.current.addEventListener("blur", () => {
            this.menuOpen = false;
        });
        
        this.makeOptions()
    }

    makeOptions() {
        const fullOptions = [null, ...this.options];
        if (this.current && this.contains(this.current)) {
            this.removeChild(this.current);
        }

        if (this.list && this.contains(this.list)) {
            this.removeChild(this.list);
        }
        this.current.innerHTML = "";
        this.list.innerHTML = "";

        fullOptions.forEach(option => {
            const value = document.createElement("div");
            value.classList.add("value");

            const input = document.createElement("input");
            input.type = "radio";
            input.name = this.absolute_name;
            input.id = `${this.absolute_name}_${option}`;
            input.value = option ?? "";

            const p = document.createElement("p");
            p.textContent = option ?? ""; // Si es null, muestra texto vacío

            if (this.onChange) {
                input.addEventListener("change", (e)=>{
                    if (this.value == e.target.value) {return}
                    this.value = e.target.value;
                    this.onChange(e)
                });
            }

            value.appendChild(input);
            value.appendChild(p);
            this.current.appendChild(value);

            if (option === null) {
                input.checked = true;
                input.disabled = true;
            } else {
                const li = document.createElement("li");
                const label = document.createElement("label");
                label.setAttribute("for", `${this.absolute_name}_${option}`);
                label.textContent = option;
                li.appendChild(label);
                this.list.appendChild(li);
            }
        });

        this.appendChild(this.current);
        this.appendChild(this.list);

    }

    setOptions(options = []){
        this.options = options;
        this.makeOptions()
    }

    setTree(tree= {}){
        this.tree = tree;
        this.options = [];
        Object.keys(this.tree).forEach(e => {this.options.push(e);});
        this.makeOptions()
    }

    getTreeSelect(){return this.tree[this.value];}

    getValue(){return this.value;}

    setValue(value) {
        let input = this.querySelector(`input[value="${value}"]`);
        if (input == null) {
            input = this.querySelector(`input[value=""]`);
        }
        input.checked = true;
        this.value = input.value;
        input.dispatchEvent(new Event('change', { bubbles: false }));
        // input.change()
    }
}

// Registro del Custom Element
customElements.define("custom-select", CustomSelect);

