(function () {
    const browsers = document.querySelectorAll(".browser"),
        active = document.getElementById("active"),
        intercepted = document.getElementById("intercepted");

    browsers.forEach(item => {
        item.addEventListener("click", () => {
            if (item.classList.contains("selected")) {
                item.classList.remove("selected");

                setBrowser(false);

                return;
            }

            browsers.forEach((item) => {
                item.classList.remove("selected");
            });

            item.classList.add("selected");

            setBrowser(item.dataset.browser);
        });
    });

    function setBrowser(value) {
        active.innerText = value || "off";

        browser.storage.local.set({
            foxBrowser: value
        });
    }

    browser.storage.local.get("foxBrowser").then(data => {
        const value = data?.foxBrowser;

        active.innerText = value || "off";

        if (!value) return;

        document.querySelector(`.browser[data-browser="${value}"]`).classList.add("selected");
    });

    const port = chrome.runtime.connect({
        name: "popup"
    });

    port.onMessage.addListener(amount => {
        intercepted.innerText = `${amount.toLocaleString()} requests intercepted since startup.`;
    });
})();