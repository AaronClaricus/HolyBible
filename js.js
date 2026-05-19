window.addEventListener("DOMContentLoaded", function () {

    console.log("SCRIPT LOADED");

    // ==============================
    // TOGGLE NESTED MENUS
    // ==============================
    document.querySelectorAll(".toggle").forEach(function(toggle){
        toggle.addEventListener("click", function(){
            const nested = this.nextElementSibling;
            if(!nested) return;

            nested.classList.toggle("open");

            if(nested.classList.contains("open")){
                this.textContent = this.textContent.replace("▶","▼");
            } else {
                this.textContent = this.textContent.replace("▼","▶");
            }
        });
    });

    // ==============================
    // FONT SIZE CONTROL
    // ==============================
    const fontSelector = document.getElementById("fontSelector");

    if(fontSelector){
        fontSelector.addEventListener("change", function(){
            document.documentElement.style.setProperty("--font-size", this.value);
            updateIframeFonts();
        });
    }

    // ==============================
    // FILE LINK HANDLERS
    // ==============================
    document.querySelectorAll(".file-link").forEach(function(link){
        link.addEventListener("click", function(){
            loadTextFile(this.dataset.frame, this.dataset.file);
        });
    });

    // ==============================
    // DEFAULT LOAD (FIXED ISSUE)
    // ==============================
    loadTextFile("frameB", "./Introduction");
    loadTextFile("frameC", "./Gospel/John");
    loadTextFile("frameD", "./Resources");

    // ==============================
    // GRID SETUP (SAFE VERSION)
    // ==============================
    const navA = document.getElementById("navA");
    const navC = document.getElementById("navC");
    const main = document.getElementById("main");

    function updateGrid(){
        const widthA = navA ? navA.offsetWidth : 240;
        const widthC = navC ? navC.offsetWidth : 240;

        // fallback-safe layout (you only have 3 columns)
        if(main){
            main.style.gridTemplateColumns =
                widthA + "px 1fr 1fr";
        }
    }

    const resizeObserver = new ResizeObserver(updateGrid);

    if(navA) resizeObserver.observe(navA);
    if(navC) resizeObserver.observe(navC);

    window.addEventListener("resize", updateGrid);
    updateGrid();

});


// ==============================
// LOAD TEXT INTO IFRAMES
// ==============================
function buildTextHTML(text){

    const size = getComputedStyle(document.documentElement)
        .getPropertyValue("--font-size");

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
html, body{
    margin:0;
    padding:0.5em;
    width:100%;
    height:100%;
    overflow:auto;
    font-family:monospace;
    font-size:${size};
    white-space:pre-wrap;
    overflow-wrap:break-word;
    word-break:break-word;
    line-height:1.4;
    background:#000;
    color:#E0E0E0;
    box-sizing:border-box;
}
</style>
</head>
<body>
${text && text.trim()
    ? escapeHTML(text)
    : `
<div style="
    border:2px dashed #666;
    padding:1em;
    margin:1em;
    color:#aaa;
    font-family:monospace;
">
    📄 EMPTY FRAME<br><br>
    No file loaded yet.<br>
    Click a navigation item to load content.
</div>
`}
</body>
</html>
`;
}


// ==============================
// HTML ESCAPE
// ==============================
function escapeHTML(str){
    return str
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;");
}


// ==============================
// LOAD FILE INTO IFRAME
// ==============================
async function loadTextFile(frameId, file){

    try{

        const response = await fetch(file);

        const text = await response.text();

        const iframe =
            document.getElementById(frameId);

        if(iframe){

            iframe.srcdoc =
                buildTextHTML(text);

            // UPDATE TITLE BAR
            updateIframeTitle(
                frameId,
                file
            );
        }

    } catch(error){

        const iframe =
            document.getElementById(frameId);

        if(iframe){

            iframe.srcdoc = buildTextHTML(
                "ERROR LOADING FILE:\n\n" +
                file +
                "\n\nCheck path and server."
            );

            updateIframeTitle(
                frameId,
                "ERROR"
            );
        }
    }
}

// ==============================
// UPDATE IFRAME FONT SIZE
// ==============================
function updateIframeFonts(){

    ["frameB","frameD"].forEach(function(id){

        const iframe = document.getElementById(id);

        try{
            const doc = iframe.contentDocument ||
                        iframe.contentWindow.document;

            if(doc && doc.body){
                doc.body.style.fontSize =
                    getComputedStyle(document.documentElement)
                        .getPropertyValue("--font-size");
            }

        } catch(e){}
    });

}



// ==============================
// CHANGE FONT BACKGROUND COLOR WHEN HIGHLIGHTED
// ==============================


const iframe = document.getElementById("frameB");

iframe.onload = () => {
    const doc = iframe.contentDocument;

    const style = doc.createElement("style");
    style.textContent = `
        ::selection {
            background: #030303;
            color: #008529;
        }

        ::-moz-selection {
            background: #030303;
            color: #008529;
        }
    `;

    doc.head.appendChild(style);
};

// ==============================
// CHANGE FONT BACKGROUND COLOR WHEN HIGHLIGHTED
// ==============================


const iframe3 = document.getElementById("frameC");

iframe.onload = () => {
    const doc = iframe.contentDocument;

    const style = doc.createElement("style");
    style.textContent = `
        ::selection {
            background: #030303;
            color: #008529;
        }

        ::-moz-selection {
            background: #030303;
            color: #008529;
        }
    `;

    doc.head.appendChild(style);
};
// ==============================
// CHANGE FONT BACKGROUND COLOR WHEN HIGHLIGHTED
// ==============================


const iframe2 = document.getElementById("frameD");

iframe2.onload = () => {
    const doc = iframe2.contentDocument;

    const style = doc.createElement("style");
    style.textContent = `
        ::selection {
            background: #141414;
            color: #008529;
        }

        ::-moz-selection {
            background: #141414;
            color: #008529;
        }
    `;

    doc.head.appendChild(style);
};

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

    red: {
        bg: "#141414",
        text: "#DAA520"
    },

    purple: {
        bg: "#141414",
        text: "#7b1fa2"
    },

    dark: {
        bg: "#141414",
        text: "#00ff99"
    }
};

function applyHighlightScheme(frameId, scheme) {

    const iframe =
        document.getElementById(frameId);

    if (!iframe) return;

    const injectStyle = () => {

        const doc = iframe.contentDocument;

        if (!doc) return;

        let style =
            doc.getElementById(
                "dynamicHighlightStyle"
            );

        if (!style) {

            style = doc.createElement("style");

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
    };

    iframe.addEventListener(
        "load",
        injectStyle
    );

    if (
        iframe.contentDocument &&
        iframe.contentDocument.readyState === "complete"
    ) {
        injectStyle();
    }
}

function applySchemeToAllIframes() {

    const scheme =
        highlightSchemes[
            highlightSelector.value
        ];

    applyHighlightScheme(
        "frameB",
        scheme
    );

    applyHighlightScheme(
        "frameC",
        scheme
    );
    applyHighlightScheme(
        "frameD",
        scheme
    );
}

highlightSelector.addEventListener(
    "change",
    applySchemeToAllIframes
);

applySchemeToAllIframes();














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




const toggleButton = document.getElementById("layoutToggle");

toggleButton.addEventListener("click", function(){

    document.body.classList.toggle("two-panel");

    if(document.body.classList.contains("two-panel")){

        toggleButton.textContent = "Switch to 3 Panel Mode";

    } else {

        toggleButton.textContent = "Switch to 2 Panel Mode";

    }

});



