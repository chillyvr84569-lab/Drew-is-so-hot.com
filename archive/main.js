document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('games-grid');
    const searchBar = document.getElementById('search');
    const themeToggle = document.getElementById('theme-toggle');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let games = [];
    let currentCategory = 'all';

    // 1. Fetch data
    fetch('games.json')
        .then(res => res.json())
        .then(data => {
            games = data;
            displayGames(games);
        });

    // 2. Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            filterAndDisplay();
        });
    });

    searchBar.addEventListener('keyup', filterAndDisplay);

    function filterAndDisplay() {
        const searchTerm = searchBar.value.toLowerCase();
        const filtered = games.filter(game => {
            const matchesSearch = game.title.toLowerCase().includes(searchTerm);
            const matchesCategory = currentCategory === 'all' || game.category === currentCategory;
            return matchesSearch && matchesCategory;
        });
        displayGames(filtered);
    }

    // 3. Display with About:Blank Cloaker
    function displayGames(list) {
        gameContainer.innerHTML = '';
        list.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <img src="${game.thumb}" alt="${game.title}" onerror="this.src='https://via.placeholder.com/150'">
                <h3>${game.title}</h3>
                <button onclick="openGame('${game.url}')">Play</button>
            `;
            gameContainer.appendChild(card);
        });
    }

    window.openGame = (url) => {
        const win = window.open('about:blank', '_blank');
        const iframe = win.document.createElement('iframe');
        iframe.style.cssText = "width:100vw; height:100vh; border:none; position:fixed; top:0; left:0;";
        iframe.src = url;
        win.document.body.appendChild(iframe);
    };

    // 4. Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });
});
