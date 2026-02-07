document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('games-grid');
    const searchBar = document.getElementById('search');
    let allGames = [];

    // 1. Fetch the data
    fetch('./games.json')
        .then(response => response.json())
        .then(data => {
            allGames = data;
            renderGrid(allGames);
        })
        .catch(error => {
            console.error('Error loading games:', error);
            gameContainer.innerHTML = '<p>Error loading games. Check console.</p>';
        });

    // 2. Search Function
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredGames = allGames.filter(game => 
            game.title.toLowerCase().includes(searchTerm)
        );
        renderGrid(filteredGames);
    });

    // 3. Render Grid Function
    function renderGrid(list) {
        gameContainer.innerHTML = '';
        
        list.forEach(game => {
            // Create Card
            const card = document.createElement('div');
            card.className = 'game-card';
            
            // Fill Card HTML
            card.innerHTML = `
                <img src="${game.thumb}" alt="${game.title}" loading="lazy">
                <h3>${game.title}</h3>
                <button class="play-btn">Launch</button>
            `;
            
            // Add Click Event
            const btn = card.querySelector('.play-btn');
            btn.addEventListener('click', () => {
                launchGame(game);
            });

            gameContainer.appendChild(card);
        });
    }

    // 4. Launch Game Logic
    function launchGame(game) {
        // If it's a direct link (Social Media), open in new tab
        if (game.direct) {
            window.open(game.url, '_blank');
        } 
        // Otherwise, use the Cloaker
        else {
            const win = window.open('about:blank', '_blank');
            if (!win) {
                alert("Pop-up blocked! Please allow pop-ups for this site.");
                return;
            }

            win.document.title = "Google Docs";
            win.document.body.style.margin = "0";
            win.document.body.style.height = "100vh";
            win.document.body.style.overflow = "hidden";
            win.document.body.style.backgroundColor = "#000";

            const iframe = win.document.createElement('iframe');
            iframe.style.border = "none";
            iframe.style.width = "100vw";
            iframe.style.height = "100vh";
            iframe.src = game.url;
            iframe.allow = "fullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; accelerometer; cursor-lock";

            win.document.body.appendChild(iframe);
        }
    }
});
