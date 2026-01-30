const container = document.getElementById('game-container');
const searchBar = document.getElementById('search-bar');

// Load resources from your JSON file
fetch('./games.json')
    .then(res => res.json())
    .then(data => {
        window.allItems = data;
        renderCards(data);
    })
    .catch(err => console.error("Could not load data:", err));

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
            // about:blank strips the "Referrer" so school filters see less data
            const win = window.open('about:blank', '_blank');
            if (win) {
                win.opener = null;
                win.location.href = item.url;
            } else {
                window.location.href = item.url;
            }
        };
        container.appendChild(card);
    });
}

// Search filter logic
if (searchBar) {
    searchBar.oninput = () => {
        const query = searchBar.value.toLowerCase();
        const filtered = window.allItems.filter(i => 
            i.title.toLowerCase().includes(query)
        );
        renderCards(filtered);
    };
}

// Panic Key: Press '~' to switch to Google Classroom instantly
window.addEventListener('keydown', (e) => {
    if (e.key === '~' || e.key === '`') {
        window.location.replace("https://classroom.google.com");
    }
});
