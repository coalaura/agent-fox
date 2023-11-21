(function () {
    const browsers = document.querySelectorAll(".browser"),
        systems = document.querySelectorAll(".system"),
        active = document.getElementById("active"),
        intercepted = document.getElementById("intercepted");

    selectable(browsers, setConfig, true);
    selectable(systems, setConfig, false);

    function selectable(elements, callback, canUnselect = true) {
        elements.forEach(item => {
            item.addEventListener("click", () => {
                if (item.classList.contains("selected") && canUnselect) {
                    item.classList.remove("selected");
                } else {
                    elements.forEach(el => {
                        el.classList.remove("selected");
                    });

                    item.classList.add("selected");
                }

                callback();
            });
        });
    }

    function setConfig() {
        const selectedBrowser = document.querySelector(".browser.selected"),
            selectedSystem = document.querySelector(".system.selected");

        const foxBrowser = selectedBrowser?.dataset.value || false,
            foxSystem = selectedSystem?.dataset.value || "windows";

        active.innerText = foxBrowser ? `${foxSystem}/${foxBrowser}` : "off";

        browser.storage.local.set({
            foxBrowser: foxBrowser,
            foxSystem: foxSystem
        });
    }

    browser.storage.local.get(null).then(data => {
        const foxBrowser = data?.foxBrowser,
            foxSystem = data?.foxSystem || "windows";

        active.innerText = foxBrowser ? `${foxSystem}/${foxBrowser}` : "off";

        if (foxBrowser) {
            document.querySelector(`.browser[data-value="${foxBrowser}"]`).classList.add("selected");
        }

        document.querySelector(`.system[data-value="${foxSystem}"]`).classList.add("selected");
    });

    const port = chrome.runtime.connect({
        name: "popup"
    });

    port.onMessage.addListener(amount => {
        intercepted.innerText = `${amount.toLocaleString()} requests intercepted since startup.`;
    });
})();