class GameController {
    constructor() {
        this.mineralCount = document.getElementById('mineralCount');
        this.droneCount = document.getElementById('droneCount');
        this.buyDroneBtn = document.getElementById('buyDroneBtn');
        this.asteroid = document.getElementById('asteroid');
        this.minerals = 0;
        this.drones = 0;
        this.currentDronePrice = 10; // Starting price
        this.mineralsPerDrone = 0.1;
        this.droneProductivityMultiplier = 1; // Multiplier for productivity
        this.initializeEventListeners();
        this.startGameLoop();

        // Initialize the button text with starting price
        this.buyDroneBtn.textContent = `Buy Drone (${this.currentDronePrice} minerals)`;
    }

    initializeEventListeners() {
        this.asteroid.addEventListener('click', () => this.handleMining());
        this.buyDroneBtn.addEventListener('click', () => this.handleBuyDrone());
        document.getElementById('upgradeBtn').addEventListener('click', () => this.handleResearch());
    }

    handleMining = () => {
        this.minerals += 1;
        this.updateUI();
    };

    handleBuyDrone = () => {
        if (this.minerals >= this.currentDronePrice) {
            this.minerals -= this.currentDronePrice;
            this.drones += 1;

            // Increase price for next purchase
            this.currentDronePrice = Math.ceil(10 * Math.pow(1.1, this.drones));

            this.updateUI();
        } else {
            alert(`Not enough minerals! Need ${this.currentDronePrice} minerals.`);
        }
    };

    handleResearch = () => {
        if (this.minerals >= 50) {
            this.minerals -= 50;

            // Double the productivity of drones
            this.droneProductivityMultiplier *= 2;

            this.updateUI();
        } else {
            alert('Not enough minerals to buy this research');
        }
    };

    startGameLoop() {
        setInterval(() => {
            this.updateGameState();
        }, 1000);
    }

    updateGameState() {
        if (this.drones > 0) {
            // Calculate minerals based on drones and their productivity
            this.minerals += this.drones * this.mineralsPerDrone * this.droneProductivityMultiplier;
            this.minerals = Math.round(this.minerals * 10) / 10; // Keep one decimal precision
            this.updateUI();
        }
    }

    updateUI = () => {
        this.mineralCount.textContent = this.minerals.toFixed(1);
        this.droneCount.textContent = this.drones;
        this.buyDroneBtn.textContent = `Buy Drone (${this.currentDronePrice} minerals)`;
    };
}

// Start the game
new GameController();
