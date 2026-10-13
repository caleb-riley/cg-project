import { Parser } from "./parser.js";
import { createEmptyTableau, buildFilledTableau, solveSystem } from "./solver.js";
import { populateTableauElement, visualizeEvents } from "./visualization.js";

const INITIAL_OBJECTIVE = "5*x1+4*x2+3*x3+7*x4";

const INITIAL_CONSTRAINTS = [
    "x1+x2+x3+x4<=20",
    "2*x1+x2+3*x3+x4<=20",
    "x1+2*x2+3*x4<=22",
    "3*x1+x3+2*x4<=26"
];

const parseUserInputs = (objectionFunctionInput, constraintContainer) => {
    const objectiveFunctionParser = new Parser(objectionFunctionInput.value);
    const objectiveFunction = objectiveFunctionParser.parseExpression();

    const constraints = [];

    for (const constraintEntry of constraintContainer.children) {
        const constraintParser = new Parser(constraintEntry.value);
        constraints.push(constraintParser.parseInequality());
    }

    const variables = new Set();

    for (const constraint of constraints) {
        for (const term of constraint.expression.terms)
            variables.add(term.variable);
    }

    const sortedVariables = [...variables].sort((v1, v2) => v1.localeCompare(v2));

    return { objectiveFunction, constraints, sortedVariables };
};

const addConstraint = (constraintContainer, constraintId) => {
    const constraintElement = document.createElement("input");
    constraintElement.type = "text";
    constraintElement.id = `constraint-${constraintId}`;
    constraintElement.placeholder = "Enter constraint";

    constraintContainer.appendChild(constraintElement);
    constraintContainer.style.display = "flex";
};

const deleteConstraint = (constraintId) => {
    const constraintElement = document.getElementById(`constraint-${constraintId}`);

    if (constraintElement !== null)
        constraintElement.remove();
};

const bindConstraintEvents = () => {
    const constraintContainer = document.getElementById("constraint-container");
    const addConstraintButton = document.getElementById("add-constraint");
    const deleteConstraintButton = document.getElementById("delete-constraint");

    let constraintCount = 0;

    addConstraintButton.addEventListener("click", () => {
        addConstraint(constraintContainer, constraintCount);

        constraintCount += 1;
    });

    deleteConstraintButton.addEventListener("click", () => {
        if (constraintCount > 0) {
            deleteConstraint(constraintCount - 1);

            constraintCount -= 1;
        }
    });
};

const populateInitialInputs = () => {
    const constraintContainer = document.getElementById("constraint-container");
    const objectiveFunctionInput = document.getElementById("objective-function");

    objectiveFunctionInput.value = INITIAL_OBJECTIVE;

    for (let constraintIndex = 0; constraintIndex < INITIAL_CONSTRAINTS.length; constraintIndex++) {
        addConstraint(constraintContainer, constraintIndex);

        const constraintElement = document.getElementById(`constraint-${constraintIndex}`);
        constraintElement.value = INITIAL_CONSTRAINTS[constraintIndex];
    }
};

const onSolveSystemClicked = async () => {
    const objectionFunctionInput = document.getElementById("objective-function");
    const constraintContainer = document.getElementById("constraint-container");
    const solutionContent = document.getElementById("solution-content");

    const { objectiveFunction, constraints, sortedVariables } = parseUserInputs(objectionFunctionInput, constraintContainer);
    const tableau = createEmptyTableau(constraints, sortedVariables);

    populateTableauElement(tableau, sortedVariables);

    const visualizationEvents = [];

    buildFilledTableau(tableau, objectiveFunction, constraints, sortedVariables, visualizationEvents);
    const result = solveSystem(tableau, sortedVariables, visualizationEvents);

    if (result.status === "unbounded") {
        solutionContent.innerText = "System is unbounded";
        solutionContent.style.color = "red";
    } else {
        const variableValues = result.solution;
        const optimalValue = result.value;

        await visualizeEvents(tableau, result.visualizationEvents);

        let solutionText = `Solution: optimal = ${optimalValue}`;

        for (let variableIndex = 0; variableIndex < sortedVariables.length; variableIndex++)
            solutionText += `, ${sortedVariables[variableIndex]} = ${variableValues[variableIndex]}`;

        solutionContent.innerText = solutionText;
        solutionContent.style.color = "white";
    }

    solutionContent.style.display = "block";
};

export const bindInterfaceEvents = () => {
    const solveSystemButton = document.getElementById("solve-system");

    bindConstraintEvents();
    populateInitialInputs();

    solveSystemButton.addEventListener("click", onSolveSystemClicked);
};
