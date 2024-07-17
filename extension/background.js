let redirectList = new Map();

async function readRedirectionList() {
    const result = await browser.storage.local.get('bans');
    return result.bans || {};
}

function fetchRedirect(currentURL) {
    for (let [key, value] of redirectList) {
        if (currentURL.includes(key)) {
            if (value === 'ban' || value === '' || value == null) {
                return 'BanPage/banned.html';
            }
            if (value.includes('http://') || value.includes('https://')) {
                return value;
            }
            return 'https://' + value
        }
    }
    return undefined;
}

// Function to update redirection list
async function updateRedirectionList() {
    const newList = await readRedirectionList();
    if (newList) {
        redirectList = new Map(Object.entries(newList));
    }
    return redirectList;
}

// Main function to set up the listener
function setupRedirection() {
    browser.webNavigation.onBeforeNavigate.addListener(
        async (details) => {
            console.log('checked url: ' + details.url);
            console.log("Redirect list:");
            for (let [key, value] of redirectList) {
                console.log(`key: ${key}, value: ${value}`);
            }
            let fetchRedirectResult = fetchRedirect(details.url);
            if (fetchRedirectResult) {
                console.log(`
                Redirecting
                from ${details.url}
                to ${fetchRedirectResult}`);
                await browser.tabs.update(details.tabId, {url: fetchRedirectResult});
            }
        },
        {url: [{schemes: ['http', 'https']}]}
    );
}

// Set up message listener for external updates
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateRedirectionList') {
        updateRedirectionList().then(updatedList => {
            sendResponse({success: true, list: Object.fromEntries(updatedList)});
        });
        return true; // Indicates we will send a response asynchronously
    }
});

// Initial setup
async function init() {
    await updateRedirectionList();
    setupRedirection();
    setInterval(updateRedirectionList, 1000);
}

// Call the init function
init();