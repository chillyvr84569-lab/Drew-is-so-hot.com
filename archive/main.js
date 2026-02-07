/* archive/main.js - Madman Edition */
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('games-grid');
    const searchBar = document.getElementById('search');
    let allGames = [];

    // --- DATA LOADING WITH CRASH PROTECTION ---
    fetch('./games.json')
        .then(res => {
            if (!res.ok) throw new Error(`File Not Found (Status: ${res.status})`);
            return res.json();
        })
        .then(data => {
            allGames = data;
            renderGrid(allGames);
        })
        .catch(err => {
            console.error("CRITICAL ERROR:", err);
            gameContainer.innerHTML = `
                <div style="grid-column: 1/-1; background: #ff4444; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                    <h2>⚠️ SYSTEM FAILURE</h2>
                    <p>The library could not load. Check the console (F12) for details.</p>
                    <p><strong>Error:</strong> ${err.message}</p>
                    <p><em>Did you leave a trailing comma in the JSON?</em></p>
                </div>
            `;
        });

    // --- RENDER FUNCTION ---
    function renderGrid(list) {
        gameContainer.innerHTML = '';
        
        list.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            
            // Generate Card HTML
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${game.thumb}" alt="${game.title}" loading="lazy" 
                         onerror="this.src='https://via.placeholder.com/150/000000/FFFFFF/?text=No+Image'">
                </div>
                <div class="card-info">
                    <h3>${game.title}</h3>
                    <span class="category-badge">${game.category || 'Game'}</span>
                </div>
                <button class="play-btn">Launch</button>
            `;
            
            // Add Click Event
            card.querySelector('.play-btn').onclick = () => launchGame(game);
            gameContainer.appendChild(card);
        });
    }

    // --- SEARCH LOGIC ---
    searchBar.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allGames.filter(g => 
            g.title.toLowerCase().includes(term) || 
            (g.category && g.category.toLowerCase().includes(term))
        );
        renderGrid(filtered);
    });

    // --- LAUNCHER LOGIC (The "Refused to Connect" Fix) ---
    function launchGame(game) {
        // 1. DIRECT MODE: For sites that block iframes (Discord, Instagram, etc.)
        if (game.cloak === false) {
            const win = window.open(game.url, '_blank');
            if (!win) alert("Popup Blocked! Please allow popups for this site.");
        } 
        // 2. STEALTH MODE: For games we can hide in about:blank
        else {
            const win = window.open('about:blank', '_blank');
            if (!win) {
                alert("Popup Blocked! Enable popups to use Stealth Mode.");
                return;
            }

            // Fake the metadata
            win.document.title = "Google Drive";
            const link = win.document.createElement('link');
            link.rel = 'icon';
            link.href = 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png';
            win.document.head.appendChild(link);

            // Style the container
            win.document.body.style.margin = "0";
            win.document.body.style.height = "100vh";
            win.document.body.style.backgroundColor = "#000";
            win.document.body.style.overflow = "hidden";

            // Create the iframe
            const iframe = win.document.createElement('iframe');
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.border = "none";
            iframe.src = game.url;
            
            // ENABLE HARDWARE ACCELERATION & INPUTS
            iframe.allow = "fullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; accelerometer; cursor-lock; payment";
            
            win.document.body.appendChild(iframe);
        }
    }
});
