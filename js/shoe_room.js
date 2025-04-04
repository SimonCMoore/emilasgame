class ShoeRoom {
    constructor(scene, loadingManager) {
        this.scene = scene;
        this.objects = new Map();
        this.textures = {};
        this.loadingManager = loadingManager || new THREE.LoadingManager();
        this.game = null;
        this.objectives = {
            findGoldenShoe: false,
            findSizeCard: false,
            unlockDisplay: false,
            collectSpecialShoe: false
        };
        this.combinationCode = [3, 7, 9]; // The combination for the locked display
        this.userCombination = [0, 0, 0]; // User's current input
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
        
        // Add special interactive elements
        this.createSpecialElements();
        
        // Add shoe department sales assistant
        this.createSalesAssistant();
        
        // Add lighting
        this.setupLighting();
        
        // Add objective hints
        this.createObjectiveHints();
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
    
    createSpecialElements() {
        // Create a golden shoe as a special item to find
        this.createGoldenShoe();
        
        // Create a locked display case with a special shoe
        this.createLockedDisplay();
        
        // Create a size card with a clue
        this.createSizeCard();
    }
    
    createGoldenShoe() {
        // Create a golden shoe hidden on a high shelf
        const shoeGroup = new THREE.Group();
        
        // Shoe sole
        const soleGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.15);
        const soleMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            roughness: 0.3,
            metalness: 0.8
        });
        const sole = new THREE.Mesh(soleGeometry, soleMaterial);
        shoeGroup.add(sole);
        
        // Shoe upper
        const upperGeometry = new THREE.BoxGeometry(0.28, 0.15, 0.12);
        const upperMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            roughness: 0.2,
            metalness: 0.9
        });
        const upper = new THREE.Mesh(upperGeometry, upperMaterial);
        upper.position.y = 0.09;
        upper.position.z = -0.01;
        shoeGroup.add(upper);
        
        // Position the golden shoe in a hard-to-spot location
        shoeGroup.position.set(-4.7, 3.5, -2.5);
        shoeGroup.rotation.y = Math.PI / 4;
        shoeGroup.rotation.z = Math.PI / 12;
        
        shoeGroup.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        this.scene.add(shoeGroup);
        
        // Add subtle glow effect
        const glowGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.15
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(shoeGroup.position);
        this.scene.add(glow);
        
        // Store in objects map for interaction
        this.objects.set(shoeGroup.uuid, {
            mesh: shoeGroup,
            type: 'goldenShoe',
            glow: glow
        });
    }
    
    createSizeCard() {
        // Create a size card with the combination clue
        const cardGeometry = new THREE.PlaneGeometry(0.3, 0.2);
        const cardMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.2
        });
        const card = new THREE.Mesh(cardGeometry, cardMaterial);
        
        // Position the card partially hidden under a display
        card.position.set(2.8, 0.01, -1.5);
        card.rotation.x = -Math.PI / 2;
        card.rotation.z = Math.PI / 6;
        card.receiveShadow = true;
        
        this.scene.add(card);
        
        // Store in objects map for interaction
        this.objects.set(card.uuid, {
            mesh: card,
            type: 'sizeCard'
        });
    }
    
    createLockedDisplay() {
        // Create a special locked display case
        const caseGeometry = new THREE.BoxGeometry(1.2, 1.5, 0.8);
        const caseMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.1,
            metalness: 0.7,
            transparent: true,
            opacity: 0.7
        });
        const displayCase = new THREE.Mesh(caseGeometry, caseMaterial);
        displayCase.position.set(0, 0.75, -4);
        displayCase.castShadow = true;
        displayCase.receiveShadow = true;
        this.scene.add(displayCase);
        
        // Create base for the display case
        const baseGeometry = new THREE.BoxGeometry(1.4, 0.1, 1);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.3,
            metalness: 0.5
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(0, 0.05, -4);
        base.receiveShadow = true;
        this.scene.add(base);
        
        // Create the special shoe inside
        const specialShoe = this.createSpecialShoe();
        specialShoe.position.set(0, 0.7, -4);
        specialShoe.rotation.y = Math.PI;
        specialShoe.visible = false; // Hidden until unlocked
        this.scene.add(specialShoe);
        
        // Create combination lock
        this.createCombinationLock();
        
        // Store in objects map for interaction
        this.objects.set(displayCase.uuid, {
            mesh: displayCase,
            type: 'lockedDisplay',
            specialShoe: specialShoe,
            isLocked: true
        });
    }
    
    createSpecialShoe() {
        // Create a special crystal shoe (like Cinderella's glass slipper)
        const shoeGroup = new THREE.Group();
        
        // Shoe sole
        const soleGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.15);
        const soleMaterial = new THREE.MeshStandardMaterial({
            color: 0xadd8e6,
            roughness: 0.1,
            metalness: 0.9,
            transparent: true,
            opacity: 0.7
        });
        const sole = new THREE.Mesh(soleGeometry, soleMaterial);
        shoeGroup.add(sole);
        
        // Shoe upper
        const upperGeometry = new THREE.BoxGeometry(0.28, 0.15, 0.12);
        const upperMaterial = new THREE.MeshStandardMaterial({
            color: 0xadd8e6,
            roughness: 0.1,
            metalness: 0.9,
            transparent: true,
            opacity: 0.7
        });
        const upper = new THREE.Mesh(upperGeometry, upperMaterial);
        upper.position.y = 0.09;
        upper.position.z = -0.01;
        shoeGroup.add(upper);
        
        // Add heel
        const heelGeometry = new THREE.BoxGeometry(0.05, 0.15, 0.05);
        const heel = new THREE.Mesh(heelGeometry, upperMaterial);
        heel.position.set(0.12, 0.075, 0.05);
        shoeGroup.add(heel);
        
        shoeGroup.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        // Store in objects map for interaction
        this.objects.set(shoeGroup.uuid, {
            mesh: shoeGroup,
            type: 'specialShoe'
        });
        
        return shoeGroup;
    }
    
    createCombinationLock() {
        // Create a combination lock for the display case
        const lockGroup = new THREE.Group();
        
        // Lock base
        const baseGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.1);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
            roughness: 0.5,
            metalness: 0.7
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        lockGroup.add(base);
        
        // Create dials
        const dialPositions = [-0.15, 0, 0.15];
        const dialGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.05, 16);
        const dialMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.3,
            metalness: 0.8
        });
        
        dialPositions.forEach((x, index) => {
            const dial = new THREE.Mesh(dialGeometry, dialMaterial);
            dial.rotation.x = Math.PI / 2;
            dial.position.set(x, 0.05, 0.05);
            lockGroup.add(dial);
            
            // Store dial reference
            this.objects.set(dial.uuid, {
                mesh: dial,
                type: 'lockDial',
                dialIndex: index,
                currentValue: 0
            });
        });
        
        // Position the lock on the display case
        lockGroup.position.set(0, 0.3, -3.55);
        this.scene.add(lockGroup);
    }
    
    createSalesAssistant() {
        // Create a simple NPC for the shoe department
        const npcGroup = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.2, 1.5, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c3e50,
            roughness: 0.8
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.75;
        npcGroup.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xe8beac,
            roughness: 0.5
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.65;
        npcGroup.add(head);
        
        // Position the NPC
        npcGroup.position.set(3, 0, -3);
        npcGroup.rotation.y = -Math.PI / 4;
        this.scene.add(npcGroup);
        
        // Create dialogue for the NPC
        this.salesAssistant = {
            body: body,
            dialogues: {
                initial: "Welcome to our shoe department! I see you made it past my colleague. Looking for anything special?",
                afterGoldenShoe: "That golden shoe is just a display model. But if you find the crystal slipper, that would be something special!",
                afterSizeCard: "Those numbers might be useful. We have a special display case with a combination lock.",
                afterUnlock: "You found our special crystal slipper! That's the key to exit this department.",
                complete: "Congratulations! You've completed the shoe department challenge. You may proceed to the next area."
            },
            startDialogue: function() {
                // This will be implemented in the interaction manager
                if (this.game) {
                    let message = this.dialogues.initial;
                    
                    if (this.objectives.collectSpecialShoe) {
                        message = this.dialogues.complete;
                    } else if (this.objectives.unlockDisplay) {
                        message = this.dialogues.afterUnlock;
                    } else if (this.objectives.findSizeCard) {
                        message = this.dialogues.afterSizeCard;
                    } else if (this.objectives.findGoldenShoe) {
                        message = this.dialogues.afterGoldenShoe;
                    }
                    
                    this.game.showMessage(message, 5000);
                }
            }.bind(this)
        };
    }
    
    createObjectiveHints() {
        // Create floating text hints for objectives
        this.createFloatingText("Find the golden shoe", -4, 1.5, -2.5);
        this.createFloatingText("Look for clues on the floor", 2.5, 0.5, -1.5);
        this.createFloatingText("Unlock the special display", 0, 1.5, -3.5);
    }
    
    createFloatingText(text, x, y, z) {
        // Create a canvas for the text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        // Draw text on canvas
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = '24px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(text, canvas.width / 2, canvas.height / 2 + 8);
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        
        // Create a sprite with the texture
        const material = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true,
            opacity: 0.8
        });
        const sprite = new THREE.Sprite(material);
        sprite.position.set(x, y, z);
        sprite.scale.set(2, 0.5, 1);
        
        this.scene.add(sprite);
    }
    
    handleInteraction(objectData) {
        switch (objectData.type) {
            case 'goldenShoe':
                this.handleGoldenShoeInteraction(objectData);
                break;
            case 'sizeCard':
                this.handleSizeCardInteraction(objectData);
                break;
            case 'lockedDisplay':
                this.handleLockedDisplayInteraction(objectData);
                break;
            case 'lockDial':
                this.handleLockDialInteraction(objectData);
                break;
            case 'specialShoe':
                this.handleSpecialShoeInteraction(objectData);
                break;
        }
    }
    
    handleGoldenShoeInteraction(objectData) {
        if (!this.objectives.findGoldenShoe) {
            this.objectives.findGoldenShoe = true;
            this.game.showMessage("You found the golden shoe! It seems to be just a display model.", 3000);
            
            // Remove the glow effect
            if (objectData.glow) {
                this.scene.remove(objectData.glow);
            }
        } else {
            this.game.showMessage("A beautiful golden shoe, but it's just for display.", 2000);
        }
    }
    
    handleSizeCardInteraction(objectData) {
        if (!this.objectives.findSizeCard) {
            this.objectives.findSizeCard = true;
            this.game.showMessage("You found a size card with numbers: 3-7-9. This might be useful.", 4000);
        } else {
            this.game.showMessage("The size card shows: 3-7-9", 2000);
        }
    }
    
    handleLockedDisplayInteraction(objectData) {
        if (objectData.isLocked) {
            this.game.showMessage("This display case is locked. It needs a 3-digit combination.", 3000);
        } else {
            this.game.showMessage("The display case is unlocked. You can take the crystal slipper.", 3000);
        }
    }
    
    handleLockDialInteraction(objectData) {
        // Rotate the dial and update the combination
        objectData.currentValue = (objectData.currentValue + 1) % 10;
        objectData.mesh.rotation.z = objectData.currentValue * (Math.PI / 5);
        
        this.userCombination[objectData.dialIndex] = objectData.currentValue;
        this.game.showMessage(`Dial ${objectData.dialIndex + 1} set to ${objectData.currentValue}`, 1000);
        
        // Check if the combination is correct
        this.checkCombination();
    }
    
    handleSpecialShoeInteraction(objectData) {
        if (this.objectives.unlockDisplay && !this.objectives.collectSpecialShoe) {
            this.objectives.collectSpecialShoe = true;
            this.game.showMessage("You collected the crystal slipper! This will help you exit the department.", 4000);
            
            // Add to inventory
            this.game.inventory.addItem({
                id: objectData.mesh.uuid,
                name: "Crystal Slipper",
                color: 0xadd8e6,
                itemType: "specialShoe"
            });
            
            // Remove from scene
            this.scene.remove(objectData.mesh);
        }
    }
    
    checkCombination() {
        // Check if user input matches the correct combination
        const isCorrect = this.userCombination.every((val, index) => val === this.combinationCode[index]);
        
        if (isCorrect && !this.objectives.unlockDisplay) {
            this.objectives.unlockDisplay = true;
            this.game.showMessage("You hear a click! The display case is unlocked.", 3000);
            
            // Find the locked display and update it
            this.objects.forEach(obj => {
                if (obj.type === 'lockedDisplay') {
                    obj.isLocked = false;
                    obj.specialShoe.visible = true;
                }
            });
        }
    }
    
    checkLevelCompletion(playerPosition) {
        // Check if player has completed all objectives and is near the exit
        if (this.objectives.collectSpecialShoe && 
            playerPosition.z < -4.5 && 
            Math.abs(playerPosition.x) < 1.5) {
            return true;
        }
        return false;
    }
    
    update() {
        // Add any animation or update logic here
    }
}
