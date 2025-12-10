
// CODIGO BIEN 

import * as THREE from 'three'
import gsap from 'gsap'
console.log(gsap);

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
console.log(object1);
object1.position.x = -0.75;
object1.name ='esfera';

const object2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    new THREE.MeshBasicMaterial({ color: 'rgba(30, 255, 0, 1)', wireframe: true })
);

scene.add(object2);
object2.position.x = 0.75;
object2.name = 'cubo';


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

//// Mouse.
const mouse = new THREE.Vector2()
window.addEventListener('mousemove', (event) => {
    // Coordenadas del mouse "normalizadas".
    mouse.x = event.clientX / sizes.width * 2 - 1;
    mouse.y = - (event.clientY / sizes.height) * 2 + 1;

    //console.log(mouse);
});

// Click.
window.addEventListener('click', () => {
    if (currentIntersect) {
        object1.material.color = new THREE.Color("#ffff00");
        console.log("Click sobre el mesh.");
    }
});


//// Raycaster.
const raycaster = new THREE.Raycaster();
let currentIntersect = null;
const objectsToTest = [object1, object2];


/**
 * Animate
 */
const clock = new THREE.Clock();
var mouseOnTop = false;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * 2) * 0.1;

    // Proyecta un rayo infinito hacia la posición del mouse desde la cámara.
    raycaster.setFromCamera(mouse, camera);

    // Devuelve la información obtenida de los objetos que son atravesados por el rayo.
    const intersects = raycaster.intersectObjects(objectsToTest)
    //console.log('intersects', intersects);

    // Configura la interacción para que al pasar el mouse la figura crazca.

    if (intersects[0] && intersects[0].object.name == 'esfera') {
        console.log('atravesando un objeto');
        if(mouseOnTop == false) {
            console.log("intersects:", intersects);

            mouseOnTop = true;
            console.log('el mouse atravesó el objeto por primera vez');
            object1.material.color = new THREE.Color("#0000ff");
            gsap.to(object1.scale, {
                x: 1.7,
                y: 1.7,
                z: 1.7,
                duration: 0.5,
                ease: "power2.out"
            });
        }
    } else if (intersects[0] && intersects[0].object.name == 'cubo') {
        console.log('atravesando un cubo');
        if(mouseOnTop == false) {
            console.log("intersects:", intersects);

            mouseOnTop = true;
            console.log('el mouse atravesó el objeto por primera vez');
            object2.material.color = new THREE.Color("#0000ff");
            gsap.to(object2.scale, {
                x: 1.7,
                y: 1.7,
                z: 1.7,
                duration: 0.5,
                ease: "power2.out"
            });
        }
    } else {
        if(mouseOnTop == true) {
            mouseOnTop = false;
            console.log('el mouse se salió, ya no está el hover');
            object2.material.color = new THREE.Color('rgba(30, 255, 0, 1)');
            gsap.to(object2.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.6,
                ease: "power2.out"
            });
            object1.material.color = new THREE.Color('#ff6600');
            gsap.to(object1.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.6,
                ease: "power2.out"
            });
        }
    }

    // Render
    renderer.render(scene, camera);



    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}


tick();