class GameController {
    constructor() {
        this.mineralCount = document.getElementById('mineralCount');
        this.droneCount = document.getElementById('droneCount');
        this.asteroid = document.getElementById('asteroid');
        this.minerals = 0; // Keeps track of the total minerals
        this.drones = 0;   // Keeps track of the number of drones
        this.mineralsPerDrone = 0.1; // How much each drone mines per second
        this.handleMining = this.handleMining.bind(this);
        this.handleBuyDrone = this.handleBuyDrone.bind(this);
        this.initializeEventListeners();
        this.startGameLoop();
    }

    initializeEventListeners() {
        this.asteroid.addEventListener('click', () => this.handleMining());
        document.getElementById('buyDroneBtn').onclick = () => this.handleBuyDrone();
        document.getElementById('upgradeBtn').onClick = () => this.handleReaserch();
    }

    handleMining = () => {
        this.minerals += 1; // Add 1 mineral per click
        this.updateUI();
    }

    handleBuyDrone = () => {
        
        if (this.minerals >= 10) {
            this.minerals -= 10; // Deduct the cost of the drone
            this.drones += 1;    // Add a new drone
            this.updateUI();
        } else {
            alert('Not enough minerals to buy a drone!');
        }
    }

    handleReaserch = () => {
        if (this.minerals >= 50) {
            this.minerals -= 50;
            this.updateUI
        } else {
            alert('Not enough minerals to buy this research');
        }
    }

    startGameLoop() {
        setInterval(() => {
            this.updateGameState();
        }, 1000); // Runs every second
    }

    updateGameState() {
        // Add minerals based on the number of drones
        this.minerals += this.drones * this.mineralsPerDrone;
        this.updateUI();
    }

    updateUI() {
        this.mineralCount.textContent = Math.floor(this.minerals);
        this.droneCount.textContent = this.drones;
    }
}

new GameController();
