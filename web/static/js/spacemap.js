class SpaceMap {
    constructor(canvasId, gameController) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gameController = gameController; // Link to GameController
        this.zoomLevel = 1; // Default zoom level
        this.offsetX = 0; // Panning offset X
        this.offsetY = 0; // Panning offset Y
        this.objects = [];
        this.hoveredObject = null; // Track the currently hovered object
        this.initializeEventListeners();
        this.render();
    }

    initializeEventListeners() {
        // Zoom in/out using the mouse wheel
        this.canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            const zoomSpeed = 0.1;
            const zoomDelta = event.deltaY > 0 ? -zoomSpeed : zoomSpeed; // Zoom in or out
            const newZoomLevel = this.zoomLevel + zoomDelta;

            // Limit zoom level between 0.5x and 3x
            this.zoomLevel = Math.max(0.5, Math.min(3, newZoomLevel));
        });

        // Detect hovering over objects
        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = (event.clientX - rect.left) / this.zoomLevel - this.offsetX;
            const mouseY = (event.clientY - rect.top) / this.zoomLevel - this.offsetY;

            this.hoveredObject = null; // Reset hovered object
            this.objects.forEach(obj => {
                const dx = mouseX - obj.x;
                const dy = mouseY - obj.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= obj.radius) {
                    this.hoveredObject = obj; // Set hovered object
                }
            });
        });

        // Handle click events
        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = (event.clientX - rect.left) / this.zoomLevel - this.offsetX;
            const mouseY = (event.clientY - rect.top) / this.zoomLevel - this.offsetY;

            this.objects.forEach((obj, index) => {
                const dx = mouseX - obj.x;
                const dy = mouseY - obj.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= obj.radius) {
                    obj.minerals -= 1; // Deduct 1 mineral
                    console.log(
                        `Mined 1 mineral from ${obj.type} (${obj.rarity}). Remaining minerals: ${obj.minerals}`
                    );

                    // Add mined minerals to the game controller
                    this.gameController.addMinerals(1);

                    // Remove the object if minerals reach 0
                    if (obj.minerals <= 0) {
                        console.log(`${obj.type} (${obj.rarity}) is depleted and removed.`);
                        this.objects.splice(index, 1);
                    }
                }
            });
        });
    }

    addObject(x, y, radius, color, value, type, rarity, minerals) {
        this.objects.push({
            x, 
            y, 
            radius, 
            color, 
            value, 
            type, 
            rarity, 
            minerals: minerals || Math.floor(Math.random() * 10_000_000) + 1, // Default minerals
            mined: false
        });
    }
    

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.save();
        ctx.scale(this.zoomLevel, this.zoomLevel);
        ctx.translate(this.offsetX, this.offsetY);

        // Draw objects
        this.objects.forEach(obj => {
            if (!obj.mined) {
                // Draw the object
                ctx.fillStyle = obj.color;
                ctx.beginPath();
                ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
            }
        });

        // Draw hover tooltip
        if (this.hoveredObject) {
            const obj = this.hoveredObject;
        
            // Draw tooltip background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            const text = `${obj.minerals} minerals left`;
            const textWidth = ctx.measureText(text).width;
        
            // Position the tooltip below the object
            const tooltipX = obj.x - textWidth / 2;
            const tooltipY = obj.y + obj.radius + 10; // Adjust the offset as needed (10px below the object)
        
            // Draw tooltip background
            ctx.fillRect(tooltipX - 5, tooltipY, textWidth + 10, 20);
        
            // Draw tooltip text
            ctx.fillStyle = 'white';
            ctx.font = `${12 / this.zoomLevel}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(text, obj.x, tooltipY + 15); // Adjust text position within the background
        }
        

        ctx.restore();
        requestAnimationFrame(this.render.bind(this));
    }
}




function generateMineableObjects(numObjects, mapWidth, mapHeight) {
    const objects = [];
    const types = ["metal", "crystal", "gas"];
    const rarities = ["common", "rare", "legendary"];
    const colors = {
        metal: "gray",
        crystal: "blue",
        gas: "green",
        common: "rgba(255, 255, 255, 0.6)", // Common glow
        rare: "rgba(0, 255, 255, 0.6)",    // Rare glow
        legendary: "rgba(255, 215, 0, 0.6)" // Legendary glow
    };
    const rarityWeights = [0.7, 0.25, 0.05]; // Common, Rare, Legendary

    for (let i = 0; i < numObjects; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const radius = Math.random() * 15 + 10; // Radius between 10-25
        const value = Math.floor(radius * 100); // Value proportional to size
        const rarityIndex = weightedRandom(rarityWeights);
        const rarity = rarities[rarityIndex];

        // Generate random mineral quantity between 1M and 10M
        const minerals = Math.floor(Math.random() * (10_000_000 - 1_000_000 + 1)) + 1_000_000;

        objects.push({
            x: Math.random() * mapWidth,
            y: Math.random() * mapHeight,
            radius: radius,
            type: type,
            rarity: rarity,
            color: colors[type],
            glow: colors[rarity], // Rarity-based glow color
            value: value * (1 + rarityIndex), // Higher value for rarer resources
            minerals: minerals, // Assign mineral quantity
            mined: false,
        });
    }

    return objects;
}


function weightedRandom(weights) {
    const sum = weights.reduce((a, b) => a + b, 0);
    const rand = Math.random() * sum;
    let cumulative = 0;

    for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (rand < cumulative) return i;
    }

    return weights.length - 1;
}

const gameController = new GameController();
const spaceMap = new SpaceMap('canvasId', gameController);

const objects = generateMineableObjects(10, spaceMap.canvas.width, spaceMap.canvas.height);
objects.forEach(obj => spaceMap.addObject(obj.x, obj.y, obj.radius, obj.color, obj.value, obj.type, obj.rarity));
