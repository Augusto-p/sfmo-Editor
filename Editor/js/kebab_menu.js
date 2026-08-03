class kebabMenu extends HTMLElement {
    constructor() {
        super();
        this.menuOpen = false;
        this.name = "";
        this.options = [];
        this.view = null;
        this.list = null;
        this.onChange = null;
    }

    init(name, onChange) {
        this.name = name;
        this.onChange = onChange;
        this.setAttribute("data-name", this.name);
        this.view = document.createElement("div");
        this.view.classList.add("view");
        this.view.tabIndex = 0;
        this.list = document.createElement("ul");
        [0, 1, 2].forEach(_ => {
            let span = document.createElement("span");
            this.view.appendChild(span);
        })
        this.addEventListener("click", () => { if (this.menuOpen) { this.view.blur(); } else { this.menuOpen = true; } });

        this.view.addEventListener("blur", () => { this.menuOpen = false; });

        this.appendChild(this.view);

        this.makeOptions();

    }

    makeOptions() {
        if (this.list && this.contains(this.list)) this.removeChild(this.list);
        this.list.innerHTML = "";
        this.options.forEach(Option => {
            let li = document.createElement("li");
            let button = document.createElement("button");
            button.textContent = Option.toUpperCase();
            button.addEventListener("click", (e) => {
                if (this.onChange) {
                    e["value"] = Option;
                    this.onChange(e);
                }

            });
            li.appendChild(button);
            this.list.appendChild(li);
        });
        this.appendChild(this.list);
    }

   
    setOptions(options = []) {
        this.options = options;
        this.makeOptions();
    }

}

customElements.define("kebab-menu", kebabMenu);