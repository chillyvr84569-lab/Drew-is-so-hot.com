/**
 * Academic Resource Archive - Project Module
 * Handles dynamic data fetching, search filtering, and stealth deployment.
 */

let allGames = [];

// Sites that require direct tab access to prevent iframe freezing/glitches
const directLaunchRequired = [
    "instagram.com",
    "snapchat.com",
    "tiktok.com",
    "yolearn.org", // Truffled
    "rammerhead",
    "discord.com"
];

// 1. Initialize Database - Fetches from the same folder (/archive)
async function initializeDatabase() {
    try {
        console.log("Fetching resource manifest...");
        const response = await fetch('games.json');
        
        if (!response.ok) throw new Error("Manifest not found in local directory");
        
        allGames = await response.json();
        renderArchive(allGames);
    } catch (error) {
        console.error("Initialization Failed:", error);
        const container = document.getElementById('game-container');
        if (container) container.innerHTML = `<p style="color:red">Archive load error: ${error.message}</p>`;
    }
}

// 2. UI Renderer - Dynamically builds the grid
function renderArchive(data) {
    const container = document.getElementById('game-container');
    if (!container) return;

    container.innerHTML = data.map(item => `
        <div class="game-card" onclick="deployResource('${item.url}')">
            <img src="${item.thumb}" alt="${item.title}" loading="lazy">
            <div class="game-info">
                <h3>${item.title}</h3>
                <span class="category">${item.category}</span>
            </div>
        </div>
    `).join('');
}

// 3. Smart Deployment - Fixes glitches and enables stealth
function deployResource(url) {
    // Check if the site is known to break inside iframes
    const isComplex = directLaunchRequired.some(site => url.includes(site));

    if (isComplex) {
        // Direct launch for socials/proxies to ensure 100% performance
        window.open(url, '_blank');
    } else {
        // Stealth launch for games (cloaked in about:blank)
        const stealthWin = window.open('about:blank', '_blank');
        if (stealthWin) {
            stealthWin.document.body.style.margin = '0';
            stealthWin.document.body.style.height = '100vh';
            
            const frame = stealthWin.document.createElement('iframe');
            frame.style = "border:none;width:100%;height:100%;margin:0;display:block;";
            frame.src = url;
            stealthWin.document.body.appendChild(frame);
        }
    }
}

// 4. Search Filter Logic
const searchBar = document.getElementById('game-search');
if (searchBar) {
    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allGames.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.category.toLowerCase().includes(query)
        );
        renderArchive(filtered);
    });
}

// Boot up the system
initializeDatabase();
