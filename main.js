import { setupContent } from "./content.js";
import { bindInterfaceEvents } from "./interface.js";

window.addEventListener("load", () => {
    setupContent();
    bindInterfaceEvents();

    console.log("Page ready");
});
