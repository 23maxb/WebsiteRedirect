const fileInput = document.getElementsByClassName('importFile');
const exportButton = document.getElementById("exportBans");
let ul = document.getElementById("banslist");
let bans;

//handles bans exports
exportButton.addEventListener("click", async () => {
    let bans = await browser.storage.local.get('bans');
    let jsToDownload = JSON.stringify(bans);
    let blob = new Blob([jsToDownload], {type: "application/json"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'bans.json';
    a.click();
    a.remove();
});


//add new imported bans
fileInput[0].addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
        reader.onload = async (e) => {
            const bans = JSON.parse(e.target.result);
            Object.keys(bans).forEach((key) => {
                browser.storage.local.set({[key]: bans[key]});
            });
            refreshBans();
        };
        const reader = new FileReader();
        reader.readAsText(file);
    }
});

let redirs;
fetch('redirs.txt')
    .then(response => response.text())
    .then(data => {
        redirs = data.split('\n');
    });

function refreshBans() {
    bans = browser.storage.local.get('bans').then((bans) => {
        return bans;
    });
    const template = document.getElementById("redirectsTemplate");
    ul.innerHTML = '';
    bans.then((bans) => {
        Object.keys(bans).forEach((key) => {
            const element = template.content.firstElementChild.cloneNode(true);
            element.querySelector(".title").textContent = key;
            element.querySelector(".pathname").textContent = bans[key];
            element.querySelector("button").addEventListener("click", async () => {
                await browser.storage.local.remove(key);
            });

            ul.appendChild(element);
        })
    });
}