class Room {
    constructor(scene, loadingManager) {
        this.scene = scene;
        this.objects = new Map();
        this.textures = {};
        this.loadingManager = loadingManager || new THREE.LoadingManager();
        this.game = null; // Will be set by the game
        this.createRoom(); // Create room immediately with placeholder materials
        this.loadTextures(); // Then load textures and update materials
    }

    setGame(game) {
        this.game = game;
        if (this.salesAssistant) {
            this.salesAssistant.game = game;
        }
    }

    loadTextures() {
        console.log('Loading textures...');
        const textureLoader = new THREE.TextureLoader(this.loadingManager);
        
        // Load marble texture for the floor - using a different reliable source
        this.textures.marbleColor = textureLoader.load('https://threejs.org/examples/textures/floors/FloorsCheckerboard_S_Diffuse.jpg', 
            // onLoad callback
            (texture) => {
                console.log('Marble color texture loaded');
                this.updateFloorTexture();
            },
            // onProgress callback
            undefined,
            // onError callback
            (err) => {
                console.error('Error loading marble texture:', err);
                // Use a fallback color if texture fails to load
                this.floor.material.color.set(0xcccccc);
            }
        );
        
        this.textures.marbleNormal = textureLoader.load('https://threejs.org/examples/textures/floors/FloorsCheckerboard_S_Normal.jpg',
            // onLoad callback
            (texture) => {
                console.log('Marble normal texture loaded');
                this.updateFloorTexture();
            },
            // onProgress callback
            undefined,
            // onError callback
            (err) => {
                console.error('Error loading marble normal texture:', err);
            }
        );
    }
    
    updateFloorTexture() {
        if (this.floor && this.textures.marbleColor && this.textures.marbleNormal) {
            console.log('Updating floor with loaded textures');
            
            // Configure marble texture
            this.textures.marbleColor.wrapS = this.textures.marbleColor.wrapT = THREE.RepeatWrapping;
            this.textures.marbleNormal.wrapS = this.textures.marbleNormal.wrapT = THREE.RepeatWrapping;
            this.textures.marbleColor.repeat.set(4, 4);
            this.textures.marbleNormal.repeat.set(4, 4);
            
            // Update floor material
            this.floor.material.map = this.textures.marbleColor;
            this.floor.material.normalMap = this.textures.marbleNormal;
            this.floor.material.needsUpdate = true;
        }
    }
    
