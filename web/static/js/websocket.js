class GameWebSocket {
    constructor() {
        this.connect();
        this.setupEventListeners();
    }
    
    connect() {
        this.ws = new WebSocket(`ws://${window.location.host}/ws`);
        
        this.ws.onopen = () => {
            console.log('Connected to game server');
        };
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
        };
        
        this.ws.onclose = () => {
            console.log('Disconnected from game server');
            setTimeout(() => this.connect(), 1000);
        };
    }
    
    handleMessage(data) {
        switch (data.type) {
            case 'gameState':
                updateGameState(data.payload);
                break;
            case 'research':
                updateResearch(data.payload);
                break;
            case 'market':
                updateMarket(data.payload);
                break;
        }
    }
    
    sendMessage(type, data) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: type,
                data: data
            }));
        }
    }
}

const gameWS = new GameWebSocket();