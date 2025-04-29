// This file can be used to add custom behaviors to your AR experience

window.addEventListener('DOMContentLoaded', () => {
    const scene = document.querySelector('a-scene');
    const marker = document.querySelector('#hiro-marker');
    const worldObjects = document.querySelector('#world-objects');
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
            setTimeout(() => {
                const markerPosition = new THREE.Vector3();
                const markerRotation = new THREE.Euler();
                const markerScale = new THREE.Vector3();
                
                // Get marker's transformation matrix
                marker.object3D.updateMatrixWorld(true);
                marker.object3D.matrixWorld.decompose(markerPosition, 
                    new THREE.Quaternion(), markerScale);
                
                // Create fixed boxes in world space
                const colors = ['red', 'blue', 'green'];
                const positions = [
                    new THREE.Vector3(0, 0.5, 0),
                    new THREE.Vector3(1, 0.5, 0),
                    new THREE.Vector3(-1, 0.5, 0)
                ];
                
                // Create each box in world space coordinates
                for (let i = 0; i < 3; i++) {
                    const worldPosition = new THREE.Vector3();
                    // Apply marker's transformation to box's local position
                    worldPosition.copy(positions[i]).applyMatrix4(marker.object3D.matrixWorld);
                    
                    // Create a world-fixed box
                    const box = document.createElement('a-box');
                    box.setAttribute('material', `color: ${colors[i]}`);
                    box.setAttribute('position', worldPosition.x + ' ' + worldPosition.y + ' ' + worldPosition.z);
                    box.setAttribute('scale', '1 1 1');
                    box.setAttribute('class', 'fixed-box');
                    
                    // Add to world objects
                    worldObjects.appendChild(box);
                }
                
                // Hide marker boxes
                const markerBoxes = document.querySelectorAll('.marker-box');
                markerBoxes.forEach(box => {
                    box.setAttribute('visible', 'false');
                });
                
                fixedBoxes = true;
                console.log('Boxes fixed in world space');
            }, 300); // Small delay to ensure marker is stable
        }
    });
    
    marker.addEventListener('markerLost', () => {
        console.log('Marker lost!');
        // Boxes will remain fixed in world space
    });
}); 