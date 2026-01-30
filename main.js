/** * CLEAN PORTAL ENGINE 
 * Bypasses GoGuardian by using direct navigation and no obfuscation.
 */

const container = document.getElementById('game-container');
const searchBar = document.getElementById('search-bar');

// Load the resources from your JSON file
fetch('./games.json')
    .then(res => res.json())
    .then(data => {
        window.allItems = data;
        renderCards(data);
    })
    .catch(err => console.error("Error loading resources:", err));

function renderCards(data) {
    if (!container) return;
    container.innerHTML = "";
    
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <img src="${item.thumb}" onerror="this.src='https://via.placeholder.com/150?text=Resource'">
            <h3>${item.title}</h3>
        `;
        
        card.onclick = () => {
            // This is the "Clean Tab" method to strip referrers
            const win = window.open('about:blank', '_blank');
            if (win) {
                win.opener = null;
                win.location.href = item.url;
            } else {
                // Fallback if pop-up is blocked
                window.location.href = item.url;
            }
        };
        container.appendChild(card);
    });
}

// Search functionality
if (searchBar) {
    searchBar.oninput = () => {
        const query = searchBar.value.toLowerCase();
        const filtered = window.allItems.filter(i => 
            i.title.toLowerCase().includes(query)
        );
        renderCards(filtered);
    };
}

// Panic Key: Press '~' to instantly switch to Google Classroom
window.addEventListener('keydown', (e) => {
    if (e.key === '~' || e.key === '`') {
        window.location.replace("https://classroom.google.com");
    }
});
