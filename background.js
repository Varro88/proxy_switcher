function updateUI(isProxyEnabled) {
    if (isProxyEnabled) {
        browser.action.setIcon({
            path: {
                "48": '/icons/red-circle-icon.png'
            }
        });
        browser.action.setTitle({ title: "Proxy is ON" });
        console.log("Proxy is set");
    }
    else {
        browser.action.setIcon({
            path: {
                "48": '/icons/green-circle-icon.png'
            }
        });
        browser.action.setTitle({ title: "Proxy is OFF" });
        console.log("No proxy");
    }
}

async function getProxyState() {
    const settings = await browser.proxy.settings.get({});
    return settings.value;
}

async function switchProxyState() {

    let isAllowed = await browser.extension.isAllowedIncognitoAccess();
    if(!isAllowed) {
        console.warn(`Allow using extension in private mode: Context menu -> Manage extension -> Allow for Private Windows`);
        return;
    }

    let proxySettings = await getProxyState();
    if (proxySettings.proxyType == "none") {
        proxySettings.proxyType = "manual";
        try {
            await browser.proxy.settings.set({value: proxySettings});
            updateUI(true);
            console.log("Proxy was set to 'manual'");
        }
        catch (e) {
            console.warn("Error enabling proxy" + e);
        }
    }
    else {
        try {
            proxySettings.proxyType = "none";
            await browser.proxy.settings.set({value: proxySettings});
            updateUI(false);
            console.log("Proxy was set to 'none'");
        }
        catch (e) {
            console.warn("Error disabling proxy" + e);
        }
    }
}

async function init() {
    let proxySettings = await getProxyState();
    updateUI(proxySettings.proxyType != "none");
}

browser.action.onClicked.addListener(switchProxyState);
browser.runtime.onInstalled.addListener(init);
