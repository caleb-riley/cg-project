const isAlphabetic = (str) => /^[A-Za-z]$/.test(str);

const isDigit = (str) => /^\d$/.test(str);

export class Parser {
    constructor(text) {
        this.text = text;
        this.position = 0;
    }

    currentChar() {
        return this.text.charAt(this.position);
    }

    parseNumber() {
        let isNegative = false;

        if (this.currentChar() === "-") {
            isNegative = true;

            this.position += 1;
        }

        const start = this.position;

        while (this.position < this.text.length && isDigit(this.currentChar()))
            this.position += 1;

        if (this.position - start == 0)
            return undefined;

        let value = Number.parseFloat(this.text.slice(start, this.position));

        if (isNegative)
            value *= -1;

        return value;
    }

    parseVariable() {
        const start = this.position;

        while (this.position < this.text.length && isAlphabetic(this.currentChar()) || isDigit(this.currentChar()))
            this.position += 1;

        if (this.position - start === 0)
            return undefined;

        return this.text.slice(start, this.position);
    }

    parseTerm() {
        let coefficient = 1.0;

        if (this.currentChar() === "-" || isDigit(this.currentChar())) {
            coefficient = this.parseNumber();

            if (coefficient === undefined)
                return undefined;

            this.position += 1;
        }

        const variable = this.parseVariable();

        if (variable === undefined)
            return undefined;

        return { coefficient, variable };
    }

    parseExpression() {
        const terms = [];

        const firstTerm = this.parseTerm();

        if (firstTerm === undefined)
            return undefined;

        terms.push(firstTerm);

        while (this.position < this.text.length && (this.currentChar() === "+" || this.currentChar() === "-")) {
            const isNegative = this.currentChar() === "-";

            this.position += 1;

            const term = this.parseTerm();

            if (term === undefined)
                return undefined;

            if (isNegative)
                term.coefficient *= -1;

            terms.push(term);
        }

        return { terms };
    }

    parseInequality() {
        const expression = this.parseExpression();

        if (expression === undefined)
            return undefined;

        if (this.text.slice(this.position, this.position + 2) !== "<=")
            return undefined;

        this.position += 2;

        const constant = this.parseNumber();

        if (constant === undefined)
            return undefined;

        return { expression, constant };
    }
}
