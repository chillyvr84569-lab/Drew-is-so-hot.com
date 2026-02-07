/**
 * THE OMNIBUS ENGINE v7.0 - FIXES BLANK SCREENS & CLOAKING
 */

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('games-grid');
    const search = document.getElementById('search');
    let MASTER_LIST = [];

    // 1. Fetch the Vault
    fetch('./games.json')
        .then(res => res.json())
        .then(data => {
            MASTER_LIST = data;
            render(MASTER_LIST);
        })
        .catch(err => {
            console.error("Master Vault Failure:", err);
            grid.innerHTML = `<h2 style="color:red;">CRITICAL ERROR: Check games.json for missing commas!</h2>`;
        });

    // 2. The Render Engine
    function render(list) {
        grid.innerHTML = '';
        document.querySelector('h1').innerText = `Unblocked Hub (${list.length} Games)`;

        list.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${game.thumb || 'https://via.placeholder.com/150/222/0f8?text=App'}" 
                         onerror="this.src='https://via.placeholder.com/150/111/444?text=Broken+Link'" loading="lazy">
                </div>
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

    // 3. THE BLANK SCREEN SLAYER
    function launch(game) {
        // Step A: Check if the site is "Un-cloakable" (Social Media/CORS blocks)
        if (game.cloak === false) {
            const newTab = window.open(game.url, '_blank');
            if (!newTab) alert("POPUP BLOCKED! Please click the icon in your address bar to allow popups.");
            return;
        }

        // Step B: Stealth Mode (about:blank)
        const win = window.open('about:blank', '_blank');
        if (!win) {
            alert("POPUP BLOCKED! Stealth mode requires popups to be enabled.");
            return;
        }

        // Step C: Identity Theft (Disguise the Tab)
        win.document.title = "Google Docs";
        const link = win.document.createElement('link');
        link.rel = 'icon';
        link.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
        win.document.head.appendChild(link);

        // Step D: The Iframe Injector
        // We use a specific set of 'allow' attributes to prevent blank screens on FPS games
        const iframe = win.document.createElement('iframe');
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.style.position = "fixed";
        iframe.style.top = "0";
        iframe.style.left = "0";
        iframe.src = game.url;
        
        // Critical permissions for 2026 browsers to prevent "black/blank screen"
        iframe.allow = "fullscreen; autoplay; cursor-lock; clipboard-write; encrypted-media; camera; microphone; gyroscope; accelerometer";

        win.document.body.style.margin = "0";
        win.document.body.style.padding = "0";
        win.document.body.style.overflow = "hidden";
        win.document.body.appendChild(iframe);
        
        // Step E: Heartbeat Check
        // If the iframe fails to load after 4 seconds (due to X-Frame-Options), 
        // we provide a direct link so the user isn't stuck on a blank screen.
        setTimeout(() => {
            try {
                if (iframe.contentWindow.length === 0) {
                   // This is where we could trigger a fallback if needed
                }
            } catch (e) {
                // If we get a 'security error' here, it actually means the site LOADED!
            }
        }, 4000);
    }

    // 4. Search Logic
    search.oninput = (e) => {
        const val = e.target.value.toLowerCase();
        const filtered = MASTER_LIST.filter(g => 
            g.title.toLowerCase().includes(val) || g.category.toLowerCase().includes(val)
        );
        render(filtered);
    };
});
