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
            const junk = document.createElement('div');
            junk.className = 'space-junk';
            
            // Set the background image for the junk (adjust path as needed)
            junk.style.backgroundImage = "url('/static/assets/stargate.png')";
            junk.style.backgroundSize = "contain";
            junk.style.backgroundRepeat = "no-repeat";
            junk.style.width = "100px"; // Adjust dimensions based on your image
            junk.style.height = "100px";
            junk.style.position = "absolute";
    
            const containerWidth = this.spaceJunkContainer.offsetWidth;
            const containerHeight = this.spaceJunkContainer.offsetHeight;
            const randomX = Math.random() * (containerWidth - 50); // Adjust for size
            const randomY = Math.random() * (containerHeight - 50);
    
            junk.style.left = `${randomX}px`;
            junk.style.top = `${randomY}px`;
    
            junk.addEventListener('click', () => {
                const reward = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000; // 1,000–10,000
                this.minerals += reward;
                // alert(`You collected space junk and earned ${reward} minerals!`);
                this.updateUI();
                this.spaceJunkContainer.removeChild(junk);
            });
    
            this.spaceJunkContainer.appendChild(junk);
    
            setTimeout(() => {
                if (junk.parentNode) this.spaceJunkContainer.removeChild(junk);
            }, 10000);
        }, 10000);
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
