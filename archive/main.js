document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('games-grid');
    const searchBar = document.getElementById('search');
    let allGames = [];

    // Fetch and validate JSON
    fetch('./games.json')
        .then(res => res.json())
        .then(data => {
            allGames = data;
            renderGrid(allGames);
        })
        .catch(err => {
            console.error("Critical Load Error:", err);
            gameContainer.innerHTML = `<div style="color:white; background:red; padding:20px; border-radius:10px;">
                🚨 ERROR LOADING LIBRARY: Check if your games.json has a stray comma!
            </div>`;
        });

    // Instant Search
    searchBar.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allGames.filter(g => 
            g.title.toLowerCase().includes(term) || 
            g.category.toLowerCase().includes(term)
        );
        renderGrid(filtered);
    });

    function renderGrid(list) {
        gameContainer.innerHTML = '';
        list.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <div class="card-inner">
                    <img src="${game.thumb}" alt="${game.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=App'">
                    <div class="card-info">
                        <h3>${game.title}</h3>
                        <span class="category-tag">${game.category}</span>
                        <button class="play-btn">Launch</button>
                    </div>
                </div>
            `;
            card.querySelector('.play-btn').onclick = () => launchGame(game);
            gameContainer.appendChild(card);
        });
    }

    function launchGame(game) {
        // 'direct' links (Discord/IG/now.gg) open normally to avoid frame-blocks
        if (game.direct) {
            window.open(game.url, '_blank');
        } 
        // All others use the about:blank stealth cloaker
        else {
            const win = window.open('about:blank', '_blank');
            if (!win) return alert("Pop-ups are blocked! Enable them to use the cloaker.");

            win.document.title = "Google Docs";
            win.document.body.style = "margin:0; height:100vh; overflow:hidden; background:#000;";
            
            const iframe = win.document.createElement('iframe');
            iframe.style = "width:100vw; height:100vh; border:none;";
            iframe.src = game.url;
            
            // Essential for Shooters (1v1.LOL, Krunker) and Sound
            iframe.allow = "fullscreen; autoplay; cursor-lock; clipboard-write; encrypted-media; gyroscope; accelerometer";
            
            win.document.body.appendChild(iframe);
        }
    }
});
