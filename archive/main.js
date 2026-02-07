/* archive/main.js - High Performance Version */
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('games-grid');
    const searchBar = document.getElementById('search');
    let allGames = [];

    // Load Data
    fetch('./games.json')
        .then(res => res.json())
        .then(data => {
            allGames = data;
            renderGrid(allGames);
        })
        .catch(err => console.error("Data Load Error:", err));

    // Search Logic
    searchBar.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allGames.filter(g => g.title.toLowerCase().includes(term));
        renderGrid(filtered);
    });

    function renderGrid(list) {
        gameContainer.innerHTML = '';
        
        list.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            
            // Handle missing images with a default gray box
            const thumb = game.thumb || 'https://via.placeholder.com/150?text=No+Image';

            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${thumb}" alt="${game.title}" loading="lazy">
                </div>
                <h3>${game.title}</h3>
                <button class="play-btn">Launch</button>
            `;
            
            card.querySelector('.play-btn').onclick = () => launchGame(game);
            gameContainer.appendChild(card);
        });
    }

    function launchGame(game) {
        // If 'direct' is true, do NOT cloak (prevents white screen/refused connection)
        if (game.direct) {
            const win = window.open(game.url, '_blank');
            if(!win) alert("Pop-up blocked! Please allow pop-ups for this site.");
        } 
        // Otherwise, use the Stealth Cloaker
        else {
            const win = window.open('about:blank', '_blank');
            if (!win) {
                alert("Pop-up blocked! Please allow pop-ups.");
                return;
            }

            // Fake the tab title to look like work
            win.document.title = "Google Docs";
            
            // Reset body styles
            win.document.body.style.margin = "0";
            win.document.body.style.height = "100vh";
            win.document.body.style.backgroundColor = "#111"; // Dark bg while loading
            win.document.body.style.overflow = "hidden";

            // Create the iframe
            const iframe = win.document.createElement('iframe');
            iframe.style.border = "none";
            iframe.style.width = "100vw";
            iframe.style.height = "100vh";
            iframe.src = game.url;
            
            // CRITICAL: Permissions for 1v1.LOL, Krunker, etc.
            iframe.allow = "fullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; accelerometer; cursor-lock; payment";
            
            win.document.body.appendChild(iframe);
        }
    }
});
