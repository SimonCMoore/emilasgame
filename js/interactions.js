class InteractionManager {
    constructor(game) {
        this.game = game;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.interactableObjects = [];
        this.interactionDistance = 2; // Maximum distance for interaction
        
        this.setupInteractions();
    }
    
    setupInteractions() {
        // Set up click interaction
        document.addEventListener('click', (event) => {
            // Only process clicks when pointer is locked (game is active)
            if (document.pointerLockElement === null) return;
            
            this.handleInteractionAtCrosshair();
        });
        
        // Set up key interactions
        document.addEventListener('keydown', (event) => {
            if (event.code === 'KeyE') {
                // E key for special interactions
                this.handleSpecialInteraction();
            } else if (event.code === 'KeyI') {
                // I key for general interaction with nearest object
                this.handleNearestInteraction();
            }
        });
    }
    
    handleInteractionAtCrosshair() {
        // Center of screen is the interaction point in first person
        this.mouse.x = 0;
        this.mouse.y = 0;
        
        this.raycaster.setFromCamera(this.mouse, this.game.camera);
        
        // Get all objects from the room
        const objects = Array.from(this.game.room.objects.values())
            .map(obj => obj.mesh);
        
        // Check for intersections
        const intersects = this.raycaster.intersectObjects(objects);
        
        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            const objectData = this.game.room.objects.get(intersectedObject.uuid);
            
            // Check if object is within interaction distance
            if (objectData && intersects[0].distance <= this.interactionDistance) {
                this.handleInteraction(objectData);
            } else if (intersects[0].distance > this.interactionDistance) {
                this.game.showMessage("Too far away to interact");
            }
        }
        
        // Check for NPC interaction
        if (this.game.room.salesAssistant) {
            const npcMesh = this.game.room.salesAssistant.body;
            const npcIntersects = this.raycaster.intersectObject(npcMesh, true);
            
            if (npcIntersects.length > 0 && npcIntersects[0].distance <= this.interactionDistance) {
                this.game.room.salesAssistant.startDialogue();
            }
        }
    }
    
    handleNearestInteraction() {
        // Find the nearest interactable object
        const playerPosition = this.game.camera.position.clone();
        let nearestObject = null;
        let nearestDistance = this.interactionDistance;
        
        // Check all objects
        this.game.room.objects.forEach((objectData, uuid) => {
            const objectPosition = objectData.mesh.position.clone();
            const distance = playerPosition.distanceTo(objectPosition);
            
            if (distance < nearestDistance) {
                nearestObject = objectData;
                nearestDistance = distance;
            }
        });
        
        // Check NPC
        if (this.game.room.salesAssistant) {
            const npcPosition = this.game.room.salesAssistant.body.position.clone();
            const distance = playerPosition.distanceTo(npcPosition);
            
            if (distance < nearestDistance) {
                this.game.room.salesAssistant.startDialogue();
                return;
            }
        }
        
        // Interact with nearest object if found
        if (nearestObject) {
            this.handleInteraction(nearestObject);
            this.game.showMessage(`Interacting with ${this.getObjectName(nearestObject)}`);
        } else {
            this.game.showMessage("Nothing to interact with nearby");
        }
    }
    
    getObjectName(objectData) {
        switch (objectData.type) {
            case 'handbag':
                return "handbag";
            case 'makeup':
                let colorName = '';
                switch (objectData.color) {
                    case 0xff0000: colorName = 'red'; break;
                    case 0xffd700: colorName = 'gold'; break;
                    case 0xff69b4: colorName = 'pink'; break;
                    default: colorName = ''; break;
                }
                return `${colorName} ${objectData.itemType}`;
            case 'mirror':
                return "mirror";
            default:
                return "object";
        }
    }
    
    handleInteraction(objectData) {
        switch (objectData.type) {
            case 'makeup':
                this.handleMakeupInteraction(objectData);
                break;
            case 'handbag':
                this.handleHandbagInteraction(objectData);
                break;
            case 'mirror':
                this.handleMirrorInteraction(objectData);
                break;
            default:
                console.log('Unknown interaction type');
        }
    }
    
    handleMakeupInteraction(objectData) {
        // Get color name for message
        let colorName = 'unknown';
        let itemName = '';
        
        switch (objectData.itemType) {
            case 'lipstick':
                itemName = 'lipstick';
                break;
            case 'compact':
                itemName = 'compact';
                break;
            case 'blush':
                itemName = 'blush';
                break;
        }
        
        switch (objectData.color) {
            case 0xff0000:
                colorName = 'red ' + itemName;
                break;
            case 0xffd700:
                colorName = 'gold ' + itemName;
                break;
            case 0xff69b4:
                colorName = 'pink ' + itemName;
                break;
        }
        
        // Try to add to inventory
        if (this.game.inventory.addItem({
            id: objectData.mesh.uuid,
            name: colorName,
            color: objectData.color,
            itemType: objectData.itemType
        })) {
            // Remove from scene if added to inventory
            this.game.scene.remove(objectData.mesh);
            if (objectData.glow) {
                this.game.scene.remove(objectData.glow);
            }
            this.game.room.objects.delete(objectData.mesh.uuid);
        }
    }
    
    handleHandbagInteraction(objectData) {
        // Pick up handbag
        this.game.inventory.pickupHandbag();
        
        // Remove from scene
        this.game.scene.remove(objectData.mesh);
        if (objectData.glow) {
            this.game.scene.remove(objectData.glow);
        }
        if (objectData.floatingText) {
            this.game.scene.remove(objectData.floatingText);
        }
        this.game.room.objects.delete(objectData.mesh.uuid);
    }
    
    handleMirrorInteraction(objectData) {
        this.game.showMessage("You notice a red lipstick smudge on the mirror...");
    }
    
    handleSpecialInteraction() {
        // Check if player is looking at the mirror
        this.raycaster.setFromCamera(this.mouse, this.game.camera);
        
        // Get all objects from the room
        const objects = Array.from(this.game.room.objects.values())
            .map(obj => obj.mesh);
        
        const intersects = this.raycaster.intersectObjects(objects);
        
        if (intersects.length > 0 && intersects[0].distance <= this.interactionDistance) {
            const intersectedObject = intersects[0].object;
            const objectData = this.game.room.objects.get(intersectedObject.uuid);
            
            if (objectData && objectData.type === 'mirror') {
                this.game.showMessage("The red lipstick smudge might be a clue...");
            }
        }
    }
    
    useItemWithNPC(item) {
        // Check if player is near the NPC
        const npcPosition = this.game.room.salesAssistant.body.position.clone();
        const playerPosition = this.game.camera.position.clone();
        
        const distance = npcPosition.distanceTo(playerPosition);
        
        if (distance <= this.interactionDistance * 1.5) {
            return this.game.room.salesAssistant.receiveItem(item);
        } else {
            this.game.showMessage("You need to be closer to the sales assistant");
            return false;
        }
    }
}
