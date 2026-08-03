class HelpTooltip extends HTMLElement {
    constructor() {
        super();
        this.text = "";
        this.span = null;
    }

    init(text) {
        this.text = text;
        this.clear();

        // Icono de interrogación integrado en el DOM para mejor accesibilidad y focus
        const icon = document.createElement("div");
        icon.classList.add("tooltip-icon");
        icon.textContent = "?";
        icon.tabIndex = 0; // Permite navegación con teclado

        // Flotante con el mensaje
        this.span = document.createElement("span");
        this.span.classList.add("tooltip-text");
        this.span.innerHTML = this.text;

        this.appendChild(icon);
        this.appendChild(this.span);

        // Eventos para calcular la posición óptima antes de mostrar
        this.addEventListener("mouseenter", () => this.positionTooltip());
        icon.addEventListener("focus", () => this.positionTooltip());
    }

    positionTooltip() {
        if (!this.span) return;

        const rect = this.getBoundingClientRect();
        const tooltipWidth = 260;  // Ancho estimado del tooltip
        const tooltipHeight = 80;  // Alto estimado del tooltip
        const margin = 10;

        // Resetear clases de posicionamiento previo
        this.span.className = "tooltip-text";

        // 1. Evaluar espacio Vertical (Arriba o Abajo)
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < tooltipHeight && rect.top > tooltipHeight) {
            this.span.classList.add("pos-top");
        } else {
            this.span.classList.add("pos-bottom");
        }

        // 2. Evaluar espacio Horizontal (Izquierda o Derecha)
        const spaceRight = window.innerWidth - rect.right;
        if (spaceRight < tooltipWidth && rect.left > tooltipWidth) {
            this.span.classList.add("pos-left");
        } else {
            this.span.classList.add("pos-right");
        }
    }

    clear() {
        this.innerHTML = "";
    }

    reload() {
        this.init(this.text);
    }
}

if (!customElements.get("help-tooltip")) {
    customElements.define("help-tooltip", HelpTooltip);
}