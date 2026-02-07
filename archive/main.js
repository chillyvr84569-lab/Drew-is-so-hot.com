/* PROJECT ARCHIVE - BEAST ENGINE v17.0 */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('games-grid');
    const search = document.getElementById('search');
    const filterBtns = document.querySelectorAll('.filter-btn, button');
    let MASTER_DATA = [];

    // LOAD VAULT
    fetch('./games.json')
        .then(res => res.json())
        .then(data => {
            MASTER_DATA = data;
            render(MASTER_DATA);
        })
        .catch(err => {
            console.error("Vault Crash!", err);
            if(grid) grid.innerHTML = `<h2 style="color:red; text-align:center;">VAULT CRASHED: Check line 366 for extra brackets!</h2>`;
        });

    function render(list) {
        if(!grid) return;
        grid.innerHTML = '';
        list.forEach(item => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <div class="card-img-wrapper"><img src="${item.thumb}" loading="lazy" onerror="this.src='https://via.placeholder.com/150/111/444?text=Game'"></div>
                <div class="card-content">
                    <h3>${item.title}</h3>
                    <span class="badge">${item.category}</span>
                    <button class="launch-btn">Launch</button>
                </div>
            `;
            card.querySelector('.launch-btn').onclick = () => launch(item);
            grid.appendChild(card);
        });
    }

    function launch(item) {
        if (item.cloak === false) {
            window.open(item.url, '_blank');
            return;
        }

        const win = window.open('about:blank', '_blank');
        if(!win) return alert("Please allow popups!");

        win.document.title = "Google Docs";
        const iframe = win.document.createElement('iframe');
        iframe.style = "position:fixed; top:0; left:0; width:100vw; height:100vh; border:none; margin:0; padding:0;";
        iframe.src = item.url;
        // Allows cursor-lock for 1v1.lol and Shell Shockers (Fixes black screen)
        iframe.allow = "fullscreen; autoplay; cursor-lock; encrypted-media";
        
        win.document.body.appendChild(iframe);
        win.document.body.style.margin = "0";
    }

    // SEARCH & FILTER
    if(search) {
        search.oninput = (e) => {
            const val = e.target.value.toLowerCase();
            render(MASTER_DATA.filter(i => i.title.toLowerCase().includes(val)));
        };
    }

    filterBtns.forEach(btn => {
        btn.onclick = () => {
            const cat = btn.innerText.trim();
            render(cat === 'All' ? MASTER_DATA : MASTER_DATA.filter(i => i.category === cat));
        };
    });
});
