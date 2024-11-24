class GameController {
    constructor() {
        // UI elements
        this.mineralCount = document.getElementById('mineralCount');
        this.droneCount = document.getElementById('droneCount');
        this.oilCount = document.getElementById('oilCount');
        this.buyDroneBtn = document.getElementById('buyDroneBtn');
        this.sellMineralsBtn = document.getElementById('sellMineralsBtn');
        this.asteroid = document.getElementById('asteroid');
        this.spaceJunkContainer = document.getElementById('spaceJunkContainer');
        this.researchContainer = document.getElementById('researchGrid');

        // Game state
        this.minerals = 0;
        this.oil = 0;
        this.drones = 0;
        this.currentDronePrice = 10;
        this.mineralsPerDrone = 0.1;
        this.droneProductivityMultiplier = 1;

        // Research options
        this.researchOptions = [
            {
                id: 'upgrade1',
                name: 'Upgrade Mining Power',
                cost: 50,
                effect: () => {
                    this.droneProductivityMultiplier *= 2;
                },
            },
            {
                id: 'upgrade2',
                name: 'Advanced Mining Power',
                cost: 100,
                effect: () => {
                    this.droneProductivityMultiplier *= 1.5;
                },
            },
        ];

        // Initialize
        this.initializeEventListeners();
        this.initializeResearchButtons();
        this.startGameLoop();
        this.spawnSpaceJunk();

        // Initialize button text
        this.buyDroneBtn.textContent = `Buy Drone (${this.currentDronePrice} minerals)`;
    }

    initializeEventListeners() {
        this.asteroid.addEventListener('click', this.handleMining);
        this.buyDroneBtn.addEventListener('click', this.handleBuyDrone);
        this.sellMineralsBtn.addEventListener('click', this.handleSellMinerals);
    }

    initializeResearchButtons() {
        this.researchContainer.innerHTML = ''; // Clear existing buttons
        this.researchOptions.forEach(research => {
            const button = document.createElement('button');
            button.id = research.id;
            button.textContent = `${research.name} (${research.cost} minerals)`;
            button.addEventListener('click', () => this.handleResearch(research));
            this.researchContainer.appendChild(button);
        });
    }

    handleMining = () => {
        this.minerals += 1;
        this.updateUI();
    };

    handleBuyDrone = () => {
        if (this.minerals >= this.currentDronePrice) {
            this.minerals -= this.currentDronePrice;
            this.drones += 1;
            this.currentDronePrice = Math.ceil(10 * Math.pow(1.1, this.drones));
            this.updateUI();
        } else {
            alert(`Not enough minerals! Need ${this.currentDronePrice} minerals.`);
        }
    };

    handleResearch = (research) => {
        if (this.minerals >= research.cost) {
            this.minerals -= research.cost;
            research.effect();
            this.researchOptions = this.researchOptions.filter(r => r.id !== research.id);
            this.initializeResearchButtons();
            this.updateUI();
        } else {
            alert(`Not enough minerals! Need ${research.cost} minerals.`);
        }
    };

    handleSellMinerals = () => {
        if (this.minerals >= 1000) {
            this.minerals -= 1000;
            this.oil += 1;
            this.updateUI();
        } else {
            alert('Not enough minerals to sell for oil!');
        }
    };

    startGameLoop() {
        setInterval(() => this.updateGameState(), 1000);
    }

    updateGameState() {
        if (this.drones > 0) {
            this.minerals += this.drones * this.mineralsPerDrone * this.droneProductivityMultiplier;
            this.minerals = Math.round(this.minerals * 10) / 10; // Keep one decimal
            this.updateUI();
        }
    }

    spawnSpaceJunk() {
        console.log("junk appeared");
    
        setInterval(() => {
            // Create the junk container
            const junkContainer = document.createElement('div');
            junkContainer.style.position = 'absolute';
    
            // Create the junk image
            const junk = document.createElement('div');
            junk.className = 'space-junk';
            junk.style.backgroundImage = "url('/static/assets/stargate.png')"; // Ensure the path is correct
            junk.style.backgroundSize = "contain";
            junk.style.backgroundRepeat = "no-repeat";
            junk.style.width = "120px";
            junk.style.height = "120px";
    
            // Create the countdown text
            const countdown = document.createElement('span');
            countdown.style.position = 'relative';
            countdown.style.top = '130px'; // Move the countdown below the image
            countdown.style.left = '25px'
            countdown.style.color = 'white';
            countdown.style.fontSize = '12px';
            countdown.style.textAlign = 'center';
    
            // Position the junk container randomly
            const containerWidth = this.spaceJunkContainer.offsetWidth;
            const containerHeight = this.spaceJunkContainer.offsetHeight;
            const randomX = Math.random() * (containerWidth - 50);
            const randomY = Math.random() * (containerHeight - 70); // Account for junk and text height
    
            junkContainer.style.left = `${randomX}px`;
            junkContainer.style.top = `${randomY}px`;
    
            // Attach junk and countdown to the container
            junkContainer.appendChild(junk);
            junkContainer.appendChild(countdown);
            this.spaceJunkContainer.appendChild(junkContainer);
    
            // Countdown logic
            let timeLeft = 10; // 10 seconds
            countdown.textContent = `Time left: ${timeLeft}s`;
    
            const countdownInterval = setInterval(() => {
                timeLeft -= 1;
                countdown.textContent = `Time left: ${timeLeft}s`;
    
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    if (junkContainer.parentNode) {
                        this.spaceJunkContainer.removeChild(junkContainer);
                    }
                }
            }, 1000);
    
            // Handle click on junk
            junk.addEventListener('click', () => {
                const reward = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000; // 1,000–10,000
                this.minerals += reward;
                alert(`You collected space junk and earned ${reward} minerals!`);
                this.updateUI();
                clearInterval(countdownInterval);
                if (junkContainer.parentNode) {
                    this.spaceJunkContainer.removeChild(junkContainer);
                }
            });
    
        }, 10000); // Spawn new junk every 10 seconds
    }
    
    
    
    

    updateUI() {
        this.mineralCount.textContent = this.minerals.toFixed(1);
        this.droneCount.textContent = this.drones;
        this.oilCount.textContent = this.oil;
        this.buyDroneBtn.textContent = `Buy Drone (${this.currentDronePrice} minerals)`;

        this.buyDroneBtn.disabled = this.minerals < this.currentDronePrice;
        this.sellMineralsBtn.disabled = this.minerals < 1000;

        this.researchOptions.forEach(research => {
            const button = document.getElementById(research.id);
            if (button) button.disabled = this.minerals < research.cost;
        });
    }
}

// Start the game
new GameController();
