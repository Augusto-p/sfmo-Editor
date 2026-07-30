class languageSelector extends HTMLElement {
    constructor() {
        super();
        this.menuOpen = false;
        this.name = "";
        this.options = []; // Espera objetos: { code: 'es', name: 'Español', flag: '/path/to/es.svg' }
        this.current = null;
        this.list = null;
        this.onChange = null;
        this.value = null;
    }

    init(name, onChange) {
        this.name = name;
        this.onChange = onChange;

        this.classList.add("language-select-box");
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

        this.makeOptions();
    }

    makeOptions() {
        const fullOptions = [null, ...this.options];
        
        if (this.current && this.contains(this.current)) this.removeChild(this.current);
        if (this.list && this.contains(this.list)) this.removeChild(this.list);

        this.current.innerHTML = "";
        this.list.innerHTML = "";

        fullOptions.forEach(option => {
            const optVal = option ? (option.code || option.name) : "";
            const optName = option ? option.name : "";
            const optFlag = option ? option.flag : "";

            const value = document.createElement("div");
            value.classList.add("value");

            const input = document.createElement("input");
            input.type = "radio";
            input.name = this.name;
            input.id = `${this.name}_${optVal}`;
            input.value = optVal.toUpperCase();

            // Renderizado del item (Bandera Redonda + Texto)
            const wrapper = document.createElement("div");
            wrapper.classList.add("option-content");

            if (optFlag) {
                const img = document.createElement("img");
                img.src = optFlag;
                img.alt = optName;
                img.classList.add("flag-icon");
                wrapper.appendChild(img);
            }


            if (this.onChange) {
                input.addEventListener("change", (e) => {
                    if (this.value === e.target.value) return;
                    this.value = e.target.value;
                    this.onChange(e);
                });
            }

            value.appendChild(input);
            value.appendChild(wrapper);
            this.current.appendChild(value);

            if (option === null) {
                input.checked = true;
                input.disabled = true;
            } else {
                const li = document.createElement("li");
                const label = document.createElement("label");
                label.setAttribute("for", `${this.name}_${optVal}`);

                const itemWrapper = document.createElement("div");
                itemWrapper.classList.add("option-content");

                if (optFlag) {
                    const img = document.createElement("img");
                    img.src = optFlag;
                    img.alt = optName;
                    img.classList.add("flag-icon");
                    itemWrapper.appendChild(img);
                }

                const span = document.createElement("span");
                span.textContent = optName;
                itemWrapper.appendChild(span);

                label.appendChild(itemWrapper);
                li.appendChild(label);
                this.list.appendChild(li);
            }
        });

        this.appendChild(this.current);
        this.appendChild(this.list);
    }

    setOptions(options = []) {
        this.options = options;
        this.makeOptions();
    }
    getValue() { return this.value; }

    setValue(value) {
        let input = this.querySelector(`input[value="${value}"]`);
        if (!input) input = this.querySelector(`input[value=""]`);
        input.checked = true;
        this.value = input.value;
        input.dispatchEvent(new Event('change', { bubbles: false }));
    }
}

customElements.define("language-selector", languageSelector);