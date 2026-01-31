let allData = [];
let currentCategory = 'Games';

// 1. Fetch Data
fetch('games.json')
    .then(res => res.json())
    .then(data => {
        allData = data;
        renderCards(allData);
    });

// 2. Tab Switcher Function
function filterTab(category) {
    currentCategory = category;
    
    // Update active button styling
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.includes(category.split(' ')[0])) btn.classList.add('active');
    });

    renderCards(allData);
}

function renderCards(data) {
    const container = document.getElementById('games-container');
    if (!container) return;
    container.innerHTML = "";

    // Only show items matching the selected tab
    const filtered = data.filter(item => item.category === currentCategory);

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            ${item.thumb.startsWith('http') ? `<img src="${item.thumb}">` : `<div style="font-size:80px;padding:20px;">🎮</div>`}
            <h3 class="card-title">${item.title}</h3>`;
        
        card.onclick = () => window.open(item.url, '_blank');
        container.appendChild(card);
    });
}

// 3. Search logic (Updated to work with tabs)
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const searched = allData.filter(item => 
        item.category === currentCategory && 
        item.title.toLowerCase().includes(term)
    );
    renderCards(searched);
});

// 4. Clock & Panic remain same
setInterval(() => {
    const clock = document.getElementById('clock');
    if (clock) clock.textContent = new Date().toLocaleTimeString();
}, 1000);

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.location.href = 'https://canvas.instructure.com/login/canvas';
});
