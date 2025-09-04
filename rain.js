// Matter.js rain simulation
const { Engine, Render, World, Bodies, Body, Events, Mouse, MouseConstraint } = Matter;

// Create engine
const engine = Engine.create();
const world = engine.world;

// Get canvas element
const canvas = document.getElementById('rain-canvas');

// Create renderer
const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent',
        showAngleIndicator: false,
        showVelocity: false,
        showDebug: false
    }
});

// Set gravity for realistic rain fall
engine.world.gravity.y = 0.6;
engine.world.gravity.x = 0;

// Arrays to store raindrops, bouncing drops, and circular obstacles
let raindrops = [];
let bouncingDrops = [];
let circles = [];

// Create ground and side boundaries (ground at bottom of screen)
const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 5, window.innerWidth, 10, {
    isStatic: true,
    render: { visible: false },
    collisionFilter: {
        category: 0x0001,
        mask: 0x0002 | 0x0004
    }
});

const leftWall = Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, {
    isStatic: true,
    render: { visible: false },
    collisionFilter: {
        category: 0x0001,
        mask: 0x0002 | 0x0004
    }
});

const rightWall = Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, {
    isStatic: true,
    render: { visible: false },
    collisionFilter: {
        category: 0x0001,
        mask: 0x0002 | 0x0004
    }
});

World.add(world, [ground, leftWall, rightWall]);

// Create circular obstacles that raindrops can bounce off
function createCircleObstacles() {
    // Small circle on the left
    const smallCircle = Bodies.circle(window.innerWidth * 0.15, window.innerHeight * 0.6, 40, {
        isStatic: true,
        render: {
            fillStyle: '#2a2d3a',
            strokeStyle: 'rgba(62, 65, 71, 0.8)',
            lineWidth: 2
        },
        collisionFilter: {
            category: 0x0001,
            mask: 0x0002 | 0x0004
        }
    });
    
    // Medium circle at bottom center
    const mediumCircle = Bodies.circle(window.innerWidth * 0.5, window.innerHeight * 0.75, 60, {
        isStatic: true,
        render: {
            fillStyle: '#2a2d3a',
            strokeStyle: 'rgba(62, 65, 71, 0.8)',
            lineWidth: 2
        },
        collisionFilter: {
            category: 0x0001,
            mask: 0x0002 | 0x0004
        }
    });
    
    // Large circle on the right
    const largeCircle = Bodies.circle(window.innerWidth * 0.85, window.innerHeight * 0.45, 80, {
        isStatic: true,
        render: {
            fillStyle: '#2a2d3a',
            strokeStyle: 'rgba(62, 65, 71, 0.8)',
            lineWidth: 2
        },
        collisionFilter: {
            category: 0x0001,
            mask: 0x0002 | 0x0004
        }
    });
    
    circles = [smallCircle, mediumCircle, largeCircle];
    World.add(world, circles);
}

function createGroundElements() {
    // Create the circular obstacles
    createCircleObstacles();
}

// Create textured raindrop (elongated like real rain)
function createRaindrop(x, y) {
    const width = 1.5 + Math.random() * 1;
    const height = 10 + Math.random() * 8;
    const raindrop = Bodies.rectangle(x, y, width, height, {
        render: {
            fillStyle: `rgba(255, 255, 255, ${0.6 + Math.random() * 0.4})`,
            strokeStyle: 'rgba(255, 255, 255, 0.8)',
            lineWidth: 0.5
        },
        frictionAir: 0.005,
        density: 0.0001,
        // Make raindrops not collide with each other
        collisionFilter: {
            group: -1, // Negative group means they don't collide with same group
            category: 0x0002,
            mask: 0x0001 // Only collide with ground elements
        },
        // Prevent stretching by fixing the shape
        inertia: Infinity
    });
    
    // Raindrops should fall straight down with slight variation
    Body.setVelocity(raindrop, {
        x: (Math.random() - 0.5) * 0.5,
        y: 3 + Math.random() * 2
    });
    
    return raindrop;
}

