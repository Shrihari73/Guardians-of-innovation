document.addEventListener('DOMContentLoaded', () => {
    
    // Core Navigation Elements
    const launchBtn = document.getElementById('launch-btn');
    const posterScreen = document.getElementById('poster-screen');
    const mainContent = document.getElementById('main-content');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    
    // Audio Elements
    const garageAudio = document.getElementById('garage-audio');
    const muteBtn = document.getElementById('mute-btn');

    // Cinematic Elements
    const arcContainer = document.getElementById('arc-container');
    const flashOverlay = document.getElementById('flash-overlay');
    const posterContent = document.getElementById('poster-content');

    // Modal HUD Popup Elements
    const hudModal = document.getElementById('hud-modal');
    const closeModal = document.getElementById('close-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');

    // Canvas Spark Config
    const canvas = document.getElementById('spark-canvas');
    const ctx = canvas.getContext('2d');
    let sparks = [];
    let animationFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 1. CINEMATIC ARC REACTOR BURST TRANSITION
    launchBtn.addEventListener('click', () => {
        // Step A: Blow up the arc reactor component visually
        arcContainer.classList.add('arc-burst');
        launchBtn.style.opacity = '0';
        
        // Step B: Flash intense white light overlay across background layout
        setTimeout(() => {
            flashOverlay.classList.add('flash-active');
            // Trigger audio stream
            garageAudio.play().catch(e => console.log("Audio waiting..."));
        }, 350);

        // Step C: Switch display channels smoothly
        setTimeout(() => {
            posterScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
            flashOverlay.classList.remove('flash-active');
        }, 850);
    });

    // 2. VOLUME MUTE TOGGLE LOGIC
    muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
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
        button.addEventListener('click', (e) => {
            e.stopPropagation();
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

    // Spark Object Blueprint Definition
    class Spark {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = (Math.random() - 0.8) * 10 - 2;
            this.radius = Math.random() * 2.5 + 1;
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.01;
            this.gravity = 0.25;
            this.color = Math.random() > 0.4 ? '#ff9d00' : '#ffdd00';
        }

        update() {
            this.x += this.vx;
            this.vy += this.gravity;
            this.y += this.vy;
            this.alpha -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    function animateSparks() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = sparks.length - 1; i >= 0; i--) {
            sparks[i].update();
            sparks[i].draw();
            if (sparks[i].alpha <= 0) sparks.splice(i, 1);
        }
        if (sparks.length > 0) {
            animationFrameId = requestAnimationFrame(animateSparks);
        } else {
            cancelAnimationFrame(animationFrameId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    function createSparkShower() {
        cancelAnimationFrame(animationFrameId);
        sparks = [];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        for (let i = 0; i < 75; i++) {
            sparks.push(new Spark(centerX + (Math.random() - 0.5) * 200, centerY + (Math.random() - 0.5) * 100));
        }
        animateSparks();
    }

    // 4. MODAL POPUP SPECIFICATION READOUT LOGIC
    vehicleCards.forEach(card => {
        card.addEventListener('click', () => {
            const imgSource = card.querySelector('.vehicle-img').src;
            const dataSource = card.querySelector('.hidden-details');
            
            const tag = dataSource.getAttribute('data-tag');
            const title = dataSource.getAttribute('data-title');
            const description = dataSource.getAttribute('data-desc');

            modalImg.src = imgSource;
            modalTag.innerHTML = tag;
            modalTitle.innerHTML = title;
            modalDesc.innerHTML = description;

            hudModal.classList.remove('hidden');
            createSparkShower();
        });
    });

    closeModal.addEventListener('click', () => {
        hudModal.classList.add('hidden');
        sparks = [];
    });

    hudModal.addEventListener('click', (e) => {
        if (e.target === hudModal) {
            hudModal.classList.add('hidden');
            sparks = [];
        }
    });
});