import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as CANNON from 'cannon-es'
console.log(CANNON);

/**
 * Base
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 9
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


/**
 * Physics
 */
const world = new CANNON.World({
   gravity: new CANNON.Vec3(0, -9.82, 0)
});

// Dynamic sphere
const radius = 1;
const sphereBody = new CANNON.Body({
   mass: 5,
   shape: new CANNON.Sphere(radius),
});
sphereBody.position.set(0, 4, 0);
world.addBody(sphereBody);

// Ground
const groundBody = new CANNON.Body({
   type: CANNON.Body.STATIC,
   shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
groundBody.position.set(0, -2, 0)
world.addBody(groundBody);

// Obstacle
const obstacleSize = 1
const obstacleBody = new CANNON.Body({
   type: CANNON.Body.STATIC,
   shape: new CANNON.Box(new CANNON.Vec3(obstacleSize, obstacleSize, obstacleSize)),
});
obstacleBody.position.set(1.5, -1, -0.5)
world.addBody(obstacleBody);

// Box (dynamic)
const boxSize = 2;
const boxBody = new CANNON.Body({
   mass: 10,
   shape: new CANNON.Box(new CANNON.Vec3(boxSize, 0.5, boxSize)),
});
boxBody.position.set(-1.5, 5, 0)
world.addBody(boxBody);


/*** Three objects ***/
const sphereMesh = new THREE.Mesh(
   new THREE.SphereGeometry(radius),
   new THREE.MeshNormalMaterial()
);
sphereMesh.position.copy(sphereBody.position);
scene.add(sphereMesh);

const groundMesh = new THREE.Mesh(
   new THREE.PlaneGeometry(10, 10),
   new THREE.MeshBasicMaterial({ color: 0x333333 })
);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.position.y = -2;
scene.add(groundMesh);

const obstacleMesh = new THREE.Mesh(
   new THREE.BoxGeometry(obstacleSize * 2, obstacleSize * 2, obstacleSize * 2),
   new THREE.MeshBasicMaterial({ color: 0xdddddd })
);
obstacleMesh.position.copy(obstacleBody.position);
scene.add(obstacleMesh);

// Box mesh 
const boxMesh = new THREE.Mesh(
   new THREE.BoxGeometry(boxSize * 2, boxSize * 2, boxSize * 2),
   new THREE.MeshNormalMaterial()
);
boxMesh.position.copy(boxBody.position);
scene.add(boxMesh);

/*** Player ///////// */
const radiusTop = 0.5;
const radiusBottom = 0.5;
const height = 2;
const numSegments = 12;

const cylinderShape = new CANNON.Cylinder(radiusTop, radiusBottom, height, numSegments);
const playerBody = new CANNON.Body({ mass: 999, shape: cylinderShape });
playerBody.position.set(-4, -1, 0);
world.addBody(playerBody);

const playerMesh = new THREE.Mesh(
   new THREE.CylinderGeometry(radiusTop, radiusBottom, height, numSegments),
   new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
playerMesh.position.copy(playerBody.position);
scene.add(playerMesh);

/**
 * Player Controls
 */
const playerMovement = {
   speed: 0.1,
   forward: false,
   backward: false,
   left: false,
   right: false,
   jump: false,
};

/*** Keyboard listeners */
window.addEventListener('keydown', (event) => {
   switch (event.key) {
       case 'w': playerMovement.forward = true; break;
       case 's': playerMovement.backward = true; break;
       case 'a': playerMovement.left = true; break;
       case 'd': playerMovement.right = true; break;
       case ' ': playerMovement.jump = true; break;
   }
});

window.addEventListener('keyup', (event) => {
   switch (event.key) {
       case 'w': playerMovement.forward = false; break;
       case 's': playerMovement.backward = false; break;
       case 'a': playerMovement.left = false; break;
       case 'd': playerMovement.right = false; break;
       case ' ': playerMovement.jump = false; break;
   }
});

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    world.fixedStep();

    // Player movement
    if (playerMovement.forward) playerBody.position.z -= playerMovement.speed;
    if (playerMovement.backward) playerBody.position.z += playerMovement.speed;
    if (playerMovement.left) playerBody.position.x -= playerMovement.speed;
    if (playerMovement.right) playerBody.position.x += playerMovement.speed;
    if (playerMovement.jump) playerBody.position.y += playerMovement.speed;

    sphereMesh.position.copy(sphereBody.position)
    sphereMesh.quaternion.copy(sphereBody.quaternion)

    boxMesh.position.copy(boxBody.position)
    boxMesh.quaternion.copy(boxBody.quaternion)

    playerMesh.position.copy(playerBody.position)
    playerMesh.quaternion.copy(playerBody.quaternion)

    controls.update()
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
