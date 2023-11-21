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

// Listen for settings changes
let FoxBrowser;

browser.storage.local.get("foxBrowser").then(data => {
    FoxBrowser = data?.foxBrowser;
});

browser.storage.local.onChanged.addListener(changes => {
    FoxBrowser = changes.foxBrowser.newValue;
});

// Register interceptor
browser.webRequest.onBeforeSendHeaders.addListener(
    details => {
        if (!FoxBrowser) return;

        intercepted();

        for (const header of details.requestHeaders) {
            if (header.name.toLowerCase() === "user-agent") {
                header.value = userAgent();
            }
        }
    },
    { urls: ["<all_urls>"] },
    ["blocking", "requestHeaders"]
);

// User-Agent Generation
function userAgent() {
    const agent = generateNewUserAgent(FoxBrowser);

    return agent;
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
    const version = BrowserVersions[browserName];

    let details = `${browserName}/${version}`;

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