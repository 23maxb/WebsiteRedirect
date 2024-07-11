let redirectList = new Map();

async function readRedirectionList() {
    browser.storage.local.get('bans').then((bans) => {
        return bans;
    });
}

// Function to check if a URL should be redirected
function whereRedirect(url, redirectList) {
    for (const redirect of redirectList) {
        if (url.includes(redirect)) {

        }
    }

}

// Function to update redirection list
async function updateRedirectionList() {
    const newList = await readRedirectionList();
    if (newList) {
        redirectList = newList;
    }
    return redirectList;
}

// Main function to set up the listener
function setupRedirection() {
    browser.webNavigation.onBeforeNavigate.addListener(
        async (details) => {
            if (shouldRedirect(details.url, redirectList)) {
                console.log(`Redirecting from ${details.url} to Google`);
                await browser.tabs.update(details.tabId, {url: 'BanPage/banned.html'});
            }
        },
        {url: [{schemes: ['http', 'https']}]}
    );
}

// Set up message listener for external updates
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateRedirectionList') {
        updateRedirectionList().then(updatedList => {
            sendResponse({success: true, list: updatedList});
        });
        return true; // Indicates we will send a response asynchronously
    }
});

// Initial setup
async function init() {
    await updateRedirectionList();
    setupRedirection();
    // Set up periodic updates (e.g., every 5 minutes)
    setInterval(updateRedirectionList, 5 * 60 * 1000);
}

// Call the init function
init();