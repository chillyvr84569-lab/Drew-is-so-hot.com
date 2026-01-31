const container = document.getElementById('games-container');
const searchInput = document.getElementById('searchInput');

// 1. Fetch and Render with Categories
fetch('games.json')
    .then(response => response.json())
    .then(data => {
        renderCards(data);
        searchInput.addEventListener('input', () => {
            const term = searchInput.value.toLowerCase();
            const filtered = data.filter(item => item.title.toLowerCase().includes(term));
            renderCards(filtered);
        });
    });

function renderCards(data) {
    if (!container) return;
    container.innerHTML = "";
    
    // The specific categories you requested
    const categories = ["Games", "Social Media", "Movies", "Proxies"];

    categories.forEach(cat => {
        const filtered = data.filter(item => item.category === cat);
        
        // Only create a section if there are items in that category
        if (filtered.length > 0) {
            const section = document.createElement('div');
            section.style.width = "100%";
            section.innerHTML = `<h2 style="color: #bc13fe; text-shadow: 0 0 10px #bc13fe; margin-top: 30px; font-family: 'Orbitron', sans-serif;">${cat}</h2>`;
            container.appendChild(section);

            filtered.forEach(item => {
                const card = document.createElement('div');
                card.className = 'game-card';
                
                const isUrl = item.thumb.startsWith('http');
                const iconHtml = isUrl 
                    ? `<img src="${item.thumb}" onerror="this.src='https://via.placeholder.com/150'">`
                    : `<div style="font-size: 80px; padding: 20px;">${item.thumb}</div>`;

                card.innerHTML = `${iconHtml}<h3 class="card-title">${item.title}</h3>`;
                
                // The about:blank Cloaker Logic
                card.onclick = () => {
                    const win = window.open('about:blank', '_blank');
                    win.document.body.style.margin = '0';
                    win.document.body.style.height = '100vh';
                    const iframe = win.document.createElement('iframe');
                    iframe.style.border = 'none';
                    iframe.style.width = '100%';
                    iframe.style.height = '100%';
                    iframe.src = item.url;
                    win.document.body.appendChild(iframe);
                };
                container.appendChild(card);
            });
        }
    });
}

// 2. Clock Logic (Fixed Brackets)
function startClock() {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;
    
    setInterval(() => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}
startClock();

// 3. Panic Button (Canvas Redirect)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        window.location.href = 'https://canvas.instructure.com/login/canvas';
    }
});
