const container = document.getElementById('game-container');
const searchBar = document.getElementById('search-bar');

fetch('games.json')
    .then(res => res.json())
    .then(data => {
        renderCards(data);
        window.allItems = data; 
    });

function renderCards(data) {
    container.innerHTML = "";
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `<img src="${item.thumb}"><h3>${item.title}</h3>`;
        card.onclick = () => {
            if (item.type === "new") {
                window.open(item.url, '_blank');
            } else {
                document.getElementById('game-screen').src = item.url;
                document.getElementById('overlay').classList.remove('hidden');
            }
        };
        container.appendChild(card);
    });
}

// Panic Key: Press ~ to instantly switch to Google Docs
window.addEventListener('keydown', (e) => {
    if (e.key === '~') {
        window.location.replace("https://docs.google.com/document/u/0/");
    }
});

// Search
searchBar.oninput = () => {
    const query = searchBar.value.toLowerCase();
    renderCards(window.allItems.filter(i => i.title.toLowerCase().includes(query)));
};

// Close Overlay
document.getElementById('close-btn').onclick = () => {
    document.getElementById('overlay').classList.add('hidden');
    document.getElementById('game-screen').src = "";
};
