# Escape the Beauty Store - Game Specification

## Overview
A first-person escape room game set in a beauty store with multiple departments. Players must solve puzzles and interact with objects to progress through the store.

## Game Mechanics

### Core Mechanics
- First-person movement (WASD)
- Mouse look
- Object interaction (Click or 'I' key)
- Inventory system (10 item limit)
- Dialogue system with NPCs
- Multi-room progression

### Controls
- WASD: Movement
- Mouse: Look around
- Left Click: Interact with objects
- I: Interact with nearest object
- B: View bag contents
- E: Examine objects closely

### Player Stats
- Health: 100%
- Inventory capacity: 10 items
- Time elapsed

## Environment

### Makeup Department
- Size: 10x10 units
- Cream colored walls
- Marble textured floor
- Door on right wall
- Makeup counter with mirror
- Decorative elements:
  - Makeup advertisements/posters
  - Plants in corners
  - Display shelves
  - Ambient lighting

### Shoe Department
- Size: 10x10 units
- Cream colored walls
- Marble textured floor
- Two doors (entrance and exit)
- Multiple shoe displays:
  - Central counters with shoes
  - Wall-mounted shelves
  - Various shoe styles and colors
- Decorative elements and lighting

## Interactive Objects

### Makeup Department

#### Handbag
- Location: On makeup counter
- Pink with gold accents
- Must be collected first to enable item pickup
- Floating interaction prompt ("Press I to pick up")
- Glowing effect for visibility
- Animated bobbing text

#### Makeup Items
- Red lipstick (key item)
- Gold compact
- Pink blush
- All items have glow effects
- Can be collected after obtaining handbag

#### Mirror
- Contains red lipstick smudge clue
- Reflective surface
- Gold frame
- Can be examined for hints

### Shoe Department

#### Shoe Displays
- Various colored shoes on counters and shelves
- Different styles (casual, formal, etc.)
- Decorative elements

### NPCs

#### Makeup Department Sales Assistant
- Location: By the door
- Detailed model with:
  - Animated features (head, arms)
  - Uniform with skirt
  - Facial features (eyes, mouth)
  - Hair and makeup
- Dialogue options:
  1. "Do you like Sephora?"
  2. "What is your favourite food?"
  3. "What is your favourite colour?"
- Blocks exit until given red lipstick
- Moves aside when given correct item

## UI Elements

### HUD
- Health bar
- Item count
- Time elapsed
- Message display
- Interaction prompts

### Inventory View
- Grid layout
- Item icons with colors
- Use/Drop options
- Visual feedback

### Dialog System
- Enhanced text display with larger font
- Pink border with glow effect
- Close button (×) in top-right corner
- Multiple choice options
- Visual feedback on hover

## Game Flow

### Makeup Department
1. Player spawns in makeup department
2. Must find and collect handbag
3. Collect makeup items
4. Notice red lipstick smudge in mirror
5. Talk to sales assistant
6. Give red lipstick to assistant
7. Exit through door to shoe department

### Shoe Department
1. Player enters from makeup department
2. Explore shoe displays
3. (Future gameplay to be implemented)

### Failure Conditions
- Giving wrong item to assistant
- Results in level restart

### Success Conditions
- Give red lipstick to assistant
- Successfully transition to shoe department

## Technical Features

### Graphics
- Three.js for 3D rendering
- Real-time shadows
- Dynamic lighting
- Animated elements
- Material effects (glow, reflection)

### Interaction System
- Raycasting for object selection
- Proximity-based interaction with 'I' key
- Visual feedback for interactable objects
- Dialogue system with multiple choices

### Room Transition
- Smooth transition between departments
- Loading messages
- Player position reset
- Welcome messages

### Performance
- Optimized models
- Efficient lighting
- Texture management
- Frame rate target: 60 FPS

## Development Notes

### Installation
```bash
npm install
npm run dev
```

### Dependencies
- Three.js
- Live-server for development
- Node.js for build tools

### File Structure
```
/emilia
  /js
    game.js          # Main game logic
    player.js        # Player controls and camera
    room.js          # Makeup department
    shoe_room.js     # Shoe department
    inventory.js     # Inventory system
    interactions.js  # Object interactions
    npc.js           # NPC behavior and dialogue
  /css
    style.css        # UI styles
  /textures          # Texture assets
  index.html         # Main HTML file
  package.json       # Project dependencies
  README.md          # Project documentation
  SPECIFICATION.md   # This specification
```

### Future Enhancements
- Additional departments (perfume, accessories)
- More complex puzzles
- Additional NPCs
- Sound effects and music
- More detailed models and textures
