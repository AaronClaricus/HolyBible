window.addEventListener("load", function () {

    console.log("SCRIPT LOADED");

    // ==============================
    // FILE LINK HANDLERS
    // ==============================
    document.querySelectorAll(".file-link").forEach(function(link){

        link.addEventListener("click", function(){

            loadTextFile(
                this.dataset.frame,
                this.dataset.file
            );

        });

    });

    // ==============================
    // DEFAULT LOAD
    // ==============================
    loadTextFile("frameB", "./Introduction");
    loadTextFile("frameC", "./Gospel/John");
    loadTextFile("frameD", "./Resources");

    // ==============================
    // GRID SETUP
    // ==============================
    const navA = document.getElementById("navA");
    const navC = document.getElementById("navC");
    const main = document.getElementById("main");

});


// ==============================
// SCROLL STORAGE
// ==============================
const iframeScrollPositions = {
    frameB: 0,
    frameC: 0,
    frameD: 0
};





// ==============================
// TEMPLATE CACHE
// ==============================
let TEMPLATE_HTML = "";


// ==============================
// LOAD TEMPLATE ONCE
// ==============================
async function initTemplate(){

    if(TEMPLATE_HTML) return;

    const response =
        await fetch("./template.html");

    TEMPLATE_HTML =
        await response.text();
}


// ==============================
// BUILD HTML
// ==============================
function buildTextHTML(text, scheme){

    const size =
        getComputedStyle(document.documentElement)
            .getPropertyValue("--font-size");

    const content =
        text && text.trim()
            ? escapeHTML(text)
            : `
                <div style="
                    border:2px dashed #666;
                    padding:1em;
                    color:#aaa;
                ">
                    EMPTY FRAME
                </div>
            `;

    return TEMPLATE_HTML
        .replaceAll("__FONT_SIZE__", size)
        .replaceAll("__HIGHLIGHT_BG__", scheme.bg)
        .replaceAll("__HIGHLIGHT_TEXT__", scheme.text)
        .replace("__CONTENT__", content);
}


// ==============================
// HTML ESCAPE
// ==============================
function escapeHTML(str){

    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}


// ==============================
// TRACK CURRENT FILES
// ==============================
const currentFiles = {
    frameB: "./Introduction",
    frameC: "./Gospel/John",
    frameD: "./Resources"
};


// ==============================
// UPDATE IFRAME TITLE
// ==============================
function updateIframeTitle(frameId, filePath){

    const titleMap = {
        frameB: "titleB",
        frameC: "titleC",
        frameD: "titleD"
    };

    const titleBar =
        document.getElementById(titleMap[frameId]);

    if(!titleBar) return;

    const fileName =
        filePath.split("/").pop();

    titleBar.textContent =
        fileName;

}


// ==============================
// SAVE CURRENT SCROLL POSITION
// ==============================
function saveScrollPosition(frameId) {

    const iframe =
        document.getElementById(frameId);

    if (!iframe) return;

    try {

        const win =
            iframe.contentWindow;

        const doc =
            iframe.contentDocument;

        if (!win || !doc) return;

        const scrollEl =
            doc.scrollingElement ||
            doc.documentElement ||
            doc.body;

        iframeScrollPositions[frameId] =
            win.scrollY ||
            scrollEl.scrollTop ||
            0;

    } catch (err) {

        console.warn(
            "Scroll save failed:",
            err
        );

    }

}


// ==============================
// LOAD FILE INTO IFRAME
// ==============================
async function loadTextFile(frameId, file) {

    const iframe = document.getElementById(frameId);
    if (!iframe) return;
	if (iframe._scrollHandler && iframe._scrollCleanup) {
    iframe._scrollCleanup();
	}
    
    currentFiles[frameId] = file;

    try {

        await initTemplate();

        const response = await fetch(file);
        const text = await response.text();

        const selected =
            document.getElementById("highlightSelector")?.value;

        const scheme =
            (highlightSchemes && highlightSchemes[selected]) || {
                bg: "#000",
                text: "#fff"
            };

        // clean old handler
  
        iframe.onload = function () {

            const doc = iframe.contentDocument;
            const win = iframe.contentWindow;

            if (!doc || !win) return;

            const scrollEl =
                doc.scrollingElement || doc.documentElement || doc.body;

            const target = iframeScrollPositions[frameId] || 0;

			let i = 0;

			function restore() {
				scrollEl.scrollTop = target;

				if (++i < 20) {
					requestAnimationFrame(restore);
				}
			}

			setTimeout(() => {
				requestAnimationFrame(restore);
			}, 0);

			iframe._scrollHandler = function () {
				iframeScrollPositions[frameId] = scrollEl.scrollTop;
			};

			const handler = iframe._scrollHandler;

			win.addEventListener("scroll", handler, { passive: true });
			doc.addEventListener("scroll", handler, { passive: true });

			// store cleanup
			iframe._scrollCleanup = () => {
				win.removeEventListener("scroll", handler);
				doc.removeEventListener("scroll", handler);
			};
        };
		iframeScrollPositions[frameId] =
		iframeScrollPositions[frameId] || 0;
		saveScrollPosition(frameId);
        iframe.srcdoc = buildTextHTML(text, scheme);

        updateIframeTitle(frameId, file);

    } catch (error) {

        console.error("LOAD ERROR:", error);

        iframe.srcdoc = buildTextHTML("ERROR", {
            bg: "#400",
            text: "#fff"
        });
    }
}
