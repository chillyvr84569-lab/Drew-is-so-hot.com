const container = document.getElementById('game-container');

fetch('./games.json')
    .then(res => res.json())
    .then(data => renderCards(data))
    .catch(err => console.error("Could not load resources:", err));

function renderCards(data) {
    if (!container) return;
    container.innerHTML = "";
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `<img src="${item.thumb}"><h3>${item.title}</h3>`;
        
        card.onclick = () => {
            // "about:blank" creates a sanitized environment GoGuardian can't track as easily
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

// Emergency Panic Key: Tap '~' to go to Google Classroom
window.addEventListener('keydown', (e) => {
    if (e.key === '~') window.location.replace("https://classroom.google.com");
});
