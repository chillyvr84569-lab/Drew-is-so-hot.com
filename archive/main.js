/* archive/main.js */
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('games-grid');
    const searchBar = document.getElementById('search');
    
    // Fetch the games data
    fetch('./games.json')
        .then(res => res.json())
        .then(data => {
            renderGrid(data);
            // Search Functionality
            searchBar.oninput = (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = data.filter(g => g.title.toLowerCase().includes(term));
                renderGrid(filtered);
            };
        })
        .catch(err => console.error("Could not load games:", err));

    function renderGrid(list) {
        gameContainer.innerHTML = '';
        
        list.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <img src="${game.thumb}" alt="${game.title}" loading="lazy">
                <h3>${game.title}</h3>
                <button class="play-btn">Launch</button>
            `;
            
            card.querySelector('.play-btn').onclick = () => {
                // If it's a "Direct" link (like generic Socials), open in new tab
                if (game.direct) {
                    const win = window.open(game.url, '_blank');
                    if(!win) alert("Pop-up blocked! Allow them to play.");
                } 
                // Everything else (Games/Proxies) goes into the Cloaker
                else {
                    const win = window.open('about:blank', '_blank');
                    if (!win) return alert("Please allow pop-ups!");
                    
                    // Stealth Title
                    win.document.title = "Google Docs";
                    win.document.body.style = "margin:0; height:100vh; overflow:hidden; background:#000;";
                    
                    const iframe = win.document.createElement('iframe');
                    iframe.style = "width:100vw; height:100vh; border:none;";
                    iframe.src = game.url;
                    
                    // CRITICAL: This allows 1v1.LOL to capture your mouse
                    iframe.allow = "fullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; accelerometer; cursor-lock"; 
                    
                    win.document.body.appendChild(iframe);
                }
            };
            gameContainer.appendChild(card);
        });
    }
});
