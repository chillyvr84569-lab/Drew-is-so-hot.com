const container = document.getElementById('game-container');
const googleProxy = "https://translate.google.com/translate?sl=en&tl=es&u=";

fetch('./games.json')
    .then(res => res.json())
    .then(data => renderCards(data))
    .catch(err => console.error("JSON Error:", err));

function renderCards(data) {
    if (!container) return;
    container.innerHTML = "";
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'game-card';
        
        // Check if thumb is a URL or an emoji
        const isUrl = item.thumb.startsWith('http');
        const iconHtml = isUrl 
            ? `<img src="${item.thumb}" onerror="this.src='https://via.placeholder.com/150'">` 
            : `<div style="font-size: 80px; padding: 20px;">${item.thumb}</div>`;

        card.innerHTML = `${iconHtml}<h3>${item.title}</h3>`;
        
        card.onclick = () => {
            let targetUrl = item.url;
            // Only proxy external sites, keep Google Docs direct
            if (!item.url.includes("google.com")) {
                targetUrl = googleProxy + encodeURIComponent(item.url);
            }

            const win = window.open('about:blank', '_blank');
            if (win) {
                win.opener = null;
                win.location.href = targetUrl;
            } else {
                window.location.href = targetUrl;
            }
        };
        container.appendChild(card);
    });
}

window.addEventListener('keydown', (e) => {
    if (e.key === '~') window.location.replace("https://classroom.google.com");
});
