/**
 * Representa un nodo en el Árbol de Sintaxis Abstracta (AST)
 */
class ASTNode {
    constructor(value, sons = []) {
        this.value = value;
        this.sons = sons;
    }
}

/**
 * Encargado de analizar y convertir la cadena de texto en un AST.
 */
class Parser {
    static PRECEDENCIA_OPERADORES = [
        ["||", "OR"],
        ["&&", "AND"],
        ["==", "!=", "<>", ">=", "<=", ">", "<"],
        ["+", "-"],
        ["*", "/"],
        ["^"]
    ];

    /**
     * Parsea una expresión en texto y genera el AST.
     * @param {string} expresion 
     * @returns {ASTNode}
     */
    parse(expresion) {
        expresion = expresion.trim();

        // Eliminar paréntesis envolventes redundantes: "(A == B)" -> "A == B"
        while (
            expresion.startsWith("(") && 
            expresion.endsWith(")") && 
            this._esParentesisBalanceado(expresion.slice(1, -1))
        ) {
            expresion = expresion.slice(1, -1).trim();
        }

        // Cadena literal entre comillas
        if (this._esTextoLiteral(expresion)) {
            return new ASTNode(expresion);
        }

        // 1. Operadores binarios según precedencia
        for (const grupoOps of Parser.PRECEDENCIA_OPERADORES) {
            let nivel = 0;
            let charComilla = null;

            for (let i = expresion.length - 1; i >= 0; i--) {
                const c = expresion[i];

                if (c === "'" || c === '"') {
                    if (!charComilla) charComilla = c;
                    else if (charComilla === c) charComilla = null;
                    continue;
                }

                if (charComilla) continue;

                if (c === ")") nivel++;
                else if (c === "(") nivel--;

                if (nivel !== 0) continue;

                for (const op of grupoOps) {
                    if (expresion.substr(i).startsWith(op)) {
                        // Validar límites de palabras para operadores alfanuméricos (AND, OR)
                        if (/^[A-Z]+$/.test(op)) {
                            const charBefore = expresion[i - 1];
                            const charAfter = expresion[i + op.length];
                            if (/[a-zA-Z0-9_]/.test(charBefore) || /[a-zA-Z0-9_]/.test(charAfter)) {
                                continue;
                            }
                        }

                        const izq = expresion.slice(0, i).trim();
                        const der = expresion.slice(i + op.length).trim();

                        if (izq !== "" && der !== "") {
                            return new ASTNode(op, [this.parse(izq), this.parse(der)]);
                        }
                    }
                }
            }
        }

        // 2. Llamada a Función: FUNCION(arg1, arg2)
        const p = expresion.indexOf("(");
        if (p !== -1 && expresion.endsWith(")")) {
            const nombreFuncion = expresion.slice(0, p).trim();
            const contenido = expresion.slice(p + 1, -1);
            const args = this._dividirArgumentos(contenido);

            return new ASTNode(nombreFuncion, args.map(arg => this.parse(arg)));
        }

        // 3. Nodo Hoja (valor, variable o literal)
        return new ASTNode(expresion);
    }

    _esTextoLiteral(str) {
        return (str.startsWith("'") && str.endsWith("'")) || 
               (str.startsWith('"') && str.endsWith('"'));
    }

    _dividirArgumentos(contenido) {
        const args = [];
        let actual = "";
        let nivel = 0;
        let charComilla = null;

        for (let i = 0; i < contenido.length; i++) {
            const c = contenido[i];

            if (c === "'" || c === '"') {
                if (!charComilla) charComilla = c;
                else if (charComilla === c) charComilla = null;
                actual += c;
                continue;
            }

            if (!charComilla) {
                if (c === "(") nivel++;
                else if (c === ")") nivel--;

                if (c === "," && nivel === 0) {
                    args.push(actual.trim());
                    actual = "";
                    continue;
                }
            }

            actual += c;
        }

        if (actual.trim() !== "") {
            args.push(actual.trim());
        }

        return args;
    }

    _esParentesisBalanceado(str) {
        let nivel = 0;
        let charComilla = null;

        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            if (c === "'" || c === '"') {
                if (!charComilla) charComilla = c;
                else if (charComilla === c) charComilla = null;
                continue;
            }
            if (charComilla) continue;

            if (c === "(") nivel++;
            else if (c === ")") nivel--;

            if (nivel < 0) return false;
        }
        return nivel === 0;
    }
}

