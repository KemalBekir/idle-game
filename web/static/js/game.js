class GameController {
    constructor() {
        this.mineralCount = document.getElementById('mineralCount');
        this.droneCount = document.getElementById('droneCount');
        this.oilCount = document.getElementById('oilCount');
        this.buyDroneBtn = document.getElementById('buyDroneBtn');
        this.sellMineralsBtn = document.getElementById('sellMineralsBtn');
        this.asteroid = document.getElementById('asteroid');
        this.minerals = 0;
        this.oil = 0;
        this.drones = 0;
        this.currentDronePrice = 10; // Starting price
        this.mineralsPerDrone = 0.1;
        this.droneProductivityMultiplier = 1; // Multiplier for productivity
        this.firstResearchCost = 50; // Cost for first research
        this.secondResearchCost = 100; // Cost for second research
        this.initializeEventListeners();
        this.startGameLoop();

        // Initialize the button text with starting price
        this.buyDroneBtn.textContent = `Buy Drone (${this.currentDronePrice} minerals)`;
    }

    initializeEventListeners() {
        this.asteroid.addEventListener('click', () => this.handleMining());
        this.buyDroneBtn.addEventListener('click', () => this.handleBuyDrone());
        this.sellMineralsBtn.addEventListener('click', () => this.handleSellMinerals());
        document.getElementById('upgradeBtn').addEventListener('click', () => this.handleFirstResearch());
        document.getElementById('upgradeBtn2').addEventListener('click', () => this.handleSecondResearch());
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

    handleFirstResearch = () => {
        if (this.minerals >= this.firstResearchCost) {
            this.minerals -= this.firstResearchCost;

            // Double the productivity of drones
            this.droneProductivityMultiplier *= 2;

            this.updateUI();
        } else {
            alert('Not enough minerals to buy this research');
        }
    };

    handleSecondResearch = () => {
        if (this.minerals >= this.secondResearchCost) {
            this.minerals -= this.secondResearchCost;

            // Increase productivity again (e.g., 1.5x multiplier)
            this.droneProductivityMultiplier *= 1.5;

            this.updateUI();
        } else {
            alert('Not enough minerals to buy this research');
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
        this.oilCount.textContent = this.oil;
        this.buyDroneBtn.textContent = `Buy Drone (${this.currentDronePrice} minerals)`;
    };
}

// Start the game
new GameController();
