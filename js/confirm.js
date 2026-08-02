class Confirm extends HTMLElement {
    constructor() {
        super();
        this.Button_YES = null;
        this.Button_NO = null;
        this.Text_YES = "YES";
        this.Text_NO = "NO";
        this.onYes = null;
        this.onNo = null;
        this.Title = "";
        this.Description = "";
        this.H_Title = null;
        this.span_Description = null;
    }

    init(onNo, onYes) {
        this.onNo = onNo;
        this.onYes = onYes;

        const container = document.createElement("div");
        container.classList.add("confirm-card");

        this.H_Title = document.createElement("h3");
        this.span_Description = document.createElement("p"); // Cambiado a <p> para mejor flujo tipográfico

        const buttons = document.createElement("div");
        buttons.classList.add("buttons");

        this.Button_NO = document.createElement("button");
        this.Button_NO.classList.add("btn", "btn-no");

        this.Button_YES = document.createElement("button");
        this.Button_YES.classList.add("btn", "btn-yes");

        // Eventos
        this.Button_YES.addEventListener("click", (e) => {
            if (typeof this.onYes === "function") this.onYes(e);
            this.close();
        });

        this.Button_NO.addEventListener("click", (e) => {
            if (typeof this.onNo === "function") this.onNo(e); // Corregido: ejecutaba onYes
            this.close();
        });

        buttons.appendChild(this.Button_NO);
        buttons.appendChild(this.Button_YES);

        container.appendChild(this.H_Title);
        container.appendChild(this.span_Description);
        container.appendChild(buttons);

        this.appendChild(container);
    }

    setText(Title, Description, No = "NO", Yes = "YES") {
        this.Title = Title;
        this.Description = Description;
        this.Text_NO = No;
        this.Text_YES = Yes;

        if (this.H_Title) this.H_Title.textContent = this.Title;
        if (this.span_Description) this.span_Description.textContent = this.Description; // Corregido: .textContent
        if (this.Button_NO) this.Button_NO.textContent = this.Text_NO;
        if (this.Button_YES) this.Button_YES.textContent = this.Text_YES;
    }

    close() {
        if (this.parentElement) {
            this.parentElement.removeChild(this);
        }
    }
}

if (!customElements.get("custom-confirm")) {
    customElements.define("custom-confirm", Confirm);
}