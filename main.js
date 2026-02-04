// Function to load and display games from games.json
async function loadGames() {
    try {
        const response = await fetch('games.json');
        const games = await response.json();
        const container = document.getElementById('game-container');
        
        if (!container) return;
        container.innerHTML = '';

        games.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <img src="${game.thumb}" alt="${game.title}">
                <div class="game-info">
                    <h3>${game.title}</h3>
                    <span class="category">${game.category}</span>
                </div>
            `;
            // Every click now triggers the stealth launcher
            card.onclick = () => launchStealth(game.url);
            container.appendChild(card);
        });
    } catch (err) {
        console.error("Failed to load games:", err);
    }
}

// The core stealth function that forces about:blank for EVERYTHING
function launchStealth(url) {
    // Create the new about:blank window
    const win = window.open('about:blank', '_blank');
    
    if (win) {
        // Remove all margins from the new window
        win.document.body.style.margin = '0';
        win.document.body.style.height = '100vh';
        win.document.body.style.overflow = 'hidden';

        // Create the iframe that holds the site
        const iframe = win.document.createElement('iframe');
        iframe.style.border = 'none';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.margin = '0';
        iframe.src = url;

        // Inject the iframe into the about:blank page
        win.document.body.appendChild(iframe);
    } else {
        // Fallback if the browser blocks the popup
        alert("Please allow popups for this site to use stealth mode!");
    }
}

// Start the app
loadGames();
