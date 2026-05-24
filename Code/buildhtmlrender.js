window.addEventListener("load", () => {
    console.log("SCRIPT LOADED");
    // ==============================
    // FILE LINK HANDLERS
    // ==============================
    document.querySelectorAll(".file-link").forEach(link => {
		document.addEventListener("click", (e) => {
			const link = e.target.closest(".file-link");
			if (!link) return;

			loadTextFile(link.dataset.frame, link.dataset.file);
		});
    });
    // =========Defaults===========
    loadTextFile("frameB", "./General Sources/Introduction");
    loadTextFile("frameC", "./Gospel/John");
    loadTextFile("frameD", "./General Sources/Resources");
});
// ==============================
// HIGHLIGHT SCHEME
// ==============================
function getHighlightScheme(highlightSchemes) {
    const selected = document.getElementById("highlightSelector")?.value;
    return highlightSchemes?.[selected] ?? { bg: "#000", text: "#fff" };
}
// ==============================
// fetch text file
// ==============================
async function fetchTextFile(file) {
    const response = await fetch(file);
    if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
    }
    return await response.text();
}
// ==============================
// Handle Iframe Error
// ==============================
function handleIframeError(err, iframe) {
    console.error(err);
    iframe.srcdoc = buildTextHTML(
        "ERROR",
        {
            bg: "#400",
            text: "#fff"
        }
    );
}
// ==============================
// IFRAME LOAD
// ==============================
function attachIframeLoadHandler(iframe, frameId, file) {
    iframe.addEventListener(
        "load",
        () => {
            updateIframeTitle(frameId, file);
        },
        { once: true }
    );
}
// ==============================
// LOAD FILE INTO IFRAME
// ==============================
async function loadTextFile(
    frameId,
    file
) {
    const iframe = document.getElementById(frameId);
    if (!iframe) return;
    try {
        await initTemplate();
        if (!iframe) return;
		const text = await fetchTextFile(file);
		const scheme = getHighlightScheme(highlightSchemes);
		attachIframeLoadHandler(iframe, frameId, file);
		iframe.srcdoc = buildTextHTML(text, scheme);
    } catch (err) {
    handleIframeError(err, iframe);
	}
}