/**
 * Encargado de evaluar un AST dado un contexto (dataView y fila opcional).
 */
class Evaluator {
    constructor(dataView = null) {
        this.dataView = dataView;
    }

    /**
     * Evalúa el AST.
     * @param {ASTNode} node 
     * @param {Object|Array} row 
     * @returns {*}
     */
    evaluate(node, row = null) {
        if (!node) return null;

        // Hoja
        if (node.sons.length === 0) {
            return this.resolveValue(node.value, row);
        }

        // Operador Unario
        if (node.value === "NOT" || node.value === "!") {
            return !this.evaluate(node.sons[0], row);
        }

        const left = this.evaluate(node.sons[0], row);
        const right = this.evaluate(node.sons[1], row);

        switch (node.value.toUpperCase()) {
            case "==": return left === right;
            case "!=": 
            case "<>": return left !== right;
            case ">":  return left > right;
            case "<":  return left < right;
            case ">=": return left >= right;
            case "<=": return left <= right;
            case "&&":
            case "AND": return Boolean(left && right);
            case "||":
            case "OR":  return Boolean(left || right);
            case "+":  return Number(left) + Number(right);
            case "-":  return Number(left) - Number(right);
            case "*":  return Number(left) * Number(right);
            case "/":  return Number(right) !== 0 ? Number(left) / Number(right) : 0;
            case "^":  return Math.pow(Number(left), Number(right));
            default:
                throw new Error(`Operador desconocido: ${node.value}`);
        }
    }

    /**
     * Resuelve hojas individuales (números, strings, variables de columna).
     */
    resolveValue(valor, row = null) {
        if (typeof valor !== "string") return valor;

        const trimVal = valor.trim();
        const upperVal = trimVal.toUpperCase();

        if (upperVal === "TRUE") return true;
        if (upperVal === "FALSE") return false;

        // Texto literal
        if (
            (trimVal.startsWith("'") && trimVal.endsWith("'")) ||
            (trimVal.startsWith('"') && trimVal.endsWith('"'))
        ) {
            return trimVal.slice(1, -1);
        }

        // Número
        if (!isNaN(trimVal) && trimVal !== "") {
            return Number(trimVal);
        }

        // Variable ${Columna}
        const columnName = FormulaEngine.extractColumnName(trimVal);
        if (columnName !== null && row && this.dataView) {
            const colIndex = this.dataView.getColumnIndex(columnName);
            return colIndex !== -1 ? row[colIndex] : null;
        }

        return trimVal;
    }
}

/**
 * Clase principal que orquesta el Parser, Evaluator y las Funciones especializadas.
 */
class FormulaEngine {
    constructor(dataView = null) {
        this.dataView = dataView;
        this.parser = new Parser();
        this.evaluator = new Evaluator(dataView);
    }

    /**
     * Resuelve una fórmula que empieza por "=" o devuelve el valor original.
     * @param {*} value 
     * @returns {*}
     */
    resolveValue(value) {
        if (typeof value !== "string" || !value.startsWith("=")) {
            return value;
        }

        const expresion = value.slice(1).trim();
        if (!expresion) return value;

        const ast = this.parser.parse(expresion);

        switch (ast.value.toUpperCase()) {
            case "SUM.IF":
                return this.sumIf(ast.sons[0], ast.sons[1]);
            case "COUNT.IF":
                return this.countIf(ast.sons[0]);
            default:
                return this.evaluator.evaluate(ast);
        }
    }

    sumIf(termNode, conditionNode) {
        if (!termNode || !this.dataView) return 0;

        let sum = 0;
        const termRaw = termNode.value.trim();
        const columnName = FormulaEngine.extractColumnName(termRaw);
        const columnIndex = columnName !== null ? this.dataView.getColumnIndex(columnName) : -1;

        this.dataView.data.forEach((row) => {
            if (this.evaluator.evaluate(conditionNode, row)) {
                let val = columnIndex !== -1 ? row[columnIndex] : termRaw;
                let num = Number(val);
                if (!isNaN(num)) {
                    sum += num;
                }
            }
        });

        return sum;
    }

    countIf(conditionNode) {
        if (!this.dataView) return 0;

        let count = 0;
        this.dataView.data.forEach((row) => {
            if (this.evaluator.evaluate(conditionNode, row)) {
                count++;
            }
        });

        return count;
    }

    static extractColumnName(text) {
        if (typeof text !== "string") return null;
        const match = text.match(/\$\{([^}]*)\}/);
        return match ? match[1] : null;
    }
}