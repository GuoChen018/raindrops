# Raindrop Scene

An interactive rain scene built with Matter.js, inspired by the [Matter.js mixed demo](https://brm.io/matter-js/demo/#mixed).

## Features

- **Realistic Rain Physics**: White textured raindrops fall with natural physics
- **Dark Aesthetic Background**: Matches the demo's color scheme with gradient overlays
- **Interactive Circle Obstacles**: Rain bounces off circular objects at realistic angles
- **Smart Collision Physics**: Different behaviors for ground vs circle impacts
- **Splash Effects**: Small bouncing droplets when rain hits surfaces
- **Deflection Effects**: Raindrops deflect and continue falling after hitting circles
- **Mouse Interaction**: Click anywhere to create a burst of raindrops
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

- **Click**: Create a burst of raindrops at the cursor position
- **Circle Physics**: Watch raindrops bounce off circular obstacles at realistic angles
- **Automatic**: Rain falls continuously and creates splash effects when hitting surfaces

## Technical Details

- Built with Matter.js physics engine
- Uses HTML5 Canvas for rendering
- Implements custom raindrop textures with opacity variations
- Features circular obstacles with angle-based collision physics
- Dynamic splash effects with tiny bouncing droplets when rain hits surfaces
- Realistic deflection physics - raindrops bounce off circles and continue falling
- Smart collision detection that differentiates between ground and circle impacts
- Responsive design with window resize handling

Enjoy watching the rain! 🌧️
