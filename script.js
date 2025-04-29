// This file can be used to add custom behaviors to your AR experience

window.addEventListener('DOMContentLoaded', () => {
    const scene = document.querySelector('a-scene');
    const marker = document.querySelector('#hiro-marker');
    const persistentObjects = document.querySelector('#persistent-objects');
    
    let markerFound = false;
    let worldPosition = new THREE.Vector3();
    let worldRotation = new THREE.Quaternion();
    
    // Create boxes but don't add them to the scene yet
    const redBox = document.createElement('a-box');
    redBox.setAttribute('material', 'color: red');
    redBox.setAttribute('position', '0 0.5 0');
    redBox.setAttribute('scale', '1 1 1');
    
    const blueBox = document.createElement('a-box');
    blueBox.setAttribute('material', 'color: blue');
    blueBox.setAttribute('position', '1 0.5 0');
    blueBox.setAttribute('scale', '1 1 1');
    
    const greenBox = document.createElement('a-box');
    greenBox.setAttribute('material', 'color: green');
    greenBox.setAttribute('position', '-1 0.5 0');
    greenBox.setAttribute('scale', '1 1 1');
    
    // Initially add boxes to the marker
    marker.appendChild(redBox.cloneNode(true));
    marker.appendChild(blueBox.cloneNode(true));
    marker.appendChild(greenBox.cloneNode(true));
    
    marker.addEventListener('markerFound', () => {
        console.log('Marker found!');
        
        // Only do this the first time the marker is found
        if (!markerFound) {
            markerFound = true;
            
            // Get the world position and rotation of the marker
            const markerObject3D = marker.object3D;
            markerObject3D.getWorldPosition(worldPosition);
            markerObject3D.getWorldQuaternion(worldRotation);
            
            // Create a container for our persistent objects
            const container = document.createElement('a-entity');
            container.setAttribute('position', worldPosition);
            container.setAttribute('rotation', markerObject3D.rotation);
            
            // Add persistent boxes to the container
            container.appendChild(redBox);
            container.appendChild(blueBox);
            container.appendChild(greenBox);
            
            // Add the container to our persistent objects entity
            persistentObjects.appendChild(container);
            
            // Hide the marker boxes by removing them
            while (marker.firstChild) {
                marker.removeChild(marker.firstChild);
            }
        }
    });
    
    marker.addEventListener('markerLost', () => {
        console.log('Marker lost!');
        // Boxes will remain in the scene thanks to being added to persistentObjects
    });
}); 