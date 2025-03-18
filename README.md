# Escape the Beauty Store

A first-person escape room game built with Three.js where you must solve puzzles to progress through different departments of a beauty store.

![Game Screenshot](https://via.placeholder.com/800x400?text=Escape+the+Beauty+Store)

## 🎮 Game Overview

You find yourself in a beauty store and need to navigate through different departments. Collect items, solve puzzles, and interact with sales assistants to progress through the store.

### Features

- First-person exploration across multiple departments
- Item collection and inventory system
- NPC interaction with dialogue choices
- Puzzle solving
- Real-time 3D graphics with Three.js
- Dynamic lighting and shadows
- Interactive objects with visual cues
- Stats tracking

## 🕹️ How to Play

### Controls

- **WASD**: Move around
- **Mouse**: Look around
- **Left Click**: Interact with objects
- **I key**: Interact with nearest object (easier pickup)
- **B key**: Open/close handbag inventory
- **E key**: Examine objects closely

### Objective

#### Makeup Department
1. Find and collect the handbag (look for the pink bag with floating text)
2. Collect makeup items from the counter
3. Look for clues in the mirror
4. Talk to the sales assistant
5. Give her the red lipstick to pass
6. Exit through the door to the shoe department

#### Shoe Department
1. Explore the shoe displays
2. (More objectives coming soon)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SimonCMoore/emilia.git
cd emilia
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## 🧩 Game Elements

### Departments

#### Makeup Department
- Makeup counter with mirror
- Handbag and cosmetic items
- Sales assistant blocking the exit
- Decorative elements (posters, plants)

#### Shoe Department
- Multiple shoe displays and shelves
- Various shoe styles and colors
- Two doorways (entrance and exit)

### Items

- **Handbag**: Required to collect other items (pink with gold accents)
- **Red Lipstick**: Key item needed to complete the makeup department
- **Gold Compact**: Collectible item
- **Pink Blush**: Collectible item

### NPCs

- **Makeup Sales Assistant**: Guards the exit door and requires red lipstick

## 🛠️ Technical Details

### Built With

- [Three.js](https://threejs.org/) - 3D graphics library
- [live-server](https://www.npmjs.com/package/live-server) - Development server with live reload

### Project Structure

```
/emilia
  /js                  # JavaScript files
    game.js            # Main game logic
    player.js          # Player controls and camera
    room.js            # Makeup department
    shoe_room.js       # Shoe department
    inventory.js       # Inventory system
    interactions.js    # Object interactions
    npc.js             # NPC behavior and dialogue
  /css                 # Stylesheets
    style.css          # UI styles
  /textures            # Texture assets
  index.html           # Main HTML file
  package.json         # Project dependencies
```

## 🔄 Recent Updates

- Added 'I' key for easier object interaction
- Enhanced dialogue system with close button and better visibility
- Added shoe department as a second room
- Improved NPC model with animated features
- Added floating text prompts for better guidance
- Enhanced room transition system
- Added stats tracking (health, items, time)
- Improved decorative elements and lighting

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Three.js community for examples and documentation
- Texture resources from [Three.js examples](https://threejs.org/examples/)
- Inspiration from escape room games
