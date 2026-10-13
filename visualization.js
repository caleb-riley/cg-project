export const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const EVENT_DURATION = 0.1;

const highlightLine = (lineNumber) => {
    document.querySelectorAll(".code-line.active").forEach(e => e.classList.remove("active"));

    document.getElementById(`line-${lineNumber}`)?.classList.add("active");
};

const roundToPlace = (number, place) => {
    const factor = Math.pow(10, place);

    return Math.round(number * factor) / factor;
};

const highlightValueChange = async (cellElement, newValue, duration) => {
    const originalBackgroundColor = cellElement.style.backgroundColor;
    const originalTextColor = cellElement.style.color;

    cellElement.style.backgroundColor = "yellow";
    cellElement.style.color = "black";

    await sleep(duration / 2);

    cellElement.innerText = roundToPlace(newValue, 3).toString();

    await sleep(duration / 2);

    cellElement.style.backgroundColor = originalBackgroundColor;
    cellElement.style.color = originalTextColor;
};

const highlightCell = async (cellElement, backgroundColor, textColor, duration) => {
    const originalBackgroundColor = cellElement.style.backgroundColor;
    const originalTextColor = cellElement.style.color;

    cellElement.style.backgroundColor = backgroundColor;
    cellElement.style.color = textColor;

    await sleep(duration);

    cellElement.style.backgroundColor = originalBackgroundColor;
    cellElement.style.color = originalTextColor;
};

const highlightCellComparison = async (cellElement1, cellElement2, backgroundColor, textColor, duration) => {
    const originalBackgroundColor1 = cellElement1.style.backgroundColor;
    const originalTextColor1 = cellElement1.style.color;
    const originalBackgroundColor2 = cellElement2.style.backgroundColor;
    const originalTextColor2 = cellElement2.style.color;

    cellElement1.style.backgroundColor = backgroundColor;
    cellElement1.style.color = textColor;
    cellElement2.style.backgroundColor = backgroundColor;
    cellElement2.style.color = textColor;

    await sleep(duration);

    cellElement1.style.backgroundColor = originalBackgroundColor1;
    cellElement1.style.color = originalTextColor1;
    cellElement2.style.backgroundColor = originalBackgroundColor2;
    cellElement2.style.color = originalTextColor2;
};

const getCellElement = (tableau, rowIndex, columnIndex) => {
    if (rowIndex < 0)
        rowIndex += tableau.length;

    if (columnIndex < 0)
        columnIndex += tableau[0].length;

    return document.getElementById(`cell-${rowIndex}-${columnIndex}`);
};

export const populateTableauElement = (tableau, sortedVariables) => {
    const tableauElement = document.getElementById("tableau-table");

    tableauElement.replaceChildren();

    const slackVariables = [];

    for (let constraintIndex = 0; constraintIndex < tableau.length - 1; constraintIndex++)
        slackVariables.push(`s${constraintIndex}`);

    const variableRow = document.createElement("tr");

    for (const variable of [...sortedVariables, ...slackVariables, "RHS"]) {
        const tableData = document.createElement("td");
        tableData.innerText = variable;
        variableRow.appendChild(tableData);
    }

    tableauElement.appendChild(variableRow);

    for (let rowIndex = 0; rowIndex < tableau.length; rowIndex++) {
        const tableRow = document.createElement("tr");

        for (let columnIndex = 0; columnIndex < tableau[0].length; columnIndex++) {
            const cellValue = tableau[rowIndex][columnIndex];

            const tableData = document.createElement("td");
            tableData.innerText = roundToPlace(cellValue, 3).toString();
            tableData.id = `cell-${rowIndex}-${columnIndex}`;
            tableRow.appendChild(tableData);
        }

        tableauElement.appendChild(tableRow);
    }
};

export const visualizeEvents = async (tableau, visualizationEvents) => {
    for (const event of visualizationEvents) {
        if (event.type === "set") {
            const cellElement = getCellElement(tableau, event.row, event.column);

            await highlightValueChange(cellElement, event.value, EVENT_DURATION);
        } else if (event.type === "check") {
            const cellElement = getCellElement(tableau, event.row, event.column);

            await highlightCell(cellElement, "#c64d02", "white", EVENT_DURATION);
        } else if (event.type === "compare") {
            const cellElement1 = getCellElement(tableau, event.row1, event.column1);
            const cellElement2 = getCellElement(tableau, event.row2, event.column2);

            await highlightCellComparison(cellElement1, cellElement2, "#007e17", "white", EVENT_DURATION);
        } else if (event.type === "code") {
            highlightLine(event.line);

            await sleep(EVENT_DURATION);
        }
    }
};
