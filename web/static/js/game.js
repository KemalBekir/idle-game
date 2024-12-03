class GameController {
    constructor() {
        this.canvas = document.getElementById('canvasId');
        this.ctx = this.canvas.getContext('2d');

        // UI elements
        this.mineralCount = document.getElementById('mineralCount');
        this.droneCount = document.getElementById('droneCount');
        this.oilCount = document.getElementById('oilCount');
        this.buyDroneBtn = document.getElementById('buyDroneBtn');
        this.sellMineralsBtn = document.getElementById('sellMineralsBtn');
        this.asteroid = document.getElementById('asteroid');
        this.spaceJunkContainer = document.getElementById('spaceJunkContainer');
        this.researchContainer = document.getElementById('researchGrid');

        // Zoom control elements
        this.zoomInBtn = document.getElementById('zoomIn');
        this.zoomOutBtn = document.getElementById('zoomOut');

        // Game state
        this.minerals = 0;
        this.oil = 0;
        this.drones = 0;
        this.currentDronePrice = 10;
        this.mineralsPerDrone = 0.1;
        this.droneProductivityMultiplier = 1;
        this.objectDrones = {}; // Tracks drones per object ID

        // Zoom-related properties
        this.currentZoom = 1; // Default zoom level
        this.minZoom = 0.5;   // Minimum zoom level
        this.maxZoom = 2;     // Maximum zoom level
        this.zoomStep = 0.1;  // Amount to zoom in or out

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
        this.initializeZoomControls();
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

    // Initialize zoom controls
    initializeZoomControls() {
        this.zoomInBtn.addEventListener('click', () => this.adjustZoom(1));
        this.zoomOutBtn.addEventListener('click', () => this.adjustZoom(-1));
    }

    // Adjust zoom level
    adjustZoom(direction) {
        const newZoom = this.currentZoom + direction * this.zoomStep;

        if (newZoom >= this.minZoom && newZoom <= this.maxZoom) {
            this.currentZoom = newZoom;
            document.querySelector('.game-area').style.transform = `scale(${this.currentZoom})`;
        }
    }

    addMinerals(amount) {
        this.minerals += amount;
        this.updateUI();
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

    // Buy a drone for a specific object
    handleBuyDroneForObject(objectId) {
        if (this.minerals >= this.currentDronePrice) {
            this.minerals -= this.currentDronePrice;

            // Initialize drone count for the object if it doesn't exist
            if (!this.objectDrones[objectId]) {
                this.objectDrones[objectId] = 0;
            }

            this.objectDrones[objectId] += 1; // Add a drone to the object
            this.currentDronePrice = Math.ceil(10 * Math.pow(1.1, this.drones));
            this.updateUI();
        } else {
            alert(`Not enough minerals! Need ${this.currentDronePrice} minerals.`);
        }
    }
    drawBackground() {
        return new Promise((resolve, reject) => {
            const bgImage = new Image();
            bgImage.src = '/static/assets/background.jpg'; // Ensure this path is correct
            
            bgImage.onload = () => {
                console.log('Image loaded successfully:', bgImage.src);
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.drawImage(bgImage, 0, 0, this.canvas.width, this.canvas.height);
                resolve(bgImage);
            };
        
            bgImage.onerror = () => {
                console.error('Failed to load background image:', bgImage.src);
                reject(new Error('Image failed to load'));
            };
        });
    }
    


    startGameLoop() {
        this.drawBackground();
        setInterval(() => this.updateGameState(), 1000);
    }

    // Update game state to handle mining by object-specific drones
    updateGameState() {
        for (const objectId in this.objectDrones) {
            const object = spaceMap.objects.find(obj => obj.id === objectId);
            if (object) {
                const drones = this.objectDrones[objectId];
                const minedAmount = drones * this.mineralsPerDrone * this.droneProductivityMultiplier;
                object.minerals = Math.max(0, object.minerals - minedAmount);

                // Add minerals to player only if object has remaining resources
                if (object.minerals > 0) {
                    this.minerals += minedAmount;
                }
            }
        }

        this.updateUI();
    }

    spawnSpaceJunk() {
        console.log("junk appeared");

        // Define the spawn interval range (in milliseconds)
        let maxInterval = 7 * 60 * 1000; // 7 minutes
        const minInterval = 4 * 60 * 1000; // 4 minutes
        const cooldownTime = 10 * 1000; // 10 seconds cooldown after junk is clicked

        const nextJunkTimer = document.getElementById('nextJunkTimer'); // Timer display element
        let timerInterval; // Declare a variable to store the timer interval ID
        let cooldownActive = false; // Cooldown flag

        // Function to spawn space junk
        const spawn = () => {
            if (cooldownActive) {
                // If cooldown is active, schedule next spawn after cooldown ends
                console.log("Cooldown active, delaying spawn.");
                setTimeout(() => {
                    cooldownActive = false;
                    spawn();
                }, cooldownTime);
                return;
            }

            // Clear any existing timer interval
            if (timerInterval) {
                clearInterval(timerInterval);
            }

            // Create the junk container
            const junkContainer = document.createElement('div');
            junkContainer.style.position = 'absolute';

            // Create the junk image
            const junk = document.createElement('div');
            junk.className = 'space-junk';
            junk.style.backgroundImage = "url('/static/assets/stargate.png')"; // Ensure the path is correct
            junk.style.backgroundSize = "contain";
            junk.style.backgroundRepeat = "no-repeat";
            junk.style.width = "120px";
            junk.style.height = "120px";

            // Create the countdown text
            const countdown = document.createElement('span');
            countdown.style.position = 'relative';
            countdown.style.top = '130px'; // Move the countdown below the image
            countdown.style.left = '25px';
            countdown.style.color = 'white';
            countdown.style.fontSize = '12px';
            countdown.style.textAlign = 'center';

            // Position the junk container randomly
            const containerWidth = this.spaceJunkContainer.offsetWidth;
            const containerHeight = this.spaceJunkContainer.offsetHeight;
            const randomX = Math.random() * (containerWidth - 50);
            const randomY = Math.random() * (containerHeight - 70); // Account for junk and text height

            junkContainer.style.left = `${randomX}px`;
            junkContainer.style.top = `${randomY}px`;

            // Attach junk and countdown to the container
            junkContainer.appendChild(junk);
            junkContainer.appendChild(countdown);
            this.spaceJunkContainer.appendChild(junkContainer);

            // Countdown logic
            let timeLeft = 10; // 10 seconds
            countdown.textContent = `Time left: ${timeLeft}s`;

            const countdownInterval = setInterval(() => {
                timeLeft -= 1;
                countdown.textContent = `Time left: ${timeLeft}s`;

                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    if (junkContainer.parentNode) {
                        this.spaceJunkContainer.removeChild(junkContainer);
                    }
                }
            }, 1000);

            // Handle click on junk
            junk.addEventListener('click', () => {
                const reward = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000; // 1,000–10,000
                this.minerals += reward;
                this.updateUI();

                // Clear the countdown interval for this junk
                clearInterval(countdownInterval);
                if (junkContainer.parentNode) {
                    this.spaceJunkContainer.removeChild(junkContainer);
                }

                // Activate cooldown
                cooldownActive = true;
                setTimeout(() => {
                    cooldownActive = false; // Cooldown ends after cooldownTime
                }, cooldownTime);

                // Schedule the next spawn after the cooldown
                setTimeout(spawn, Math.random() * maxInterval + minInterval);
            });

            // Schedule next spawn and display timer
            const nextInterval = Math.random() * maxInterval + minInterval;
            let nextJunkTime = Math.floor(nextInterval / 1000); // Convert to seconds
            nextJunkTimer.textContent = `Next space junk in: ${Math.floor(nextJunkTime / 60)}:${nextJunkTime % 60}`;
            nextJunkTimer.style.position = 'fixed';
            nextJunkTimer.style.top = '10px';
            nextJunkTimer.style.left = '10px';

            timerInterval = setInterval(() => {
                nextJunkTime -= 1;
                const minutes = Math.floor(nextJunkTime / 60);
                const seconds = nextJunkTime % 60;
                nextJunkTimer.textContent = `Next space junk in: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                if (nextJunkTime <= 0) {
                    clearInterval(timerInterval);
                }
            }, 1000);

            setTimeout(spawn, nextInterval);
        };

        // Initial spawn
        spawn();
    }



    // Research mechanic to reduce max interval
    spaceJunkDurationResearch() {
        const researchReduction = 30 * 1000; // Reduce by 30 seconds per research
        const minInterval = 4 * 60 * 1000; // Minimum 4 minutes

        this.maxInterval = Math.max(this.maxInterval - researchReduction, minInterval);
        console.log(`Max interval reduced to: ${this.maxInterval / 1000 / 60} minutes`);
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
