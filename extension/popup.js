console.log("HI!!")
browser.tabs.query({windowId: browser.windows.WINDOW_ID_CURRENT})
    .then((tabs) => {
        // tabs is an array of tab objects
        console.log(tabs);
        const template = document.getElementById("li_template");
        const elements = new Set();
        for (const tab of tabs) {
            const element = template.content.firstElementChild.cloneNode(true);
            element.querySelector(".title").textContent = tab.title;
            element.querySelector(".pathname").textContent = tab.url;
            element.querySelector("a").addEventListener("click", async () => {
                await browser.tabs.update(tab.id, {active: true});
                await browser.windows.update(tab.windowId, {focused: true});
            });
            elements.add(element);
        }
        document.querySelector("ul").append(...elements);
        const button = document.querySelector("button");
        button.addEventListener("click", async () => {
            const tab = await browser.tabs.query({active: true, currentWindow: true});
            const tabId = tab[0].id;
            const newUrl = "BansManager/bans.html"; // Replace with the path to your new HTML page
            await browser.tabs.update(tabId, {url: newUrl});
        });
    })
    .catch((error) => {
        console.error(error);
    });