// Create a bouncing raindrop effect (small splash drops)
function createBouncingDrop(x, y) {
    const drop = Bodies.circle(x, y, 0.5 + Math.random() * 1, {
        render: {
            fillStyle: `rgba(255, 255, 255, ${0.7 + Math.random() * 0.3})`,
            strokeStyle: 'rgba(255, 255, 255, 0.9)',
            lineWidth: 0.5
        },
        frictionAir: 0.06,
        density: 0.0005,
        collisionFilter: {
            category: 0x0004,
            mask: 0x0001
        },
        // Add restitution for bouncing
        restitution: 0.4
    });
    
    // Give it an initial upward velocity with slight horizontal spread
    Body.setVelocity(drop, {
        x: (Math.random() - 0.5) * 3,
        y: -2 - Math.random() * 2.5
    });
    
    // Add creation time for cleanup
    drop.createdAt = Date.now();
    
    return drop;
}

// Spawn raindrops continuously
function spawnRain() {
    // Remove old raindrops that have fallen off screen or hit the bottom
    raindrops = raindrops.filter(drop => {
        // Remove if off screen or if it's at the very bottom (collision detection backup)
        if (drop.position.y > window.innerHeight + 50 || drop.position.y > window.innerHeight - 20) {
            // If near bottom, create bounce effect before removing
            if (drop.position.y > window.innerHeight - 30 && drop.position.y <= window.innerHeight - 20) {
                const x = drop.position.x;
                const y = drop.position.y;
                
                // Create bouncing drops
                const numBounces = 1 + Math.floor(Math.random() * 3);
                for (let i = 0; i < numBounces; i++) {
                    const bounceX = x + (Math.random() - 0.5) * 8;
                    const bounceY = y - 3;
                    const bouncingDrop = createBouncingDrop(bounceX, bounceY);
                    bouncingDrops.push(bouncingDrop);
                    World.add(world, bouncingDrop);
                }
            }
            
            World.remove(world, drop);
            return false;
        }
        return true;
    });
    
    // Clean up old bouncing drops
    const now = Date.now();
    bouncingDrops = bouncingDrops.filter(drop => {
        // Remove if fallen off screen, too old (1.5 seconds), or settled at bottom
        if (drop.position.y > window.innerHeight + 50 || 
            now - drop.createdAt > 1500 ||
            (drop.position.y > window.innerHeight - 25 && Math.abs(drop.velocity.y) < 1.0)) {
            World.remove(world, drop);
            return false;
        }
        return true;
    });
    
    // Add new raindrops
    for (let i = 0; i < 5 + Math.random() * 8; i++) {
        const x = Math.random() * window.innerWidth;
        const y = -20 - Math.random() * 100;
        const raindrop = createRaindrop(x, y);
        
        raindrops.push(raindrop);
        World.add(world, raindrop);
    }
}

// Handle window resize
function handleResize() {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    render.options.width = window.innerWidth;
    render.options.height = window.innerHeight;
    
    // Remove and recreate boundaries
    World.remove(world, [ground, leftWall, rightWall]);
    
    // Remove old circles if they exist
    if (circles && circles.length > 0) {
        World.remove(world, circles);
    }
    
    const newGround = Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 5, window.innerWidth, 10, {
        isStatic: true,
        render: { visible: false },
        collisionFilter: {
            category: 0x0001,
            mask: 0x0002 | 0x0004
        }
    });
    
    const newLeftWall = Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, {
        isStatic: true,
        render: { visible: false },
        collisionFilter: {
            category: 0x0001,
            mask: 0x0002 | 0x0004
        }
    });
    
    const newRightWall = Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, {
        isStatic: true,
        render: { visible: false },
        collisionFilter: {
            category: 0x0001,
            mask: 0x0002 | 0x0004
        }
    });
    
    World.add(world, [newGround, newLeftWall, newRightWall]);
    
    // Recreate circles
    createCircleObstacles();
}

// Add mouse interaction
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

World.add(world, mouseConstraint);

// Initialize
createGroundElements();

// Run the engine and renderer
Engine.run(engine);
Render.run(render);

