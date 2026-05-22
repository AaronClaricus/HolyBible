// ==============================
// APPLY DEFAULT HIGHLIGHT STYLE
// ==============================
function setupIframeHighlight(frameId, bgColor, textColor){
    const iframe = document.getElementById(frameId);
    if(!iframe) return;
    iframe.onload = () => {
        const doc = iframe.contentDocument;
        const style = doc.createElement("style");
        style.textContent = `
            ::selection {
                background: ${bgColor};
                color: ${textColor};
            }

            ::-moz-selection {
                background: ${bgColor};
                color: ${textColor};
            }
        `;
        doc.head.appendChild(style);
    };
}
// ==============================
// INITIALIZE IFRAME HIGHLIGHTS
// ==============================
setupIframeHighlight(
    "frameB",
    "#030303",
    "#008529"
);
setupIframeHighlight(
    "frameC",
    "#030303",
    "#008529"
);
setupIframeHighlight(
    "frameD",
    "#141414",
    "#008529"
);
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
// APPLY HIGHLIGHT TO ONE IFRAME
// ==============================
function applyHighlight(frameId, scheme){
    const iframe =
        document.getElementById(frameId);
    if(!iframe) return;
    const doc =
        iframe.contentDocument;
    if(!doc || !doc.head) return;
    let style =
        doc.getElementById(
            "dynamicHighlightStyle"
        );
    if(!style){
        style =
            doc.createElement("style");
        style.id =
            "dynamicHighlightStyle";
        doc.head.appendChild(style);
    }
    style.textContent = `
        ::selection {
            background: ${scheme.bg};
            color: ${scheme.text};
        }

        ::-moz-selection {
            background: ${scheme.bg};
            color: ${scheme.text};
        }
    `;
}
// ==============================
// APPLY HIGHLIGHT TO ALL IFRAMES
// ==============================
function applySchemeToAllIframes(){
    const scheme =
        highlightSchemes[
            highlightSelector.value
        ];
    [
        "frameB",
        "frameC",
        "frameD"
    ].forEach(function(frameId){
        applyHighlight(
            frameId,
            scheme
        );
    });
}
highlightSelector.addEventListener(
    "change",
    applySchemeToAllIframes
);
applySchemeToAllIframes();
// ==============================
// UPDATE IFRAME TITLE FUNCTION
// ==============================
function updateIframeTitle(frameId, filePath) {
    let titleId = "";
    if (frameId === "frameB") {
        titleId = "titleB";
    }
	    if (frameId === "frameC") {
        titleId = "titleC";
    }
    if (frameId === "frameD") {
        titleId = "titleD";
    }
    const titleBar =
        document.getElementById(titleId);
    if (!titleBar) return;
    const parts =
        filePath.split("/");
    const fileName =
        parts[parts.length - 1];
    titleBar.textContent = fileName;
}
// ==============================
// LAYOUT TOGGLE BUTTON
// ==============================
const toggleButton = document.getElementById("layoutToggle");
toggleButton.addEventListener("click", function(){
    document.body.classList.toggle("two-panel");
    if(document.body.classList.contains("two-panel")){
        toggleButton.textContent = "Switch to 3 Panel Mode";
    } else {
        toggleButton.textContent = "Switch to 2 Panel Mode";
    }
});
