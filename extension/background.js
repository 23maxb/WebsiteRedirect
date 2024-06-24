// Event listener for web page navigation
browser.webNavigation.onBeforeNavigate.addListener((details) => {
    fetch('BansManager/redirs.txt').then(response => response.text()).then(data => {
        let redirectRules;
        redirectRules = data.split('\n');
        for (let i = 0; i < redirectRules.length; i++) {
            if ((new RegExp(redirectRules[i]).regex.test(url))) {
                // Redirect to the target URL
                browser.tabs.update(details.tabId, {url: redirectRules[i + 1]});
            }
        }
    });
});