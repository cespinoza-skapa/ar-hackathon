// This file can be used to add custom behaviors to your AR experience

window.addEventListener('DOMContentLoaded', () => {
    const scene = document.querySelector('a-scene');
    const marker = document.querySelector('#hiro-marker');
    let fixedBoxes = false;
    
    // Remove loader when the scene is ready
    scene.addEventListener('loaded', () => {
        const loader = document.querySelector('.arjs-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    });
    
    // Handle marker detection
    marker.addEventListener('markerFound', () => {
        console.log('Marker found!');
        
        // Only fix boxes in world space once
        if (!fixedBoxes) {
            // Create boxes right on the marker first
            const colors = ['red', 'blue', 'green'];
            const positions = [
                { x: 0, y: 0.5, z: 0 },
                { x: 1, y: 0.5, z: 0 },
                { x: -1, y: 0.5, z: 0 }
            ];
            
            // Create each box as a child of the scene (not the marker)
            for (let i = 0; i < 3; i++) {
                createWorldAnchoredBox(colors[i], positions[i]);
            }
            
            // Hide the marker boxes
            const markerBoxes = document.querySelectorAll('.marker-box');
            markerBoxes.forEach(box => {
                box.setAttribute('visible', 'false');
            });
            
            fixedBoxes = true;
            console.log('Boxes created in world space');
        }
    });
    
    // Function to create a world-anchored box
    function createWorldAnchoredBox(color, localPosition) {
        // Create the box entity
        const box = document.createElement('a-box');
        box.setAttribute('class', 'world-box');
        box.setAttribute('material', `color: ${color}`);
        box.setAttribute('scale', '1 1 1');
        
        // Initially hide the box
        box.setAttribute('visible', 'false');
        
        // Add to scene
        scene.appendChild(box);
        
        // Set up a function to update the world position
        const updateWorldPosition = () => {
            if (!marker.object3D.visible) return;
            
            // Get marker's transformation matrix
            marker.object3D.updateMatrixWorld(true);
            
            // Create a local position vector
            const position = new THREE.Vector3(
                localPosition.x,
                localPosition.y,
                localPosition.z
            );
            
            // Transform the local position to world position
            const worldPosition = position.clone();
            worldPosition.applyMatrix4(marker.object3D.matrixWorld);
            
            // Set the box's world position
            box.setAttribute('position', {
                x: worldPosition.x,
                y: worldPosition.y,
                z: worldPosition.z
            });
            
            // Make the box visible
            box.setAttribute('visible', 'true');
        };
        
        // Update the box position when the marker is visible
        const tickFunction = () => {
            if (marker.object3D.visible) {
                updateWorldPosition();
            }
        };
        
        // Register the tick function to run on every frame
        box.setAttribute('tick', tickFunction);
        
        return box;
    }
    
    marker.addEventListener('markerLost', () => {
        console.log('Marker lost!');
        // Boxes should remain fixed in world space
    });
}); 