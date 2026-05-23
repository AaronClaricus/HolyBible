
// ==============================
// CHANGE FONT BACKGROUND COLOR WHEN HIGHLIGHTED DYNAMIC
// ==============================
const highlightSelector =
    document.getElementById("highlightSelector");
const highlightSchemes = {
    blue: {
        bg: "#141414",
        text: "#0066ff"
    },
    yellow: {
        bg: "#141414",
        text: "#ffd54f"
    },
    green: {
        bg: "#141414",
        text: "#008529"
    },
    orange: {
        bg: "#141414",
        text: "#c45f00"
    },
    purple: {
        bg: "#141414",
        text: "#7b1fa2"
    },
    lightgreen: {
        bg: "#141414",
        text: "#00ff99"
    }
};


// ==============================
// RELOAD IFRAMES ON HIGHLIGHT CHANGE
// ==============================
highlightSelector.addEventListener(
    "change",
    function(){

        loadTextFile("frameB", "./Introduction");
        loadTextFile("frameC", "./Gospel/John");
        loadTextFile("frameD", "./Resources");

    }
);
