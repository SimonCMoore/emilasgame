# Escape Room Browser Game Specification

## Game Overview
A first-person browser-based puzzle/adventure game where players control a female protagonist trapped in a department store's makeup section after hours. She must solve puzzles using cosmetics, mirrors, displays, and store fixtures to escape each area.

## Core Game Mechanics
- First-person perspective using WebGL/Three.js
- Health system with death/restart mechanics
- Room-based progression system
- Interactive objects and inventory system

### Player Character
- Female protagonist trapped in the store
- Health system
  - Starts with full health in each level
  - Takes damage from wrong actions/hazards
  - Death results in level restart

### Setting & Theme
- Modern department store makeup section
- After-hours atmosphere with limited lighting
- Areas include:
  - Makeup counters and displays
  - Perfume section
  - Beauty supply aisles
  - Cosmetic storage areas
  - Staff areas

### First Room Design (Prototype)
- Makeup counter area with:
  - Makeup testing stations
  - Mirrors that may reveal clues
  - Product displays with potential puzzle items
  - Beauty consultant desk with locked drawers
  - Cash register area
- Puzzles involving:
  - Color matching with makeup samples
  - Mirror-based light reflection
  - Finding correct product combinations
  - Decoding beauty product ingredients

### Core Gameplay Loop
1. Player explores makeup counter area
2. Discovers interactive cosmetics and store fixtures
3. Solves puzzles while avoiding hazards
4. Finds exit to progress to next section
5. If health depletes, restart current room

## Technical Specifications
### Platform
- Web browser-based
- Local development initially
- WebGL/Three.js implementation

### Core Technologies (Initial Plan)
- HTML5
- CSS3
- JavaScript
- Three.js for 3D rendering
- Local storage for save states

### Minimum Browser Requirements
- Modern web browsers (Chrome, Firefox, Safari, Edge)
- WebGL support
- JavaScript enabled

## Development Phases
### Phase 1 - Core Mechanics
- First-person camera setup
- Basic 3D room rendering
- Player movement and look controls
- Health system
- Simple object interactions

### Phase 2 - Puzzle System
- Interactive cosmetic items
- Basic inventory system
- Mirror mechanics
- Product combination system

### Phase 3 - Content
- Complete first room design
- Basic lighting system
- Sound effects
- Save system

## Future Considerations
- Additional rooms in different store sections
- More complex puzzles using store items
- Background music
- Achievement system
- Story elements about why she's trapped
- Visual effects and animations

Note: This specification will evolve as we develop the game further.
