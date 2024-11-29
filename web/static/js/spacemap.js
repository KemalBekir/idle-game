class SpaceMap {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Game state
        this.zoomLevel = 1; // Default zoom level
        this.offsetX = 0; // Pan offset
        this.offsetY = 0; // Pan offset
        this.objects = []; // Array of game objects (asteroids, planets, etc.)

        // Event listeners
        this.initializeEventListeners();

        // Start rendering loop
        this.render();
    }

    initializeEventListeners() {
        this.canvas.addEventListener('wheel', this.handleZoom.bind(this));
        this.canvas.addEventListener('mousedown', this.startPanning.bind(this));
        this.canvas.addEventListener('mousemove', this.handlePanning.bind(this));
        this.canvas.addEventListener('mouseup', this.stopPanning.bind(this));

        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = (event.clientX - rect.left) / this.zoomLevel - this.offsetX;
            const mouseY = (event.clientY - rect.top) / this.zoomLevel - this.offsetY;

            this.objects.forEach(obj => {
                const dx = mouseX - obj.x;
                const dy = mouseY - obj.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= obj.radius) {
                    console.log(`Mined ${obj.type} (${obj.rarity}) worth ${obj.value} minerals!`);
                    obj.color = 'yellow'; // Change color to indicate it was clicked.
                    obj.glow = 'rgba(255, 255, 0, 0.5)'; // Add a glow effect.
                }
            });
        });



    }


    handleZoom(event) {
        event.preventDefault();
        const zoomSpeed = 0.1;
        const newZoomLevel = this.zoomLevel - event.deltaY * zoomSpeed / 100;
        this.zoomLevel = Math.max(0.5, Math.min(3, newZoomLevel)); // Limit zoom
    }

    startPanning(event) {
        this.isPanning = true;
        this.startX = event.clientX;
        this.startY = event.clientY;
    }

    handlePanning(event) {
        if (!this.isPanning) return;

        const dx = event.clientX - this.startX;
        const dy = event.clientY - this.startY;

        this.offsetX += dx / this.zoomLevel;
        this.offsetY += dy / this.zoomLevel;

        this.startX = event.clientX;
        this.startY = event.clientY;
    }

    stopPanning() {
        this.isPanning = false;
    }

    addObject(x, y, radius, color) {
        this.objects.push({ x, y, radius, color });
    }



    render() {
        console.log('Rendering...');
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Apply zoom and pan
        ctx.save();
        ctx.scale(this.zoomLevel, this.zoomLevel);
        ctx.translate(this.offsetX, this.offsetY);

        // Draw space objects
        this.objects.forEach(obj => {
            if (obj.mined) {
                // Change color or add a visual effect
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Example: fade-out effect
            } else {
                ctx.fillStyle = obj.color;
            }

            if (obj.glow && !obj.mined) {
                ctx.beginPath();
                ctx.arc(obj.x, obj.y, obj.radius + 5, 0, Math.PI * 2);
                ctx.fillStyle = obj.glow;
                ctx.fill();
                ctx.closePath();
            }

            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        });

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

        objects.push({
            x: Math.random() * mapWidth,
            y: Math.random() * mapHeight,
            radius: radius,
            type: type,
            rarity: rarity,
            color: colors[type],
            glow: colors[rarity], // Rarity-based glow color
            value: value * (1 + rarityIndex), // Higher value for rarer resources
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

const rarityWeights = [0.7, 0.25, 0.05]; // Common, Rare, Legendary
const typeIndex = weightedRandom(rarityWeights);
const types = ["common", "rare", "legendary"];
console.log(types[typeIndex]); // Outputs type based on weight


// Initialize the space map
const spaceMap = new SpaceMap('spaceMap');

// Generate and add mineable objects
const objects = generateMineableObjects(10, spaceMap.canvas.width, spaceMap.canvas.height);
objects.forEach(obj => spaceMap.addObject(obj.x, obj.y, obj.radius, obj.color));
