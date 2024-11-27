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
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Apply zoom and pan
        ctx.save();
        ctx.scale(this.zoomLevel, this.zoomLevel);
        ctx.translate(this.offsetX, this.offsetY);

        // Draw space objects
        this.objects.forEach(obj => {
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
            ctx.fillStyle = obj.color;
            ctx.fill();
            ctx.closePath();
        });

        ctx.restore();

        requestAnimationFrame(this.render.bind(this));
    }
}

// Initialize the space map
const spaceMap = new SpaceMap('spaceMap');

// Add some example objects (asteroids, planets)
spaceMap.addObject(100, 100, 30, 'gray'); // Asteroid
spaceMap.addObject(200, 150, 50, 'blue'); // Planet
spaceMap.addObject(300, 300, 20, 'red');  // Small asteroid
this.canvas.addEventListener('click', (event) => {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) / this.zoomLevel - this.offsetX;
    const mouseY = (event.clientY - rect.top) / this.zoomLevel - this.offsetY;

    this.objects.forEach(obj => {
        const dx = mouseX - obj.x;
        const dy = mouseY - obj.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= obj.radius) {
            console.log('Clicked on an object:', obj);
            // Add logic for mining or collecting resources
        }
    });
});
