# Raindrop Scene

An interactive rain scene built with Matter.js, inspired by the [Matter.js mixed demo](https://brm.io/matter-js/demo/#mixed).

## Features

- **Realistic Rain Physics**: White textured raindrops fall with natural physics
- **Dark Aesthetic Background**: Matches the demo's color scheme with gradient overlays
- **Draggable Circle Obstacles**: Click and drag circles anywhere on screen to change rain flow
- **Smart Collision Physics**: Different behaviors for ground vs circle impacts
- **Splash Effects**: Small bouncing droplets when rain hits surfaces
- **Deflection Effects**: Raindrops deflect and continue falling after hitting circles
- **Real-time Physics**: Watch rain patterns change as you move obstacles around
- **Mouse Interaction**: Click anywhere to create a burst of raindrops, drag circles to move them
- **Responsive Design**: Adapts to different screen sizes

## How to Run

### Method 1: Simple HTTP Server (Recommended)
```bash
npm start
```

### Method 2: Using Python
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m http.server 8000
```

### Method 3: Using Node.js http-server
```bash
npx http-server -p 8000
```

Then open your browser and navigate to `http://localhost:8000`

## Interaction

- **Click**: Create a burst of raindrops at the cursor position (empty areas only)
- **Drag Circles**: Click and drag any circle to move it around the screen
- **Real-time Physics**: Watch rain patterns change instantly as you reposition obstacles
- **Circle Physics**: Raindrops bounce off circular obstacles at realistic angles
- **Automatic**: Rain falls continuously and creates splash effects when hitting surfaces

## Technical Details

- Built with Matter.js physics engine
- Uses HTML5 Canvas for rendering
- Implements custom raindrop textures with opacity variations
- Features draggable circular obstacles with real-time physics updates
- Mouse constraint system for smooth drag-and-drop interactions
- Anti-gravity forces to keep circles floating at desired positions
- Dynamic splash effects with tiny bouncing droplets when rain hits surfaces
- Realistic deflection physics - raindrops bounce off circles and continue falling
- Smart collision detection that differentiates between ground and circle impacts
- Intelligent click handling to prevent conflicts between dragging and raindrop creation
- Responsive design with window resize handling

Enjoy watching the rain! 🌧️
