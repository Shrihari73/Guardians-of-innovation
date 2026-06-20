document.addEventListener('DOMContentLoaded', () => {
    
    const launchBtn = document.getElementById('launch-btn');
    const posterScreen = document.getElementById('poster-screen');
    const mainContent = document.getElementById('main-content');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    
    const garageAudio = document.getElementById('garage-audio');
    const muteBtn = document.getElementById('mute-btn');

    // 1. POSTER SLIDE & TRIGGER MUSIC ENGINE
    launchBtn.addEventListener('click', () => {
        posterScreen.classList.add('exit');
        mainContent.classList.remove('hidden');
        
        // Triggers background track loop on initialization click
        garageAudio.play().catch(error => {
            console.log("Audio framework initialization delayed:", error);
        });
    });

    // 2. VOLUME MUTE TOGGLE LOGIC
    muteBtn.addEventListener('click', () => {
        if (garageAudio.muted) {
            garageAudio.muted = false;
            muteBtn.innerText = "🔊 MUTE";
            muteBtn.style.borderColor = "var(--hud-cyan)";
            muteBtn.style.color = "var(--hud-cyan)";
        } else {
            garageAudio.muted = true;
            muteBtn.innerText = "🔇 UNMUTE";
            muteBtn.style.borderColor = "var(--iron-red)";
            muteBtn.style.color = "var(--iron-red)";
        }
    });

    // 3. SEPARATION & GRID FILTER ENGINE
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            vehicleCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === cardCategory) {
                    card.classList.remove('card-hide');
                } else {
                    card.classList.add('card-hide');
                }
            });
        });
    });
});