    createRoom() {
        console.log('Creating room...');
        
        // Create floor with placeholder material first
        const floorGeometry = new THREE.PlaneGeometry(10, 10);
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xaaaaaa, // Placeholder color until texture loads
            roughness: 0.3,
            metalness: 0.1
        });
        this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
        this.floor.rotation.x = -Math.PI / 2;
        this.floor.receiveShadow = true;
        this.scene.add(this.floor);
        
        // Create walls with cream color
        const wallMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xfff8e1, // Cream color
            roughness: 0.2,  // Smoother finish
            metalness: 0.1   // Slight sheen
        });
        
        // Back wall
        const backWall = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 4),
            wallMaterial
        );
        backWall.position.z = -5;
        backWall.position.y = 2;
        backWall.receiveShadow = true;
        this.scene.add(backWall);
        
        // Front wall
        const frontWall = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 4),
            wallMaterial
        );
        frontWall.position.z = 5;
        frontWall.position.y = 2;
        frontWall.rotation.y = Math.PI;
        frontWall.receiveShadow = true;
        this.scene.add(frontWall);
        
        // Left wall
        const leftWall = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 4),
            wallMaterial
        );
        leftWall.position.x = -5;
        leftWall.position.y = 2;
        leftWall.rotation.y = Math.PI / 2;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);
        
        // Right wall with door
        const rightWallLeft = new THREE.Mesh(
            new THREE.PlaneGeometry(6, 4),
            wallMaterial
        );
        rightWallLeft.position.x = 5;
        rightWallLeft.position.z = 2;
        rightWallLeft.position.y = 2;
        rightWallLeft.rotation.y = -Math.PI / 2;
        rightWallLeft.receiveShadow = true;
        this.scene.add(rightWallLeft);
        
        const rightWallRight = new THREE.Mesh(
            new THREE.PlaneGeometry(6, 4),
            wallMaterial
        );
        rightWallRight.position.x = 5;
        rightWallRight.position.z = -2;
        rightWallRight.position.y = 2;
        rightWallRight.rotation.y = -Math.PI / 2;
        rightWallRight.receiveShadow = true;
        this.scene.add(rightWallRight);
        
        // Door frame
        const doorFrameMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513, // Brown
            roughness: 0.5
        });
        
        // Top of door frame
        const doorTop = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.3, 2),
            doorFrameMaterial
        );
        doorTop.position.set(5, 3.5, 0);
        this.scene.add(doorTop);
        
        // Left side of door frame
        const doorLeft = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 3.5, 0.3),
            doorFrameMaterial
        );
        doorLeft.position.set(5, 1.75, 1);
        this.scene.add(doorLeft);
        
        // Right side of door frame
        const doorRight = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 3.5, 0.3),
            doorFrameMaterial
        );
        doorRight.position.set(5, 1.75, -1);
        this.scene.add(doorRight);
        
        // Add ceiling for better enclosed feeling
        const ceilingGeometry = new THREE.PlaneGeometry(10, 10);
        const ceilingMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.1
        });
        const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceiling.position.y = 4;
        ceiling.rotation.x = Math.PI / 2;
        this.scene.add(ceiling);
        
        // Add decorative elements
        this.addDecorativeElements();
        
        // Add makeup counter
        this.createMakeupCounter();
        
        // Add handbag
        this.createHandbag();
        
        // Add sales assistant
        this.createSalesAssistant();

        // Add more lighting to brighten the scene
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        // Main spotlight
        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(0, 3.9, 0);
        spotLight.angle = Math.PI / 3;
        spotLight.penumbra = 0.5;
        spotLight.decay = 1;
        spotLight.distance = 10;
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        this.scene.add(spotLight);
        
        // Add additional lights to ensure the room is well-lit
        const frontLight = new THREE.PointLight(0xffffff, 0.7, 10);
        frontLight.position.set(0, 2, 3);
        this.scene.add(frontLight);
        
        // Add counter-specific lighting
        const counterSpot = new THREE.SpotLight(0xffffee, 0.8);
        counterSpot.position.set(0, 3, -2);
        counterSpot.target.position.set(0, 1, -3);
        counterSpot.angle = Math.PI / 6;
        counterSpot.penumbra = 0.2;
        counterSpot.castShadow = true;
        this.scene.add(counterSpot);
        this.scene.add(counterSpot.target);
        
        // Add door light
        const doorLight = new THREE.PointLight(0xffffee, 0.8, 5);
        doorLight.position.set(4.5, 3, 0);
        this.scene.add(doorLight);
    }
    
    addDecorativeElements() {
        // Add paintings to walls
        this.addPainting(-3, 2, -4.95, 1.5, 1, 'makeup_ad1');
        this.addPainting(3, 2, -4.95, 1.5, 1, 'makeup_ad2');
        this.addPainting(-4.95, 2, 0, 1, 1.5, 'makeup_ad3', Math.PI / 2);
        
        // Add decorative plants
        this.addPlant(-4.5, 0, 4.5);
        this.addPlant(4.5, 0, -4.5);
        
        // Add display shelves
        this.addShelf(-4.5, 1.5, -2);
        this.addShelf(-4.5, 2.5, -2);
    }
    
    addPainting(x, y, z, width, height, type, rotation = 0) {
        // Create canvas for the painting
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        
        // Fill with base color
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw different content based on type
        switch(type) {
            case 'makeup_ad1':
                // Lipstick ad
                context.fillStyle = '#ff0000';
                context.fillRect(50, 50, 412, 412);
                context.fillStyle = '#ffffff';
                context.font = 'bold 60px Arial';
                context.textAlign = 'center';
                context.fillText('RED', 256, 200);
                context.fillText('LIPS', 256, 280);
                context.font = 'bold 40px Arial';
                context.fillText('NEW COLLECTION', 256, 350);
                break;
                
            case 'makeup_ad2':
                // Perfume ad
                context.fillStyle = '#f5f5f5';
                context.fillRect(50, 50, 412, 412);
                context.fillStyle = '#000000';
                context.font = 'bold 50px Arial';
                context.textAlign = 'center';
                context.fillText('ELEGANCE', 256, 200);
                context.font = 'bold 40px Arial';
                context.fillText('PERFUME', 256, 280);
                context.fillStyle = '#ffd700';
                context.fillRect(156, 320, 200, 100);
                break;
                
            case 'makeup_ad3':
                // Beauty ad
                context.fillStyle = '#ffcce6';
                context.fillRect(50, 50, 412, 412);
                context.fillStyle = '#000000';
                context.font = 'bold 50px Arial';
                context.textAlign = 'center';
                context.fillText('BEAUTY', 256, 200);
                context.fillText('ESSENTIALS', 256, 280);
                context.font = 'bold 30px Arial';
                context.fillText('MAKEUP DEPARTMENT', 256, 350);
                break;
        }
        
        // Create frame
        const frameGeometry = new THREE.BoxGeometry(width + 0.1, height + 0.1, 0.05);
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.5
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(x, y, z);
        if (rotation) {
            frame.rotation.y = rotation;
        }
        this.scene.add(frame);
        
        // Create painting
        const paintingTexture = new THREE.CanvasTexture(canvas);
        const paintingMaterial = new THREE.MeshBasicMaterial({
            map: paintingTexture
        });
        const paintingGeometry = new THREE.PlaneGeometry(width, height);
        const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
        painting.position.set(x, y, z + 0.03);
        if (rotation) {
            painting.rotation.y = rotation;
        }
        this.scene.add(painting);
    }
    
    addPlant(x, y, z) {
        // Create pot
        const potGeometry = new THREE.CylinderGeometry(0.3, 0.2, 0.4, 16);
        const potMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.8
        });
        const pot = new THREE.Mesh(potGeometry, potMaterial);
        pot.position.set(x, y + 0.2, z);
        this.scene.add(pot);
        
        // Create plant
        const plantGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const plantMaterial = new THREE.MeshStandardMaterial({
            color: 0x228B22,
            roughness: 1
        });
        const plant = new THREE.Mesh(plantGeometry, plantMaterial);
        plant.position.set(x, y + 0.7, z);
        this.scene.add(plant);
    }
    
    addShelf(x, y, z) {
        const shelfGeometry = new THREE.BoxGeometry(1, 0.05, 0.5);
        const shelfMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.5
        });
        const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
        shelf.position.set(x, y, z);
        this.scene.add(shelf);
        
        // Add small decorative items on shelves
        if (y > 2) {
            // Add perfume bottle on top shelf
            const bottleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 16);
            const bottleMaterial = new THREE.MeshStandardMaterial({
                color: 0xffd700,
                metalness: 0.8,
                roughness: 0.2
            });
            const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial);
            bottle.position.set(x, y + 0.1, z);
            this.scene.add(bottle);
        } else {
            // Add makeup box on lower shelf
            const boxGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.2);
            const boxMaterial = new THREE.MeshStandardMaterial({
                color: 0xff69b4,
                roughness: 0.3
            });
            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.set(x, y + 0.05, z);
            this.scene.add(box);
        }
    }
    
    createHandbag() {
        // Create a more detailed handbag model
        const bagGroup = new THREE.Group();
        
        // Main bag body
        const bagGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.2);
        const bagMaterial = new THREE.MeshStandardMaterial({
            color: 0xff69b4, // Pink
            roughness: 0.3,
            metalness: 0.5,
            emissive: 0xff69b4,
            emissiveIntensity: 0.2
        });
        const bag = new THREE.Mesh(bagGeometry, bagMaterial);
        bagGroup.add(bag);
        
        // Add handle
        const handleGeometry = new THREE.TorusGeometry(0.15, 0.02, 8, 16, Math.PI);
        const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0xff69b4,
            roughness: 0.3,
            metalness: 0.5
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.rotation.x = Math.PI / 2;
        handle.position.y = 0.2;
        bagGroup.add(handle);
        
        // Add decorative elements
        const buckleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700, // Gold
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0xffd700,
            emissiveIntensity: 0.2
        });
        
        // Add buckle
        const buckleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.02);
        const buckle = new THREE.Mesh(buckleGeometry, buckleMaterial);
        buckle.position.set(0, 0, 0.1);
        bagGroup.add(buckle);
        
        // Position the bag on the counter
        bagGroup.position.set(-1.5, 1.1, -2.7); // Moved to counter
        bagGroup.rotation.y = Math.PI / 6;
        bagGroup.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        this.scene.add(bagGroup);
        
        // Add glow effect
        const glow = new THREE.PointLight(0xff69b4, 0.7, 1);
        glow.position.copy(bagGroup.position);
        this.scene.add(glow);
        
        // Add floating text to indicate interactivity
        const floatingText = this.createFloatingText("Press I to pick up", 0xffffff);
        floatingText.position.set(-1.5, 1.4, -2.7);
        this.scene.add(floatingText);
        
        // Store reference for interaction
        this.objects.set(bagGroup.uuid, {
            type: 'handbag',
            mesh: bagGroup,
            glow: glow,
            floatingText: floatingText
        });
    }
    
    createFloatingText(text, color) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        // Draw text
        context.font = 'bold 24px Arial';
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true,
            opacity: 0.8
        });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(1, 0.25, 1);
        
        return sprite;
    }
    
    createSalesAssistant() {
        // Create NPC at the door position
        const npcPosition = new THREE.Vector3(4, 0, 0);
        this.salesAssistant = new NPC(this.scene, npcPosition, this.game);
    }
    
    createMakeupCounter() {
        // Counter base - made more luxurious looking
        const counterGeometry = new THREE.BoxGeometry(4, 1, 1.5);
        const counterMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2c1810, // Rich dark wood color
            roughness: 0.3,
            metalness: 0.2
        });
        const counter = new THREE.Mesh(counterGeometry, counterMaterial);
        counter.position.set(0, 0.5, -3);
        counter.castShadow = true;
        counter.receiveShadow = true;
        this.scene.add(counter);
        
        // Counter top - glass effect
        const counterTopGeometry = new THREE.BoxGeometry(4, 0.05, 1.5);
        const counterTopMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0xffffff,
            roughness: 0,
            metalness: 0.5,
            transmission: 0.6,
            thickness: 0.5
        });
        const counterTop = new THREE.Mesh(counterTopGeometry, counterTopMaterial);
        counterTop.position.set(0, 1.02, -3);
        counterTop.castShadow = true;
        counterTop.receiveShadow = true;
        this.scene.add(counterTop);
        
        // Mirror with frame
        const mirrorFrameGeometry = new THREE.BoxGeometry(3.2, 2.2, 0.1);
        const mirrorFrameMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xb39b68, // Gold frame
            roughness: 0.3,
            metalness: 0.8
        });
        const mirrorFrame = new THREE.Mesh(mirrorFrameGeometry, mirrorFrameMaterial);
        mirrorFrame.position.set(0, 2, -3.5);
        mirrorFrame.castShadow = true;
        this.scene.add(mirrorFrame);

        const mirrorGeometry = new THREE.BoxGeometry(3, 2, 0.05);
        const mirrorMaterial = new THREE.MeshPhysicalMaterial({ 
            color: 0xffffff,
            roughness: 0,
            metalness: 1,
            envMapIntensity: 1
        });
        const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
        mirror.position.set(0, 2, -3.48);
        this.scene.add(mirror);
        
        // Add lipstick smudge on mirror as a clue
        this.addLipstickSmudge(mirror);
        
        // Store mirror for interactions
        this.objects.set(mirror.uuid, {
            type: 'mirror',
            mesh: mirror
        });
        
        // Add makeup items - made larger and more visible
        this.createMakeupItem(0.8, 1.1, -2.7, 0xff0000, 'lipstick');    // Red lipstick
        this.createMakeupItem(0, 1.1, -2.7, 0xffd700, 'compact');       // Gold compact
        this.createMakeupItem(-0.8, 1.1, -2.7, 0xff69b4, 'blush');      // Pink blush
    }
    
    addLipstickSmudge(mirror) {
        // Create a canvas texture for the lipstick smudge
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        
        // Clear canvas
        context.fillStyle = 'rgba(255, 255, 255, 0.2)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw lipstick smudge
        context.fillStyle = 'rgba(255, 0, 0, 0.7)';
        context.beginPath();
        context.arc(256, 256, 50, 0, Math.PI * 2);
        context.fill();
        
        // Create texture and apply to mirror
        const smudgeTexture = new THREE.CanvasTexture(canvas);
        mirror.material.map = smudgeTexture;
        mirror.material.transparent = true;
        mirror.material.opacity = 0.9;
        mirror.material.needsUpdate = true;
    }
    
    createMakeupItem(x, y, z, color, type) {
        let geometry, material;

        switch(type) {
            case 'lipstick':
                // Cylindrical lipstick
                geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 16);
                material = new THREE.MeshStandardMaterial({ 
                    color: color,
                    roughness: 0.2,
                    metalness: 0.8,
                    emissive: color,
                    emissiveIntensity: 0.2
                });
                break;
            
            case 'compact':
                // Round compact
                geometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32);
                material = new THREE.MeshStandardMaterial({ 
                    color: color,
                    roughness: 0.1,
                    metalness: 0.9,
                    emissive: color,
                    emissiveIntensity: 0.2
                });
                break;
            
            case 'blush':
                // Square blush container
                geometry = new THREE.BoxGeometry(0.2, 0.05, 0.2);
                material = new THREE.MeshStandardMaterial({ 
                    color: color,
                    roughness: 0.3,
                    metalness: 0.5,
                    emissive: color,
                    emissiveIntensity: 0.2
                });
                break;
        }

        const item = new THREE.Mesh(geometry, material);
        
        // Rotate lipstick to lay on its side
        if (type === 'lipstick') {
            item.rotation.z = Math.PI / 2;
        }
        
        item.position.set(x, y, z);
        item.castShadow = true;
        item.receiveShadow = true;
        this.scene.add(item);
        
        // Add highlight effect
        const glow = new THREE.PointLight(color, 0.5, 0.5);
        glow.position.copy(item.position);
        this.scene.add(glow);
        
        // Store reference to interactive objects
        this.objects.set(item.uuid, {
            type: 'makeup',
            itemType: type,
            color: color,
            mesh: item,
            glow: glow
        });
    }
    
    resetRoom() {
        // Reset any room state here
        console.log('Room reset');
    }
    
    update() {
        // Animate makeup item glows
        this.objects.forEach(obj => {
            if (obj.glow) {
                obj.glow.intensity = 0.5 + Math.sin(Date.now() * 0.003) * 0.2;
            }
            
            // Animate floating text
            if (obj.floatingText) {
                obj.floatingText.position.y = obj.mesh.position.y + 0.4 + Math.sin(Date.now() * 0.002) * 0.05;
                obj.floatingText.material.opacity = 0.6 + Math.sin(Date.now() * 0.003) * 0.4;
            }
        });
        
        // Update sales assistant
        if (this.salesAssistant) {
            this.salesAssistant.update();
        }
    }
    
    checkLevelCompletion(playerPosition) {
        // Check if player has reached the door and the sales assistant is not blocking
        if (playerPosition.x > 4.5 && Math.abs(playerPosition.z) < 1) {
            if (this.salesAssistant && !this.salesAssistant.isBlocking) {
                // Check if player has fully entered the doorway
                if (playerPosition.x > 5.5) {
                    return true;
                }
            } else if (this.salesAssistant && this.salesAssistant.isBlocking) {
                // Show message that the assistant is blocking
                if (this.game) {
                    this.game.showMessage("The sales assistant is blocking the way. Find what she wants!");
                }
            }
        }
        return false;
    }
}
