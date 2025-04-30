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
                // Create a fixed anchor in world space at the marker's position
                const anchor = document.createElement('a-entity');
                anchor.setAttribute('id', 'fixed-anchor');
                
                // Get the marker's world position and rotation
                const markerEl = marker.object3D;
                markerEl.updateMatrixWorld(true);
                
                // Convert to world position
                const worldPosition = new THREE.Vector3();
                const worldQuaternion = new THREE.Quaternion();
                const worldScale = new THREE.Vector3();
                markerEl.matrixWorld.decompose(worldPosition, worldQuaternion, worldScale);
                
                // Convert quaternion to Euler angles for A-Frame
                const worldRotation = new THREE.Euler().setFromQuaternion(worldQuaternion);
                const rotationDegrees = {
                    x: THREE.MathUtils.radToDeg(worldRotation.x),
                    y: THREE.MathUtils.radToDeg(worldRotation.y),
                    z: THREE.MathUtils.radToDeg(worldRotation.z)
                };
                
                // Set anchor position and rotation to match the marker
                anchor.setAttribute('position', `${worldPosition.x} ${worldPosition.y} ${worldPosition.z}`);
                anchor.setAttribute('rotation', `${rotationDegrees.x} ${rotationDegrees.y} ${rotationDegrees.z}`);
                
                // Add fixed boxes directly to the anchor with local coordinates
                const colors = ['red', 'blue', 'green'];
                const positions = [
                    '0 0.5 0',    // red box at center
                    '1 0.5 0',    // blue box to the right
                    '-1 0.5 0'    // green box to the left
                ];
                
                for (let i = 0; i < 3; i++) {
                    const box = document.createElement('a-box');
                    box.setAttribute('material', `color: ${colors[i]}`);
                    box.setAttribute('position', positions[i]);
                    box.setAttribute('scale', '1 1 1');
                    box.setAttribute('class', 'fixed-box');
                    anchor.appendChild(box);
                }
                
                // Add the anchor to the scene
                scene.appendChild(anchor);
                
                // Hide marker boxes
                const markerBoxes = document.querySelectorAll('.marker-box');
                markerBoxes.forEach(box => {
                    box.setAttribute('visible', 'false');
                });
                
                fixedBoxes = true;
                console.log('Boxes fixed in world space');
            }, 500); // Increased delay to ensure marker is stable
        }
    });
    
    marker.addEventListener('markerLost', () => {
        console.log('Marker lost!');
        // Boxes will remain fixed in world space
    });
}); 