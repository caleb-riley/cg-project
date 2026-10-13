export const createEmptyTableau = (constraints, variables) => {
    const tableau = [];

    for (let rowIndex = 0; rowIndex <= constraints.length; rowIndex++)
        tableau.push(Array(constraints.length + variables.length + 1).fill(0));

    return tableau;
};

export const buildFilledTableau = (tableau, objective, constraints, variables, visualizationEvents) => {
    visualizationEvents.push({ type: "code", line: 2 });

    const columnCount = variables.length + constraints.length + 1;

    visualizationEvents.push({ type: "code", line: 3 });

    for (let constraintIndex = 0; constraintIndex < constraints.length; constraintIndex++) {
        const constraint = constraints[constraintIndex];
        const tableauRow = tableau[constraintIndex];

        for (const term of constraint.expression.terms) {
            tableauRow[variables.indexOf(term.variable)] = term.coefficient;

            visualizationEvents.push({
                type: "set",
                row: constraintIndex,
                column: variables.indexOf(term.variable),
                value: term.coefficient,
            });
        }

        tableauRow[variables.length + constraintIndex] = 1;

        visualizationEvents.push({
            type: "set",
            row: constraintIndex,
            column: variables.length + constraintIndex,
            value: 1,
        });

        tableauRow[columnCount - 1] = constraint.constant;

        visualizationEvents.push({
            type: "set",
            row: constraintIndex,
            column: -1,
            value: constraint.constant,
        });
    }

    visualizationEvents.push({ type: "code", line: 4 });

    const objectiveRow = tableau[tableau.length - 1];

    for (const term of objective.terms) {
        objectiveRow[variables.indexOf(term.variable)] = -term.coefficient;

        visualizationEvents.push({
            type: "set",
            row: -1,
            column: variables.indexOf(term.variable),
            value: -term.coefficient,
        });
    }
};

const identifyPivotColumn = (objectiveRow, visualizationEvents) => {
    let pivotColumn = undefined;

    for (let columnIndex = 0; columnIndex < objectiveRow.length - 1; columnIndex++) {
        visualizationEvents.push({
            type: "check",
            row: -1,
            column: columnIndex,
        });

        if (objectiveRow[columnIndex] >= 0)
            continue;

        if (pivotColumn === undefined) {
            pivotColumn = columnIndex;
            continue;
        }

        visualizationEvents.push({
            type: "compare",
            row1: -1,
            column1: columnIndex,
            row2: -1,
            column2: pivotColumn,
        });

        if (objectiveRow[columnIndex] < objectiveRow[pivotColumn])
            pivotColumn = columnIndex;
    }

    return pivotColumn;
};

const EPSILON = 1e-9;

const identifyPivotRow = (tableau, pivotColumn, visualizationEvents) => {
    const columnCount = tableau[0].length;

    let pivotRow = undefined;
    let bestRatio = Infinity;

    for (let rowIndex = 0; rowIndex < tableau.length - 1; rowIndex++) {
        visualizationEvents.push({ type: "code", line: 11 });

        const entry = tableau[rowIndex][pivotColumn];

        visualizationEvents.push({
            type: "check",
            row: rowIndex,
            column: pivotColumn,
        });

        if (entry <= EPSILON)
            continue;

        visualizationEvents.push({ type: "code", line: 12 });

        const ratio = tableau[rowIndex][columnCount - 1] / entry;

        visualizationEvents.push({
            type: "check",
            row: rowIndex,
            column: -1,
        });

        if (ratio < bestRatio) {
            pivotRow = rowIndex;
            bestRatio = ratio;
        }
    }

    if (pivotRow !== undefined)
        visualizationEvents.push({ type: "code", line: 14 });

    return pivotRow;
};

export const solveSystem = (tableau, variables, visualizationEvents) => {
    const objectiveRow = tableau[tableau.length - 1];
    const columnCount = objectiveRow.length;

    visualizationEvents.push({ type: "code", line: 5 });

    const basis = [];

    for (let rowIndex = 0; rowIndex < tableau.length - 1; rowIndex++)
        basis.push(variables.length + rowIndex);

    while (true) {
        visualizationEvents.push({ type: "code", line: 7 });

        visualizationEvents.push({ type: "code", line: 8 });

        const pivotColumn = identifyPivotColumn(objectiveRow, visualizationEvents);

        visualizationEvents.push({ type: "code", line: 9 });

        if (pivotColumn === undefined)
            break;

        const pivotRow = identifyPivotRow(tableau, pivotColumn, visualizationEvents);

        visualizationEvents.push({ type: "code", line: 13 });

        if (pivotRow === undefined)
            return { status: "unbounded" };

        visualizationEvents.push({ type: "code", line: 16 });

        const pivotElement = tableau[pivotRow][pivotColumn];

        visualizationEvents.push({ type: "code", line: 17 });

        for (let columnIndex = 0; columnIndex < objectiveRow.length; columnIndex++) {
            const newValue = tableau[pivotRow][columnIndex] / pivotElement;
            tableau[pivotRow][columnIndex] = newValue;

            visualizationEvents.push({
                type: "set",
                row: pivotRow,
                column: columnIndex,
                value: newValue,
            });
        }

        for (let rowIndex = 0; rowIndex < tableau.length; rowIndex++) {
            visualizationEvents.push({ type: "code", line: 18 });

            if (rowIndex === pivotRow)
                continue;

            const factor = tableau[rowIndex][pivotColumn];

            if (factor === 0)
                continue;

            visualizationEvents.push({ type: "code", line: 19 });

            for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {

                const newValue = tableau[rowIndex][columnIndex] - factor * tableau[pivotRow][columnIndex];
                tableau[rowIndex][columnIndex] = newValue;

                visualizationEvents.push({
                    type: "set",
                    row: rowIndex,
                    column: columnIndex,
                    value: newValue,
                });
            }

            visualizationEvents.push({ type: "code", line: 20 });
        }

        visualizationEvents.push({ type: "code", line: 21 });

        basis[pivotRow] = pivotColumn;
    }

    visualizationEvents.push({ type: "code", line: 23 });

    const solution = Array(variables.length).fill(0);

    for (let rowIndex = 0; rowIndex < basis.length; rowIndex++) {

        if (basis[rowIndex] < variables.length) {
            visualizationEvents.push({ type: "code", line: 24 });

            solution[basis[rowIndex]] = tableau[rowIndex][columnCount - 1];
        } else {
            visualizationEvents.push({ type: "code", line: 25 });
        }
    }

    visualizationEvents.push({ type: "code", line: 26 });

    return { status: "optimal", value: objectiveRow[columnCount - 1], solution, visualizationEvents };
};
