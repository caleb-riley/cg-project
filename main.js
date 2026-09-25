const DESCRIPTION_PARAGRAPHS = [
    "Linear programming is important because it provides a systematic way to optimize several variables under a set of constraints. This has several applications, including resource allocation in finance, where you can maximize profits while minimizing the use of valuable resources such as time, money, and materials. It is used by thousands of major corporations to streamline supply chains, cut transportation and fuel costs, and manage inventory. It replaces the guesswork within these domains, solving constrained systems in a fraction of the time it took prior to its discovery.",
    "This project is an interactive web-based pedagogical aid designed to support understanding of linear programming and how it relates to solving linear equations under certain constraints. The application will allow the user to input a list of linear equations, along with the constraints a potential solution must adhere to, and display a visual representation of the algorithm's execution, listing each step of the process and highlighting the changes in a geometric output. The application will parse the user's input into a more interpretable intermediate format and feed these inputs into the underlying algorithm of choice to solve it. To aid in understanding of the linear programming algorithm, pseudocode will be displayed on the page adjacent to the standard output, highlighting the current step that is being executed.",
];

const REFERENCE_ENTRIES = [
    { title: "Linear Programming Wikipedia Page", link: "https://en.wikipedia.org/wiki/Linear_programming" },
    { title: "MIT Linear Programming Lecture Notes", link: "https://math.mit.edu/~goemans/18310S15/lpnotes310.pdf" },
    { title: "Simplex Algorithm Wikipedia Page", link: "https://en.wikipedia.org/wiki/Simplex_algorithm" },
    { title: "Cambridge Simplex Algorithm Lecture Notes", link: "https://www.cl.cam.ac.uk/teaching/2324/RandAlgthm/1up/lec7_simplex.pdf" },
    { title: "Purdue Simplex Algorithm Lecture Notes", link: "https://www.pnw.edu/wp-content/uploads/2020/03/attendance5-1.pdf" },
];

const addDescriptionParagraphs = () => {
    const descriptionContainer = document.getElementById("heading-description");

    for (const paragraphText of DESCRIPTION_PARAGRAPHS) {
        const paragraphElement = document.createElement("p");

        paragraphElement.innerText = paragraphText;
        paragraphElement.className = "class=\"description-paragraph\"";
        paragraphElement.style.textAlign = "justify";

        descriptionContainer.appendChild(paragraphElement);
    }
};

const addReferenceEntries = () => {
    const referenceContainer = document.getElementById("reference-container");

    for (const referenceEntry of REFERENCE_ENTRIES) {
        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", referenceEntry.link);
        linkElement.setAttribute("target", "_blank");
        linkElement.innerText = referenceEntry.title;

        const listItem = document.createElement("li");
        listItem.appendChild(linkElement);

        referenceContainer.appendChild(listItem);
    }
}

const bindCounterEvents = () => {
    const incrementButton = document.getElementById("increment-button");
    const decrementButton = document.getElementById("decrement-button");
    const resetButton = document.getElementById("reset-button");
    const counterLabel = document.getElementById("counter-label");

    const loadCount = () => {
        const count = Number.parseInt(localStorage.getItem("count") ?? "0");

        return Math.max(count, 0);
    }

    const storeCount = (count) => {
        localStorage.setItem("count", count.toString());
    }

    let currentCount = loadCount();

    const setLabelText = (count) => {
        counterLabel.innerText = `Count: ${count}`;
    }

    incrementButton.onclick = () => {
        currentCount += 1;

        setLabelText(currentCount);
        storeCount(currentCount);
    };

    decrementButton.onclick = () => {
        if (currentCount === 0)
            return;

        currentCount -= 1;

        setLabelText(currentCount);
        storeCount(currentCount);
    }

    resetButton.onclick = () => {
        currentCount = 0;

        setLabelText(currentCount);
        storeCount(currentCount);
    }

    setLabelText(currentCount);
};

window.onload = () => {
    addDescriptionParagraphs();
    addReferenceEntries();
    bindCounterEvents();

    console.log("Page ready");
};
