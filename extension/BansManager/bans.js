fetch('bans.txt')
    .then(response => response.text())
    .then(text => console.log(text))

const fileInput = document.getElementsByClassName('importFile');

//handles exportds
let exportButton = document.getElementById("exportBans");
exportButton.addEventListener("click", async () => {
    fetch('redirs.txt')
        .then(response => response.text())
        .then(data => {
            // Here, data is the content of the text file as a string
            const fileName = 'redirs.txt';
            const blob = new Blob([data], {type: 'text/plain'});
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

let newChanges = false;
let redirs;
fetch('redirs.txt')
    .then(response => response.text())
    .then(data => {
        redirs = data.split('\n');
    });