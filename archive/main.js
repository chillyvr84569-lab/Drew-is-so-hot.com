document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('games-grid');
    const searchBar = document.getElementById('search');
    let games = [];

    // 1. Fetch the games data from the JSON file
    fetch('games.json')
        .then(response => {
            if (!response.ok) throw new Error("Failed to load games.json");
            return response.json();
        })
        .then(data => {
            games = data;
            displayGames(games); // Initial load of all games
        })
        .catch(error => {
            console.error('Error:', error);
            gameContainer.innerHTML = '<p style="color: white; text-align: center;">Error loading games. Check if games.json is in the archive folder!</p>';
        });

    // 2. Efficient Search Function
    searchBar.addEventListener('keyup', (e) => {
        const searchString = e.target.value.toLowerCase();
        const filteredGames = games.filter(game => {
            return game.title.toLowerCase().includes(searchString);
        });
        displayGames(filteredGames);
    });

    // 3. Function to display games (Optimized for speed)
    function displayGames(gamesList) {
        gameContainer.innerHTML = ''; // Clear current grid
        
        // Use a "Fragment" to prevent page lag while building
        const fragment = document.createDocumentFragment();

        gamesList.forEach(game => {
            const card = document.createElement('div');
            card.classList.add('game-card');

            // HTML for each card
            card.innerHTML = `
                <div class="card-content">
                    <h3>${game.title}</h3>
                    <button class="play-btn">Play Now</button>
                </div>
            `;

            // Add the "About:Blank" Cloaking click event
            card.querySelector('.play-btn').addEventListener('click', () => {
                openInAboutBlank(game.url);
            });

            fragment.appendChild(card);
        });

        gameContainer.appendChild(fragment);
    }

    // 4. The "About:Blank" Cloaker (Hides from History)
    function openInAboutBlank(url) {
        const win = window.open('about:blank', '_blank');
        if (!win) {
            alert("Pop-up blocked! Please allow pop-ups for this site.");
            return;
        }

        const iframe = win.document.createElement('iframe');
        iframe.style.width = '100vw';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.src = url;

        win.document.body.style.margin = '0';
        win.document.body.appendChild(iframe);
    }
});
