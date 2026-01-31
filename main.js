const container = document.getElementById('game-container');
const searchBar = document.getElementById('search-bar');
const googleProxy = "https://translate.google.com/translate?sl=en&tl=en&u=";

fetch('./games.json')
    .then(res => res.json())
    .then(data => renderCards(data))
    .catch(err => console.error("Could not load resources:", err));

function renderCards(data) {
    if (!container) return;
    container.innerHTML = "";
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'game-card';
        
        const isUrl = item.thumb.startsWith('http');
        const iconHtml = isUrl 
            ? `<img src="${item.thumb}" onerror="this.src='https://via.placeholder.com/150'">` 
            : `<div style="font-size: 80px; padding: 20px;">${item.thumb}</div>`;

        card.innerHTML = `${iconHtml}<h3>${item.title}</h3>`;
        card.onclick = () => openLink(item.url);
        container.appendChild(card);
    });
}

function openLink(url) {
    let finalUrl = url;
    // Proxy external sites, but keep Google Docs and YoLearn direct
    if (!url.includes("google.com") && !url.includes("yolearn.org")) {
        finalUrl = googleProxy + encodeURIComponent(url);
    }

    const win = window.open('about:blank', '_blank');
    if (win) {
        win.opener = null;
        win.location.replace(finalUrl);
    } else {
        window.location.href = finalUrl;
    }
}

if (searchBar) {
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            let val = searchBar.value.trim();
            if (val.includes('.')) {
                if (!val.startsWith('http')) val = 'https://' + val;
                openLink(val);
            }
        }
    });
}

window.addEventListener('keydown', (e) => {
    if (e.key === '~' || e.key === '`') window.location.replace("https://classroom.google.com");
});
