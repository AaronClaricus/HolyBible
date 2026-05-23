window.addEventListener("load", function () {
    console.log("SCRIPT LOADED");
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
            : `<div style="border:2px dashed #666;padding:1em;color:#aaa;">
                EMPTY FRAME
               </div>`;

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
    return str
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;");
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
// LOAD FILE INTO IFRAME
// ==============================
async function loadTextFile(frameId, file){

    // ==============================
    // SAVE OLD SCROLL POSITION
    // ==============================
    const oldIframe =
        document.getElementById(frameId);

    if(
        oldIframe &&
        oldIframe.contentWindow
    ){
        try{
			iframeScrollPositions[frameId] =
			oldIframe.contentDocument?.documentElement?.scrollTop || 0;
        } catch(e){}
    }

    currentFiles[frameId] = file;

    try{

        await initTemplate();

        const response =
            await fetch(file);

        const text =
            await response.text();

        const iframe =
            document.getElementById(frameId);

        const selected =
            document.getElementById("highlightSelector").value;

        const scheme =
            highlightSchemes[selected];

        if(iframe){

            iframe.srcdoc =
                buildTextHTML(text, scheme);

            // ==============================
            // RESTORE SCROLL AFTER LOAD
            // ==============================
            iframe.onload = function(){

                try{

 iframe.contentDocument.documentElement.scrollTop =
    iframeScrollPositions[frameId] || 0;

                } catch(e){}
            };

            updateIframeTitle(frameId, file);
        }

    } catch(error){

        const iframe =
            document.getElementById(frameId);

        if(iframe){

            iframe.srcdoc =
                buildTextHTML(
                    "ERROR",
                    highlightSchemes.green
                );
        }
    }
}
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
