import { OperatingSystems, BrowserVersions } from "./config.js";

// Send messages to view/settings.js
let ViewChannelPort = null,
    InterceptedRequests = 0;

chrome.runtime.onConnect.addListener(port => {
    if (port.name === "popup") {
        ViewChannelPort = port;

        ViewChannelPort.postMessage(InterceptedRequests);

        ViewChannelPort.onDisconnect.addListener(() => {
            ViewChannelPort = null;
        });
    }
});

function intercepted() {
    if (!ViewChannelPort) return;

    InterceptedRequests++;

    ViewChannelPort.postMessage(InterceptedRequests);
}

browser.webRequest.onBeforeSendHeaders.addListener(
    () => {
        if (!FoxBrowser) return;

        intercepted();
    },
    { urls: ["<all_urls>"] }
);

// Listen for settings changes
let FoxBrowser,
    FoxSystem;

browser.storage.local.get(null).then(data => {
    FoxBrowser = data?.foxBrowser;
    FoxSystem = data?.foxSystem || "windows";

    updateAgent();
});

browser.storage.local.onChanged.addListener(changes => {
    if (changes.foxBrowser) FoxBrowser = changes.foxBrowser.newValue;
    if (changes.foxSystem) FoxSystem = changes.foxSystem.newValue;

    updateAgent();
});

// Register agent overrides
function updateAgent() {
    const rule = {
        id: 1,
        priority: 1,
        action: {
            type: "modifyHeaders",
            requestHeaders: [{
                operation: "set",
                header: "user-agent",
                value: userAgent()
            }]
        },
        condition: {
            resourceTypes: Object.values(browser.declarativeNetRequest.ResourceType)
        }
    };

    browser.declarativeNetRequest.updateDynamicRules({
        addRules: FoxBrowser ? [rule] : [],
        removeRuleIds: [1]
    });
}

setInterval(updateAgent, 20000);

// User-Agent Generation
function userAgent() {
    if (!FoxBrowser) return;

    return generateNewUserAgent(FoxBrowser);
}

function generateNewUserAgent(browserName) {
    const osDetails = getRandomOSDetails(browserName),
        browserDetails = getBrowserDetails(browserName);

    return `Mozilla/5.0 (${osDetails}) AppleWebKit/537.36 (KHTML, like Gecko) ${browserDetails}`;
}

function getRandomOSDetails() {
    const versions = OperatingSystems[FoxSystem];

    return versions[Math.floor(Math.random() * versions.length)];
}

function getRandomBrowserVersion(browserName) {
    const versions = BrowserVersions[browserName];

    return versions[Math.floor(Math.random() * versions.length)];
}

function getBrowserDetails(browserName) {
    const version = getRandomBrowserVersion(browserName),
        name = browserName === "ie" ? "MSIE" : browserName.charAt(0).toUpperCase() + browserName.slice(1);

    let details = `${name}/${version}`;

    if (browserName === "chrome" || browserName === "edge") {
        details += ` Safari/537.36`;
    } else if (browserName === "edge") {
        details += ` Edg/${version}`;
    } else if (browserName === "firefox") {
        details = `rv:${version}) Gecko/20100101 Firefox/${version}`;
    } else if (browserName === "opera") {
        details = `OPR/${version}`;
    }

    return details;
}