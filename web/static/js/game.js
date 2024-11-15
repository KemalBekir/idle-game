class GameController {
    constructor() {
        this.mineralCountValue = 0; // Keep track of the mineral count as a number
        this.mineralCount = document.getElementById('mineralCount');
        this.droneCount = document.getElementById('droneCount');
        this.asteroid = document.getElementById('asteroid');
        this.initializeEventListeners();
        this.startGameLoop();
    }

    initializeEventListeners() {
        this.asteroid.addEventListener('click', () => this.handleMining());
        document.getElementById('buyDroneBtn').onclick = () => this.handleBuyDrone();
    }

    handleMining = () => {
        // Increment the mineral count and update the UI
        this.mineralCountValue += 1;
        this.updateMineralCount();
    }

    startGameLoop() {
        setInterval(() => this.updateGameState(), 1000);
    }

    updateGameState() {
        // Update the game state as needed
        // You can fetch data from the server or update the state based on other logic
    }

    updateUI(gameState) {
        this.mineralCountValue = gameState.minerals;
        this.updateMineralCount();
        this.droneCount.textContent = gameState.drones.length;
        // Update other UI elements based on game state
    }

    updateMineralCount = () => {
        // Display the updated mineral count
        this.mineralCount.textContent = this.mineralCountValue;
    }
}

new GameController();
