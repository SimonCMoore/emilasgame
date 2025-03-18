// Main game class
class Game {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.player = null;
        this.room = null;
        this.interactionManager = null;
        this.inventory = null;
        this.healthValue = 100;
        this.loadingManager = new THREE.LoadingManager();
        this.levelComplete = false;
        this.startTime = Date.now();
        
        this.setupLoadingManager();
        this.init();
        this.setupStats();
    }
    
    setupStats() {
        // Update stats every second
        setInterval(() => this.updateStats(), 1000);
    }
    
    updateStats() {
        // Update health
        document.getElementById('health-value').textContent = `${this.healthValue}%`;
        
        // Update inventory count
        const itemCount = this.inventory ? this.inventory.items.length : 0;
        document.getElementById('items-count').textContent = `${itemCount}/10`;
        
        // Update time
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('time-elapsed').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    setupLoadingManager() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressBar = document.querySelector('.progress');
        
        this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            console.log(`Loading: ${url} (${itemsLoaded}/${itemsTotal})`);
            const progress = (itemsLoaded / itemsTotal) * 100;
            progressBar.style.width = progress + '%';
        };
        
        this.loadingManager.onLoad = () => {
            console.log('All resources loaded');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        };
        
        this.loadingManager.onError = (url) => {
            console.error('Error loading:', url);
        };
    }
    
    init() {
        // Create Three.js scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111111); // Dark background instead of black
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, // Field of view
            window.innerWidth / window.innerHeight, // Aspect ratio
            0.1, // Near clipping plane
            1000 // Far clipping plane
        );
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('game-canvas'),
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Enhanced lighting for better visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 4, 2);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // Add point lights for makeup counter
        const counterLight1 = new THREE.PointLight(0xffffee, 0.8, 10);
        counterLight1.position.set(-1, 3, -3);
        this.scene.add(counterLight1);
        
        const counterLight2 = new THREE.PointLight(0xffffee, 0.8, 10);
        counterLight2.position.set(1, 3, -3);
        this.scene.add(counterLight2);
        
        // Initialize inventory system
        this.inventory = new Inventory(this);
        
        // Initialize player
        this.player = new Player(this.camera);
        
        // Initialize room
        this.room = new Room(this.scene, this.loadingManager);
        this.room.setGame(this); // Set game reference in room
        
        // Initialize interaction manager
        this.interactionManager = new InteractionManager(this);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Start game loop
        this.animate();
        
        // Debug info
        console.log('Game initialized');
        console.log('WebGL Renderer:', this.renderer.info.render);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    updateHealth(value) {
        this.healthValue = Math.max(0, Math.min(100, this.healthValue + value));
        document.getElementById('health-bar').style.width = `${this.healthValue}%`;
        document.getElementById('health-value').textContent = `${this.healthValue}%`;
        
        if (this.healthValue <= 0) {
            this.gameOver();
        }
    }
    
    showMessage(text, duration = 3000) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = text;
        messageElement.style.display = 'block';
        
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, duration);
    }
    
    gameOver() {
        this.showMessage('Game Over! Restarting level...', 3000);
        
        // Reset health and restart level after delay
        setTimeout(() => {
            this.healthValue = 100;
            document.getElementById('health-bar').style.width = '100%';
            this.room.resetRoom();
            
            // Reset player position
            this.player.resetPosition();
        }, 3000);
    }
    
    completeLevel() {
        if (this.levelComplete) return;
        
        this.levelComplete = true;
        this.showMessage('You made it past the makeup department!', 3000);
        
        // Transition to the shoe department
        setTimeout(() => {
            this.transitionToShoeRoom();
        }, 3000);
    }
    
    transitionToShoeRoom() {
        // Show loading message
        this.showMessage('Loading shoe department...', 2000);
        
        // Clear current scene objects except player camera
        while(this.scene.children.length > 0) { 
            const object = this.scene.children[0];
            if (object !== this.camera) {
                this.scene.remove(object); 
            } else {
                // Skip the camera
                this.scene.remove(this.scene.children[1]);
            }
        }
        
        // Reset player position
        this.player.camera.position.set(0, 1.6, 4);
        this.player.camera.lookAt(0, 1.6, 0);
        
        // Create new room
        this.room = new ShoeRoom(this.scene, this.loadingManager);
        this.room.setGame(this);
        
        // Re-enable player movement
        this.player.canMove = true;
        
        // Show welcome message
        setTimeout(() => {
            this.showMessage('Welcome to the shoe department!', 3000);
        }, 2000);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update player
        this.player.update();
        
        // Update room
        if (this.room) {
            this.room.update();
            
            // Check for level completion
            if (!this.levelComplete && this.room.checkLevelCompletion(this.camera.position)) {
                console.log("Level complete triggered at position:", this.camera.position);
                this.completeLevel();
            }
        }
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
