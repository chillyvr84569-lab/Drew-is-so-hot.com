/* THE OMNIBUS ENGINE v12.0 */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('games-grid');
    const searchInput = document.getElementById('search');
    const filterBtns = document.querySelectorAll('.filter-btn, button');
    let MASTER_LIST = [];

    // LOAD THE VAULT
    fetch('./games.json')
        .then(res => res.json())
        .then(data => {
            MASTER_LIST = data;
            render(MASTER_LIST);
        })
        .catch(err => {
            console.error("Vault Load Failed!", err);
            if(grid) grid.innerHTML = `<h2 style="color:red;">JSON ERROR: Check line 366 for extra brackets!</h2>`;
        });

    function render(list) {
        if(!grid) return;
        grid.innerHTML = '';
        list.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <div class="card-img-wrapper"><img src="${game.thumb}" loading="lazy" onerror="this.src='https://via.placeholder.com/150/111/444?text=Game'"></div>
                <div class="card-content">
                    <h3>${game.title}</h3>
                    <span class="badge">${game.category}</span>
                    <button class="launch-btn">Launch</button>
                </div>
            `;
            card.querySelector('.launch-btn').onclick = () => launch(game);
            grid.appendChild(card);
        });
    }

    function launch(game) {
        if (game.cloak === false) {
            window.open(game.url, '_blank');
            return;
        }

        const win = window.open('about:blank', '_blank');
        if (!win) return alert("Popups blocked!");

        win.document.title = "Google Docs";
        const iframe = win.document.createElement('iframe');
        iframe.style = "position:fixed; top:0; left:0; width:100vw; height:100vh; border:none; margin:0; padding:0;";
        iframe.src = game.url;
        // Fixes black screen on shooters/3D games
        iframe.allow = "fullscreen; autoplay; cursor-lock; encrypted-media";
        
        win.document.body.appendChild(iframe);
        win.document.body.style.margin = "0";
    }

    // SEARCH & FILTER LOGIC
    if (searchInput) {
        searchInput.oninput = (e) => {
            const val = e.target.value.toLowerCase();
            render(MASTER_LIST.filter(g => g.title.toLowerCase().includes(val)));
        };
    }

    filterBtns.forEach(btn => {
        btn.onclick = () => {
            const cat = btn.innerText;
            render(cat === 'All' ? MASTER_LIST : MASTER_LIST.filter(g => g.category === cat));
        };
    });
});
