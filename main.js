function renderCards(data) {
    if (!container) return;
    container.innerHTML = "";
    const cats = ["Games", "Social Media", "Movies", "Proxies"];

    cats.forEach(cat => {
        const filtered = data.filter(item => item.category === cat);
        if (filtered.length > 0) {
            const h2 = document.createElement('h2');
            h2.style = "color: #bc13fe; text-shadow: 0 0 10px #bc13fe; margin-top: 30px; font-family: 'Orbitron', sans-serif;";
            h2.textContent = cat;
            container.appendChild(h2);

            filtered.forEach(item => {
                const card = document.createElement('div');
                card.className = 'game-card';
                card.innerHTML = `
                    ${item.thumb.startsWith('http') ? `<img src="${item.thumb}">` : `<div style="font-size:80px;padding:20px;">${item.thumb}</div>`}
                    <h3 class="card-title">${item.title}</h3>`;
                
                // NO MORE CLOAKER: This opens the site normally so it doesn't get blocked
                card.onclick = () => {
                    window.open(item.url, '_blank');
                };
                container.appendChild(card);
            });
        }
    });
}
