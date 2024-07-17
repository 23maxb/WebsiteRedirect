const fileInput = document.getElementsByClassName('importFile');
const exportButton = document.getElementById("exportBans");
const saveButton = document.getElementById("refresh");
const revertButton = document.getElementById("reload");
let ul = document.getElementById("banlist");
let bans;

// Handles bans exports
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

// Add new imported bans
fileInput[0].addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
        reader.onload = async (e) => {
            const bans = JSON.parse(e.target.result);
            await browser.storage.local.set({bans});
            refreshBans();
        };
        const reader = new FileReader();
        reader.readAsText(file);
    }
});

function addNewBan() {
    ul.appendChild(generateNode("", ""));
    checkAndAddNewBan();
}

// Template generator
function generateNode(source, destination) {
    const template = document.getElementById("redirectsTemplate");
    const clone = template.content.firstElementChild.cloneNode(true);
    clone.getElementsByClassName("start")[0].value = source;
    clone.getElementsByClassName("destination")[0].value = destination;
    clone.getElementsByClassName("delete")[0].addEventListener("click", async function (event) {
        event.target.closest("div").remove();
        checkAndAddNewBan();
    });
    clone.getElementsByClassName("start")[0].addEventListener("input", checkAndAddNewBan);
    clone.getElementsByClassName("destination")[0].addEventListener("input", checkAndAddNewBan);
    return clone;
}

// Fetch bans from storage
async function refreshBans() {
    const result = await browser.storage.local.get('bans');
    bans = result.bans || {};
    ul.innerHTML = ''; // Clear the list before adding new items
    Object.entries(bans).forEach(([key, value]) => {
        ul.appendChild(generateNode(key, value));
    });
    checkAndAddNewBan();
}

function checkAndAddNewBan() {
    const redirects = ul.children;
    let allFilled = true;
    for (let redirect of redirects) {
        const start = redirect.getElementsByClassName("start")[0].value;
        const destination = redirect.getElementsByClassName("destination")[0].value;
        if (!start && !destination) {
            allFilled = false;
            break;
        }
    }
    if (allFilled || redirects.length === 0) {
        addNewBan();
    }
}

// Save changes
saveButton.addEventListener("click", async () => {
    const redirects = ul.children;
    const newBans = {};
    for (let redirect of redirects) {
        const start = redirect.getElementsByClassName("start")[0].value.trim();
        const destination = redirect.getElementsByClassName("destination")[0].value.trim();
        if (start && destination) {
            newBans[start] = destination;
        }
    }
    await browser.storage.local.set({bans: newBans});
    alert("Changes saved successfully!");
});

// Revert changes
revertButton.addEventListener("click", () => {
    refreshBans();
    alert("Changes reverted to last saved state.");
});

// Initial load
refreshBans();