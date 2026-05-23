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

function updateGrid(){
    if(!main) return;

    const widthA = navA?.getBoundingClientRect().width ?? 240;
    const widthC = navC?.getBoundingClientRect().width ?? 240;

    main.style.gridTemplateColumns = `${widthA}px 1fr 1fr`;
}

const resizeObserver = new ResizeObserver(updateGrid);

if(navA) resizeObserver.observe(navA);
if(navC) resizeObserver.observe(navC);

window.addEventListener("resize", updateGrid);

requestAnimationFrame(updateGrid);
 
});
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

function buildTextHTML(text){

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
    margin:1em;
    color:#aaa;
    font-family:monospace;
">
📄 EMPTY FRAME<br><br>
No file loaded yet.<br>
Click a navigation item to load content.
</div>
`;

    return TEMPLATE_HTML
        .replaceAll("__FONT_SIZE__", size)
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
// LOAD FILE INTO IFRAME
// ==============================

async function loadTextFile(frameId, file){
    try{
		await initTemplate();
        const response = await fetch(file);
        const text =
			(await response.text()).trimStart();
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



