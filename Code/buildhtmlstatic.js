window.addEventListener("load", function () {
    console.log("SCRIPT LOADED");
    // ==============================
    // FILE LINK HANDLERS
    // ==============================
    document.querySelectorAll(".file-link").forEach(link => {
        link.addEventListener("click", function () {
            loadTextFile(this.dataset.frame, this.dataset.file);
        });
    });

    // ==============================
    // DEFAULT LOAD
    // ==============================
    loadTextFile("frameB", "./General Sources/Introduction");
    loadTextFile("frameC", "./Gospel/John");
    loadTextFile("frameD", "./General Sources/Resources");

});
// ==============================
// STATE
// ==============================
// scroll stored PER FILE (not frame)
const scrollState = new Map();
// track what each frame is showing
const frameFiles = {
    frameB: null,
    frameC: null,
    frameD: null
};
// ==============================
// TEMPLATE CACHE
// ==============================
let TEMPLATE_HTML = "";
async function initTemplate() {
    if (TEMPLATE_HTML) return;
    const response = await fetch("./Code/template.html");
    TEMPLATE_HTML = await response.text();
}
// ==============================
// HTML BUILDER
// ==============================
function buildTextHTML(text, scheme) {
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
// ESCAPE
// ==============================
function escapeHTML(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
// ==============================
// TITLE UPDATE
// ==============================
function updateIframeTitle(frameId, filePath) {
    const titleMap = {
        frameB: "titleB",
        frameC: "titleC",
        frameD: "titleD"
    };
    const titleBar = document.getElementById(titleMap[frameId]);
    if (!titleBar) return;
    titleBar.textContent = filePath.split("/").pop();
}
// ==============================
// SCROLL TRACKING (LIVE)
// ==============================
function attachScrollTracking(iframe, file) {
    const doc = iframe.contentDocument;
    if (!doc) return;
    const scrollEl =
        doc.scrollingElement || doc.documentElement || doc.body;
    const handler = () => {
        scrollState.set(file, scrollEl.scrollTop);
    };
    scrollEl.addEventListener("scroll", handler, { passive: true });
    iframe._scrollCleanup = () => {
        scrollEl.removeEventListener("scroll", handler);
    };
}
// ==============================
// DETECT READY + RESTORE SCROLL
// ==============================
function restoreScrollWhenReady(iframe, file) {
    const doc = iframe.contentDocument;
    if (!doc) return;
    const target = scrollState.get(file) || 0;
    const scrollEl =
        doc.scrollingElement || doc.documentElement || doc.body;
    const tryRestore = () => {
        if (!scrollEl) return false;
        scrollEl.scrollTop = target;
        return true;
    };
    // try immediately
    if (tryRestore()) return;
    // deterministic fallback
    const observer = new MutationObserver(() => {
        if (tryRestore()) {
            observer.disconnect();
        }
    });
    observer.observe(doc, {
        childList: true,
        subtree: true
    });
    iframe._restoreObserver = observer;
}
// ==============================
// MAIN LOADER (CLEAN ENGINE)
// ==============================
async function loadTextFile(frameId, file) {
    const iframe = document.getElementById(frameId);
    if (!iframe) return;
    // cleanup old systems
    iframe._scrollCleanup?.();
    iframe._restoreObserver?.disconnect?.();
    frameFiles[frameId] = file;
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
        // render
        iframe.srcdoc = buildTextHTML(text, scheme);
        // deterministic attach AFTER DOM exists
        requestAnimationFrame(() => {
            const doc = iframe.contentDocument;
            if (!doc) return;
            attachScrollTracking(iframe, file);
            restoreScrollWhenReady(iframe, file);
            updateIframeTitle(frameId, file);
        });
    } catch (error) {
        console.error("LOAD ERROR:", error);
        iframe.srcdoc = buildTextHTML("ERROR", {
            bg: "#400",
            text: "#fff"
        });
    }
}
