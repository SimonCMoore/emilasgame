class Inventory {
    constructor(game) {
        this.game = game;
        this.items = [];
        this.maxItems = 10;
        this.isOpen = false;
        this.hasHandbag = false;
        
        this.setupControls();
        this.createUI();
    }
    
    setupControls() {
        document.addEventListener('keydown', (event) => {
            if (event.code === 'KeyB') {
                this.toggleBagView();
            }
        });
    }
    
    createUI() {
        // Create bag view container
        this.bagView = document.createElement('div');
        this.bagView.id = 'bag-view';
        this.bagView.style.display = 'none';
        this.bagView.innerHTML = `
            <div class="bag-content">
                <h2>Handbag Contents</h2>
                <div class="items-grid"></div>
                <button class="close-btn">Close</button>
            </div>
        `;
        document.body.appendChild(this.bagView);
        
        // Add close button listener
        this.bagView.querySelector('.close-btn').addEventListener('click', () => {
            this.toggleBagView();
        });
    }
    
    toggleBagView() {
        if (!this.hasHandbag) {
            this.game.showMessage("You need to find a handbag first!");
            return;
        }
        
        this.isOpen = !this.isOpen;
        this.bagView.style.display = this.isOpen ? 'flex' : 'none';
        
        if (this.isOpen) {
            document.exitPointerLock();
            this.updateBagView();
        }
    }
    
    updateBagView() {
        const itemsGrid = this.bagView.querySelector('.items-grid');
        itemsGrid.innerHTML = '';
        
        this.items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'bag-item';
            itemElement.style.backgroundColor = `rgba(${(item.color >> 16) & 255}, ${(item.color >> 8) & 255}, ${item.color & 255}, 0.3)`;
            itemElement.innerHTML = `
                <span>${item.name}</span>
                <button class="use-btn" data-index="${index}">Use</button>
            `;
            itemsGrid.appendChild(itemElement);
        });
        
        // Add use button listeners
        const useButtons = itemsGrid.querySelectorAll('.use-btn');
        useButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.useItem(index);
            });
        });
    }
    
    addItem(item) {
        if (!this.hasHandbag) {
            this.game.showMessage("You need to find a handbag first!");
            return false;
        }
        
        if (this.items.length >= this.maxItems) {
            this.game.showMessage("Your bag is full!");
            return false;
        }
        
        this.items.push(item);
        this.game.showMessage(`Added ${item.name} to your bag`);
        return true;
    }
    
    useItem(index) {
        const item = this.items[index];
        if (this.game.interactionManager.useItemWithNPC(item)) {
            this.items.splice(index, 1);
            this.updateBagView();
        }
    }
    
    pickupHandbag() {
        this.hasHandbag = true;
        this.game.showMessage("You picked up the handbag! Press B to view its contents.");
    }
}
