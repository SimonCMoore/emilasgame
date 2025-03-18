class Player {
    constructor(camera) {
        this.camera = camera;
        this.moveSpeed = 0.1;
        this.lookSpeed = 0.002;
        this.canMove = true;
        
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
        this.velocity = new THREE.Vector3();
        
        // Set initial position - moved back and up for better initial view
        this.initialPosition = new THREE.Vector3(0, 1.6, 2);
        this.camera.position.copy(this.initialPosition);
        this.camera.lookAt(0, 1.6, -3); // Look at the counter
        
        this.setupControls();
        console.log('Player initialized at position:', this.camera.position);
    }
    
    setupControls() {
        // Mouse look controls
        document.addEventListener('mousemove', (event) => {
            if (!this.canMove) return;
            
            this.euler.setFromQuaternion(this.camera.quaternion);
            
            this.euler.y -= event.movementX * this.lookSpeed;
            this.euler.x -= event.movementY * this.lookSpeed;
            
            // Limit vertical look angle
            this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));
            
            this.camera.quaternion.setFromEuler(this.euler);
        });
        
        // Movement controls
        document.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'KeyW':
                    this.moveForward = true;
                    break;
                case 'KeyS':
                    this.moveBackward = true;
                    break;
                case 'KeyA':
                    this.moveLeft = true;
                    break;
                case 'KeyD':
                    this.moveRight = true;
                    break;
            }
        });
        
        document.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'KeyW':
                    this.moveForward = false;
                    break;
                case 'KeyS':
                    this.moveBackward = false;
                    break;
                case 'KeyA':
                    this.moveLeft = false;
                    break;
                case 'KeyD':
                    this.moveRight = false;
                    break;
            }
        });
        
        // Lock pointer on click
        document.addEventListener('click', () => {
            if (document.pointerLockElement === null) {
                document.body.requestPointerLock();
            }
        });
        
        // Handle pointer lock change
        document.addEventListener('pointerlockchange', () => {
            this.canMove = document.pointerLockElement !== null;
        });
    }
    
    resetPosition() {
        this.camera.position.copy(this.initialPosition);
        this.camera.lookAt(0, 1.6, -3);
    }
    
    update() {
        if (!this.canMove) return;
        
        // Calculate movement direction
        const direction = new THREE.Vector3();
        
        if (this.moveForward) direction.z -= 1;
        if (this.moveBackward) direction.z += 1;
        if (this.moveLeft) direction.x -= 1;
        if (this.moveRight) direction.x += 1;
        
        direction.normalize();
        
        // Get camera's forward direction
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.camera.quaternion);
        forward.y = 0; // Keep movement in horizontal plane
        forward.normalize();
        
        // Get camera's right direction
        const right = new THREE.Vector3(1, 0, 0);
        right.applyQuaternion(this.camera.quaternion);
        right.y = 0; // Keep movement in horizontal plane
        right.normalize();
        
        // Calculate movement
        this.velocity.set(0, 0, 0);
        if (this.moveForward) this.velocity.add(forward.multiplyScalar(this.moveSpeed));
        if (this.moveBackward) this.velocity.sub(forward.multiplyScalar(this.moveSpeed));
        if (this.moveLeft) this.velocity.sub(right.multiplyScalar(this.moveSpeed));
        if (this.moveRight) this.velocity.add(right.multiplyScalar(this.moveSpeed));
        
        // Update position
        this.camera.position.add(this.velocity);
        
        // Keep player within room bounds - allow passing through doorway when NPC is not blocking
        const roomBounds = {
            minX: -4.5,
            maxX: 4.5,
            minZ: -4.5,
            maxZ: 4.5
        };
        
        // Special case for doorway
        const isDoorway = Math.abs(this.camera.position.z) < 1 && this.camera.position.x > 4.5 && this.camera.position.x < 6;
        
        if (!isDoorway) {
            this.camera.position.x = Math.max(roomBounds.minX, Math.min(roomBounds.maxX, this.camera.position.x));
            this.camera.position.z = Math.max(roomBounds.minZ, Math.min(roomBounds.maxZ, this.camera.position.z));
        }
    }
}