// Spawn rain continuously  
setInterval(spawnRain, 80);

// Handle window resize
window.addEventListener('resize', handleResize);

// Handle raindrop collisions and create bouncing effects
Events.on(engine, 'collisionStart', (event) => {
    const pairs = event.pairs;
    
    pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        let raindrop = null;
        let hitSurface = null;
        
        // Check if one of the bodies is a raindrop
        if (raindrops.includes(bodyA)) {
            raindrop = bodyA;
            hitSurface = bodyB;
        } else if (raindrops.includes(bodyB)) {
            raindrop = bodyB;
            hitSurface = bodyA;
        }
        
        // If a raindrop hit any surface
        if (raindrop && hitSurface) {
            const x = raindrop.position.x;
            const y = raindrop.position.y;
            
            // Check if it hit a circle obstacle
            const hitCircle = circles.includes(hitSurface);
            
            if (hitCircle) {
                // Circle collision - bounce off at angle based on impact point
                const circleCenter = hitSurface.position;
                const impactAngle = Math.atan2(y - circleCenter.y, x - circleCenter.x);
                
                // Create splash effects
                const numBounces = 2 + Math.floor(Math.random() * 3);
                for (let i = 0; i < numBounces; i++) {
                    const spreadAngle = impactAngle + (Math.random() - 0.5) * Math.PI/3; // 60° spread
                    const distance = 10 + Math.random() * 15;
                    const bounceX = x + Math.cos(spreadAngle) * distance;
                    const bounceY = y + Math.sin(spreadAngle) * distance;
                    const bouncingDrop = createBouncingDrop(bounceX, bounceY);
                    
                    // Give bouncing drops velocity away from circle
                    Body.setVelocity(bouncingDrop, {
                        x: Math.cos(spreadAngle) * (2 + Math.random() * 3),
                        y: Math.sin(spreadAngle) * (1 + Math.random() * 2) - 1
                    });
                    
                    bouncingDrops.push(bouncingDrop);
                    World.add(world, bouncingDrop);
                }
                
                // Create a deflected raindrop that continues falling
                const deflectAngle = impactAngle + (Math.random() - 0.5) * Math.PI/4; // 45° deflection range
                const deflectDistance = 40 + Math.random() * 30;
                const newX = x + Math.cos(deflectAngle) * deflectDistance;
                const newY = y + Math.sin(deflectAngle) * 10;
                
                const deflectedRaindrop = createRaindrop(newX, newY);
                Body.setVelocity(deflectedRaindrop, {
                    x: Math.cos(deflectAngle) * (1 + Math.random() * 2),
                    y: 2 + Math.random() * 2
                });
                
                raindrops.push(deflectedRaindrop);
                World.add(world, deflectedRaindrop);
                
            } else {
                // Ground collision - create normal bounce behavior
                const numBounces = 1 + Math.floor(Math.random() * 3);
                for (let i = 0; i < numBounces; i++) {
                    const bounceX = x + (Math.random() - 0.5) * 8;
                    const bounceY = y - 3; // Start bounces slightly above impact
                    const bouncingDrop = createBouncingDrop(bounceX, bounceY);
                    bouncingDrops.push(bouncingDrop);
                    World.add(world, bouncingDrop);
                }
            }
            
            // Remove the original raindrop immediately
            World.remove(world, raindrop);
            const index = raindrops.indexOf(raindrop);
            if (index > -1) {
                raindrops.splice(index, 1);
            }
        }
    });
});

// Add some interactive effects when clicking
render.canvas.addEventListener('click', (event) => {
    const rect = render.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Create a burst of raindrops at click position
    for (let i = 0; i < 12; i++) {
        const offsetX = (Math.random() - 0.5) * 60;
        const offsetY = (Math.random() - 0.5) * 60;
        const drop = createRaindrop(x + offsetX, y + offsetY);
        
        Body.setVelocity(drop, {
            x: (Math.random() - 0.5) * 3,
            y: Math.random() * 3 + 4
        });
        
        raindrops.push(drop);
        World.add(world, drop);
    }
});
