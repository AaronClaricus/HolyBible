window.addEventListener("load", () => {

    console.log("SCRIPT LOADED");

    // ==============================
    // FILE LINK HANDLERS
    // ==============================
    document.querySelectorAll(".file-link").forEach(link => {

        link.addEventListener("click", () => {

            loadTextFile(
                link.dataset.frame,
                link.dataset.file
            );

        });

    });

    // ==============================
    // DEFAULT LOADS
    // ==============================
    loadTextFile(
        "frameB",
        "./General Sources/Introduction"
    );

    loadTextFile(
        "frameC",
        "./Gospel/John"
    );

    loadTextFile(
        "frameD",
        "./General Sources/Resources"
    );

});


// ==============================
// TRACK CURRENT FILES
// ==============================
const currentFiles = {

    frameB: "./General Sources/Introduction",
    frameC: "./Gospel/John",
    frameD: "./General Sources/Resources"

};


// ==============================
// IFRAME SCROLL MANAGER
// ==============================
const IframeScrollManager = (() => {

    // persistent scroll state
    const positions = {

        frameB: 0,
        frameC: 0,
        frameD: 0

    };

    // ==============================
    // GET TRUE SCROLL CONTAINER
    // ==============================
    function getScrollElement(doc) {

        return doc.getElementById("content");

    }

    // ==============================
    // SAVE SCROLL POSITION
    // ==============================
    function save(frameId, scrollEl) {

        positions[frameId] = scrollEl.scrollTop;

    }

    // ==============================
    // RESTORE SCROLL POSITION
    // ==============================
    function restore(frameId, scrollEl) {

        if (!scrollEl) return;

        const target = positions[frameId] || 0;

        let attempts = 0;
        const maxAttempts = 20;

        function applyRestore() {

            scrollEl.scrollTop = target;

            attempts++;

            // stop once stable
            if (
                Math.abs(
                    scrollEl.scrollTop - target
                ) < 2
            ) {
                return;
            }

            // safety stop
            if (attempts >= maxAttempts) {
                return;
            }

            requestAnimationFrame(
                applyRestore
            );

        }

        requestAnimationFrame(
            applyRestore
        );

    }

    // ==============================
    // INITIALIZE IFRAME
    // ==============================
    function initialize(iframe, frameId) {

        const doc =
            iframe.contentDocument;

        if (!doc) return;

        const scrollEl =
            getScrollElement(doc);

        if (!scrollEl) {

            console.warn(
                "Missing #content in iframe:",
                frameId
            );

            return;
        }

        // restore previous position
        restore(frameId, scrollEl);

        // track scrolling
        const onScroll = () => {

            save(frameId, scrollEl);

        };

        scrollEl.addEventListener(
            "scroll",
            onScroll,
            { passive: true }
        );

        // cleanup handler
        iframe._scrollCleanup = () => {

            scrollEl.removeEventListener(
                "scroll",
                onScroll
            );

        };

    }

    // ==============================
    // CLEANUP
    // ==============================
    function cleanup(iframe) {

        iframe._scrollCleanup?.();

        iframe._scrollCleanup = null;

    }

    return {

        initialize,
        cleanup

    };

})();


// ==============================
// LOAD FILE INTO IFRAME
// ==============================
async function loadTextFile(
    frameId,
    file
) {

    const iframe =
        document.getElementById(frameId);

    if (!iframe) return;

    // remove old listeners
    IframeScrollManager.cleanup(
        iframe
    );
console.log("A");
    currentFiles[frameId] = file;
console.log(
    iframe.contentDocument.activeElement
);
    try {

        await initTemplate();
console.log("B");
        const response =
            await fetch(file);

        const text =
            await response.text();

        // ==============================
        // HIGHLIGHT SCHEME
        // ==============================
        const selected =
            document.getElementById(
                "highlightSelector"
            )?.value;

        const scheme =
            (
                highlightSchemes &&
                highlightSchemes[selected]
            ) || {

                bg: "#000",
                text: "#fff"

            };
console.log("C");
        // ==============================
        // LOAD COMPLETE
        // ==============================
        iframe.addEventListener(
            "load",
            () => {

                IframeScrollManager
                    .initialize(
                        iframe,
                        frameId
                    );

                updateIframeTitle(
                    frameId,
                    file
                );

            },
            { once: true }
        );
console.log("D");
        // ==============================
        // LOAD CONTENT
        // ==============================
        iframe.srcdoc =
            buildTextHTML(
                text,
                scheme
            );

    } catch (err) {

        console.error(err);

        iframe.srcdoc =
            buildTextHTML(
                "ERROR",
                {
                    bg: "#400",
                    text: "#fff"
                }
            );

    }

}





