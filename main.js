const container = document.getElementById('games-container');
const searchInput = document.getElementById('searchInput');

// 1. Fetch and Render
fetch('games.json')
    .then(res => res.json())
    .then(data => {
        renderCards(data);
        searchInput.addEventListener('input', () => {
            const term = searchInput.value.toLowerCase();
            renderCards(data.filter(item => item.title.toLowerCase().includes(term)));
        });
    });

function renderCards(data) {
    if (!container) return;
    container.innerHTML = "";
    
    const categories = ["Games", "Social Media", "Movies", "Proxies"];

    categories.forEach(cat => {
        const filtered = data.filter(item => item.category === cat);
        if (filtered.length > 0) {
            const h2 = document.createElement('h2');
            h2.style = "color: #bc13fe; text-shadow: 0 0 10px #bc13fe; margin-top: 30px; font-family: 'Orbitron', sans-serif;";
            h2.textContent = cat;
            container.appendChild(h2);

            filtered.forEach(item => {
                const card = document.createElement('div');
                card.className = 'game-card';
                
                // Fixed Icon Logic: If image fails, show a generic icon instead of an error
                const iconHtml = item.thumb.startsWith('http') 
                    ? `<img src="${item.thumb}" onerror="this.src='https://raw.githubusercontent.com/TristanLeila/App-Icons/main/Steam.png'">`
                    : `<div style="font-size: 50px; padding: 10px;">🎮</div>`;

                card.innerHTML = `${iconHtml}<h3 class="card-title">${item.title}</h3>`;
                
                // Standard Open: This fixes the "Refused to Connect" error
                card.onclick = () => {
                    window.open(item.url, '_blank');
                };
                container.appendChild(card);
            });
        }
    });
}

// 2. Clock Logic
setInterval(() => {
    const clock = document.getElementById('clock');
    if (clock) {
        const now = new Date();
        clock.textContent = now.getHours().toString().padStart(2, '0') + ":" + 
                           now.getMinutes().toString().padStart(2, '0') + ":" + 
                           now.getSeconds().toString().padStart(2, '0');
    }
}, 1000);

// 3. Panic Button (Canvas)
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        window.location.href = 'https://canvas.instructure.com/login/canvas';
    }
});
