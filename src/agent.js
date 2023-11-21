// User-Agent Configuration
const OperatingSystems = [
    "Windows NT 10.0; Win64; x64",
    "Macintosh; Intel Mac OS X 10_15_7",
    "X11; Linux x86_64"
];

const BrowserVersions = {
    "edge": "119.0.0.0",
    "ie": "11.0",
    "chrome": "119.0.0.0",
    "firefox": "119.0",
    "safari": "15.0",
    "opera": "104.0.0.0"
};

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
let FoxBrowser;

browser.storage.local.get("foxBrowser").then(data => {
    FoxBrowser = data?.foxBrowser;

    updateAgent();
});

browser.storage.local.onChanged.addListener(changes => {
    FoxBrowser = changes.foxBrowser.newValue;

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
    return OperatingSystems[Math.floor(Math.random() * OperatingSystems.length)];
}

function getBrowserDetails(browserName) {
    const version = BrowserVersions[browserName],
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