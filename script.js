// This file can be used to add custom behaviors to your AR experience

document.addEventListener('DOMContentLoaded', function() {
    // You can add event listeners or other functionality here
    console.log('AR.js application loaded');
    
    // Example: Detect marker found/lost events
    const marker = document.querySelector('a-marker');
    
    marker.addEventListener('markerFound', function() {
        console.log('Marker found!');
        // You could show UI elements, play sounds, etc.
    });
    
    marker.addEventListener('markerLost', function() {
        console.log('Marker lost!');
    });
}); 