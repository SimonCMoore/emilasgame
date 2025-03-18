class NPC {
    constructor(scene, position, game) {
        this.scene = scene;
        this.game = game;
        this.position = position;
        this.isBlocking = true;
        this.dialogueState = 'initial';
        this.createModel();
        this.setupDialogue();
    }
    
    createModel() {
        // Create a more detailed humanoid figure
        const npcGroup = new THREE.Group();
        
        // Body - using a custom shape for better clothing appearance
        const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.2, 1.4, 8);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000, // Black uniform
            roughness: 0.3
        });
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.position.y = 0.7;
        npcGroup.add(this.body);
        
        // Add skirt
        const skirtGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.4, 8);
        const skirtMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0.4
        });
        const skirt = new THREE.Mesh(skirtGeometry, skirtMaterial);
        skirt.position.y = 0.2;
        npcGroup.add(skirt);
        
        // Head with better features
        const headGroup = new THREE.Group();
        
        // Base head
        const headGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const headMaterial = new THREE.MeshStandardMaterial({
            color: 0xffdbac, // Skin tone
            roughness: 0.3
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.5;
        headGroup.add(head);
        
        // Hair
        const hairGeometry = new THREE.SphereGeometry(0.21, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const hairMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c1810, // Dark brown
            roughness: 0.6
        });
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = 1.5;
        hair.rotation.x = -0.2;
        headGroup.add(hair);
        
        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.03, 16, 16);
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000
        });
        const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff
        });
        
        // Left eye
        const leftEyeWhite = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
        leftEyeWhite.scale.x = 1.5;
        leftEyeWhite.position.set(-0.08, 1.52, 0.15);
        headGroup.add(leftEyeWhite);
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.scale.set(0.6, 0.6, 0.6);
        leftEye.position.set(-0.08, 1.52, 0.17);
        headGroup.add(leftEye);
        
        // Right eye
        const rightEyeWhite = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
        rightEyeWhite.scale.x = 1.5;
        rightEyeWhite.position.set(0.08, 1.52, 0.15);
        headGroup.add(rightEyeWhite);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.scale.set(0.6, 0.6, 0.6);
        rightEye.position.set(0.08, 1.52, 0.17);
        headGroup.add(rightEye);
        
        // Mouth
        const mouthGeometry = new THREE.BoxGeometry(0.08, 0.02, 0.01);
        const mouthMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000 // Red lipstick
        });
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, 1.42, 0.18);
        headGroup.add(mouth);
        
        npcGroup.add(headGroup);
        
        // Add arms
        const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8);
        const armMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000
        });
        
        // Left arm
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.3, 1.1, 0);
        leftArm.rotation.z = 0.3;
        npcGroup.add(leftArm);
        
        // Right arm
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.3, 1.1, 0);
        rightArm.rotation.z = -0.3;
        npcGroup.add(rightArm);
        
        // Add name tag
        const nameTag = this.createNameTag("Sales Assistant");
        nameTag.position.set(0, 2, 0);
        npcGroup.add(nameTag);
        
        // Position the entire NPC
        npcGroup.position.copy(this.position);
        npcGroup.rotation.y = -Math.PI / 2; // Face the door
        
        this.body = npcGroup;
        this.scene.add(npcGroup);
        
        // Store references for animation
        this.head = headGroup;
        this.leftArm = leftArm;
        this.rightArm = rightArm;
    }
    
    createNameTag(name) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        // Draw background
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw text
        context.font = 'bold 32px Arial';
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(name, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(1, 0.25, 1);
        
        return sprite;
    }
    
    setupDialogue() {
        this.dialogueBox = document.createElement('div');
        this.dialogueBox.id = 'dialog-box';
        this.dialogueBox.innerHTML = `
            <button class="dialog-close">&times;</button>
            <div class="dialog-content"></div>
            <div class="dialog-options"></div>
        `;
        document.body.appendChild(this.dialogueBox);
        
        // Add close button functionality
        const closeButton = this.dialogueBox.querySelector('.dialog-close');
        closeButton.addEventListener('click', () => {
            this.closeDialogue();
        });
        
        this.dialogueOptions = {
            initial: {
                text: "Hello! I'm the sales assistant. Can I help you?",
                options: [
                    { text: "Do you like Sephora?", next: 'sephora' },
                    { text: "What is your favourite food?", next: 'food' },
                    { text: "What is your favourite colour?", next: 'color' }
                ]
            },
            sephora: {
                text: "Of course! I love working here. The makeup selection is amazing!",
                options: [{ text: "Thanks for sharing", next: 'close' }]
            },
            food: {
                text: "I love strawberry macarons, they remind me of my favorite lipstick shade!",
                options: [{ text: "Interesting...", next: 'close' }]
            },
            color: {
                text: "Red, like my favorite lipstick! I can't live without it.",
                options: [{ text: "Good to know", next: 'close' }]
            }
        };
    }
    
    startDialogue() {
        this.showDialogue('initial');
        document.exitPointerLock();
    }
    
    showDialogue(state) {
        const dialogue = this.dialogueOptions[state];
        if (!dialogue) return;
        
        const content = this.dialogueBox.querySelector('.dialog-content');
        const options = this.dialogueBox.querySelector('.dialog-options');
        
        content.textContent = dialogue.text;
        options.innerHTML = '';
        
        dialogue.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'dialog-option';
            button.textContent = option.text;
            button.addEventListener('click', () => {
                if (option.next === 'close') {
                    this.closeDialogue();
                } else {
                    this.showDialogue(option.next);
                }
            });
            options.appendChild(button);
        });
        
        this.dialogueBox.style.display = 'block';
    }
    
    closeDialogue() {
        this.dialogueBox.style.display = 'none';
        document.body.requestPointerLock();
    }
    
    receiveItem(item) {
        if (item.itemType === 'lipstick' && item.color === 0xff0000) {
            this.isBlocking = false;
            this.game.showMessage("Oh my favorite lipstick! Thank you! You can pass now.");
            // Move NPC aside with animation
            const moveAside = new THREE.Vector3(2, 0, 0);
            this.body.position.add(moveAside);
            return true;
        } else {
            this.game.showMessage("That's not what I want...");
            this.game.gameOver();
            return false;
        }
    }
    
    update() {
        // Add subtle idle animation
        if (this.head) {
            this.head.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
        }
        if (this.leftArm) {
            this.leftArm.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        }
        if (this.rightArm) {
            this.rightArm.rotation.x = Math.sin(Date.now() * 0.001) * -0.1;
        }
    }
}
