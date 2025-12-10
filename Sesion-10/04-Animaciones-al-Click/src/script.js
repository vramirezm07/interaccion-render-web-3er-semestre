import * as THREE from 'three';
import gsap from 'gsap';

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 8, 8),
    new THREE.MeshBasicMaterial({ color: '#ff6600', wireframe: true })
);

scene.add(object1);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//// Raycaster.
const raycaster = new THREE.Raycaster();
let currentIntersect = null;
const objectsToTest = [object1];

//Al dar click la figura gira 720°
window.addEventListener('click', () => {
    if (currentIntersect) {
        // Animación de rotación usando GSAP
        gsap.to(currentIntersect.object.rotation, {
            y: currentIntersect.object.rotation.y + Math.PI * 4, // 720 grados en radianes
            duration: 1,
            ease: "power2.inOut"
        });
    }
});

const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = - (event.clientY / sizes.height) * 2 + 1;
});

window.requestAnimationFrame(function animate() {
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(objectsToTest);

    if (intersects.length) {
        if (currentIntersect === null) {
            console.log('Mouse enter');
        }
        currentIntersect = intersects[0];
    } else {
        if (currentIntersect) {
            console.log('Mouse leave');
        }
        currentIntersect = null;
    }

    window.requestAnimationFrame(animate);
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * 2) * 0.1;

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();