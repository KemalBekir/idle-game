class GameController {
    constructor() {
        this.mineralCount = document.getElementById('mineralCount');
        this.droneCount = document.getElementById('droneCount');
        this.initializeEventListeners();
        this.startGameLoop();
    }
    
    initializeEventListeners() {
        document.getElementById('asteroid').onclick = () => this.handleMining();
        document.getElementById('buyDroneBtn').onclick = () => this.handleBuyDrone();
    }
    
    async handleMining() {
        try {
            const response = await fetch('/api/mine', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            this.updateUI(data);
        } catch (error) {
            console.error('Mining error:', error);
        }
    }
    
    startGameLoop() {
        setInterval(() => this.updateGameState(), 1000);
    }
    
    async updateGameState() {
        try {
            const response = await fetch('/api/state');
            const data = await response.json();
            this.updateUI(data);
        } catch (error) {
            console.error('Update error:', error);
        }
    }
    
    updateUI(gameState) {
        this.mineralCount.textContent = Math.floor(gameState.minerals);
        this.droneCount.textContent = gameState.drones.length;
        // Update other UI elements based on game state
    }
}

new GameController();