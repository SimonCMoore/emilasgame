class ShoeRoom {
    constructor(scene, loadingManager) {
        this.scene = scene;
        this.objects = new Map();
        this.textures = {};
        this.loadingManager = loadingManager || new THREE.LoadingManager();
        this.game = null;
        this.createRoom();
    }

    setGame(game) {
        this.game = game;
    }
    
    createRoom() {
        // Create floor with same marble texture as previous room
        const floorGeometry = new THREE.PlaneGeometry(10, 10);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xaaaaaa,
            roughness: 0.3,
            metalness: 0.1
        });
        this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.floor.rotation.x = -Math.PI / 2;
        this.floor.receiveShadow = true;
        this.scene.add(this.floor);
        
        // Create walls with cream color
        const wallMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xfff8e1,
            roughness: 0.2,
            metalness: 0.1
        });
        
        // Back wall with door
        this.createWallWithDoor(wallMaterial, 'back', new THREE.Vector3(0, 2, -5));
        
        // Front wall with door
        this.createWallWithDoor(wallMaterial, 'front', new THREE.Vector3(0, 2, 5));
        
        // Left wall with shelves
        const leftWall = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 4),
            wallMaterial
        );
        leftWall.position.set(-5, 2, 0);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);
        
        // Right wall with shelves
        const rightWall = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 4),
            wallMaterial
        );
        rightWall.position.set(5, 2, 0);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.receiveShadow = true;
        this.scene.add(rightWall);
        
        // Add ceiling
        const ceiling = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.1
            })
        );
        ceiling.position.y = 4;
        ceiling.rotation.x = Math.PI / 2;
        this.scene.add(ceiling);
        
        // Add shoe displays
        this.createShoeDisplays();
        
        // Add lighting
        this.setupLighting();
    }
    
    createWallWithDoor(wallMaterial, position, wallPos) {
        // Create wall segments
        const wallLeft = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 4),
            wallMaterial
        );
        const wallRight = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 4),
            wallMaterial
        );
        
        // Position wall segments
        if (position === 'back') {
            wallLeft.position.set(-3, wallPos.y, wallPos.z);
            wallRight.position.set(3, wallPos.y, wallPos.z);
        } else {
            wallLeft.position.set(-3, wallPos.y, wallPos.z);
            wallRight.position.set(3, wallPos.y, wallPos.z);
            wallLeft.rotation.y = Math.PI;
            wallRight.rotation.y = Math.PI;
        }
        
        this.scene.add(wallLeft);
        this.scene.add(wallRight);
        
        // Add door frame
        const doorFrameMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.5
        });
        
        // Door frame pieces
        const doorTop = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 0.3, 0.2),
            doorFrameMaterial
        );
        doorTop.position.set(wallPos.x, 3.5, wallPos.z);
        
        const doorLeft = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 3.5, 0.2),
            doorFrameMaterial
        );
        doorLeft.position.set(-1, 1.75, wallPos.z);
        
        const doorRight = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 3.5, 0.2),
            doorFrameMaterial
        );
        doorRight.position.set(1, 1.75, wallPos.z);
        
        this.scene.add(doorTop);
        this.scene.add(doorLeft);
        this.scene.add(doorRight);
    }
    
    createShoeDisplays() {
        // Create shoe counters
        this.createShoeCounter(-2, 0, 0, Math.PI / 4);
        this.createShoeCounter(2, 0, 0, -Math.PI / 4);
        
        // Create wall shelves
        for (let x = -4; x <= 4; x += 2) {
            this.createWallShelf(x, 1.5, -4.8); // Back wall
            this.createWallShelf(x, 2.5, -4.8);
            this.createWallShelf(-4.8, 1.5, x); // Left wall
            this.createWallShelf(-4.8, 2.5, x);
            this.createWallShelf(4.8, 1.5, x);  // Right wall
            this.createWallShelf(4.8, 2.5, x);
        }
    }
    
    createShoeCounter(x, y, z, rotation) {
        // Counter base
        const counterGeometry = new THREE.BoxGeometry(3, 1, 1.5);
        const counterMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c1810,
            roughness: 0.3,
            metalness: 0.2
        });
        const counter = new THREE.Mesh(counterGeometry, counterMaterial);
        counter.position.set(x, y + 0.5, z);
        counter.rotation.y = rotation;
        counter.castShadow = true;
        counter.receiveShadow = true;
        this.scene.add(counter);
        
        // Counter top
        const topGeometry = new THREE.BoxGeometry(3.2, 0.1, 1.7);
        const topMaterial = new THREE.MeshStandardMaterial({
            color: 0x3c2820,
            roughness: 0.2,
            metalness: 0.3
        });
        const top = new THREE.Mesh(topGeometry, topMaterial);
        top.position.set(x, y + 1, z);
        top.rotation.y = rotation;
        top.castShadow = true;
        top.receiveShadow = true;
        this.scene.add(top);
        
        // Add display shoes
        const shoePositions = [
            { x: -0.8, z: -0.4 },
            { x: 0, z: -0.4 },
            { x: 0.8, z: -0.4 },
            { x: -0.8, z: 0.4 },
            { x: 0, z: 0.4 },
            { x: 0.8, z: 0.4 }
        ];
        
        shoePositions.forEach(pos => {
            const shoeColor = this.getRandomShoeColor();
            this.createShoe(
                x + pos.x * Math.cos(rotation) - pos.z * Math.sin(rotation),
                y + 1.05,
                z + pos.x * Math.sin(rotation) + pos.z * Math.cos(rotation),
                rotation,
                shoeColor
            );
        });
    }
    
    createWallShelf(x, y, z) {
        // Create shelf
        const shelfGeometry = new THREE.BoxGeometry(1.8, 0.1, 0.6);
        const shelfMaterial = new THREE.MeshStandardMaterial({
            color: 0x3c2820,
            roughness: 0.2,
            metalness: 0.3
        });
        const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
        shelf.position.set(x, y, z);
        if (Math.abs(x) > 4) { // Side walls
            shelf.rotation.y = Math.PI / 2;
        }
        shelf.castShadow = true;
        shelf.receiveShadow = true;
        this.scene.add(shelf);
        
        // Add shoes to shelf
        const isOnSideWall = Math.abs(x) > 4;
        const shoeSpacing = 0.4;
        for (let i = -1; i <= 1; i++) {
            const shoeColor = this.getRandomShoeColor();
            if (isOnSideWall) {
                this.createShoe(
                    x + (x > 0 ? -0.2 : 0.2),
                    y + 0.15,
                    z + i * shoeSpacing,
                    x > 0 ? -Math.PI / 2 : Math.PI / 2,
                    shoeColor
                );
            } else {
                this.createShoe(
                    x + i * shoeSpacing,
                    y + 0.15,
                    z + 0.2,
                    0,
                    shoeColor
                );
            }
        }
    }
    
    createShoe(x, y, z, rotation, color) {
        // Simplified shoe model
        const shoeGroup = new THREE.Group();
        
        // Shoe sole
        const soleGeometry = new THREE.BoxGeometry(0.25, 0.05, 0.12);
        const soleMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c2c2c,
            roughness: 0.8
        });
        const sole = new THREE.Mesh(soleGeometry, soleMaterial);
        shoeGroup.add(sole);
        
        // Shoe upper
        const upperGeometry = new THREE.BoxGeometry(0.22, 0.12, 0.1);
        const upperMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.3,
            metalness: 0.2
        });
        const upper = new THREE.Mesh(upperGeometry, upperMaterial);
        upper.position.y = 0.08;
        upper.position.z = -0.01;
        shoeGroup.add(upper);
        
        // Position the shoe
        shoeGroup.position.set(x, y, z);
        shoeGroup.rotation.y = rotation;
        shoeGroup.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        this.scene.add(shoeGroup);
    }
    
    getRandomShoeColor() {
        const colors = [
            0x000000, // Black
            0x8B4513, // Brown
            0xff0000, // Red
            0x4169E1, // Royal Blue
            0xff69b4, // Pink
            0xffd700  // Gold
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        
        // Main ceiling lights
        const positions = [
            { x: -3, z: -3 },
            { x: 3, z: -3 },
            { x: -3, z: 3 },
            { x: 3, z: 3 }
        ];
        
        positions.forEach(pos => {
            const spotLight = new THREE.SpotLight(0xffffff, 0.8);
            spotLight.position.set(pos.x, 3.9, pos.z);
            spotLight.angle = Math.PI / 4;
            spotLight.penumbra = 0.5;
            spotLight.decay = 1;
            spotLight.distance = 8;
            spotLight.castShadow = true;
            spotLight.shadow.mapSize.width = 1024;
            spotLight.shadow.mapSize.height = 1024;
            this.scene.add(spotLight);
        });
        
        // Add accent lighting for displays
        const displayLights = [
            { x: -2, z: 0 },
            { x: 2, z: 0 }
        ];
        
        displayLights.forEach(pos => {
            const light = new THREE.PointLight(0xffffee, 0.6, 5);
            light.position.set(pos.x, 2.5, pos.z);
            this.scene.add(light);
        });
    }
    
    update() {
        // Add any animation or update logic here
    }
}
