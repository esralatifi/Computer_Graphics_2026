import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(8, 7, 12);
camera.lookAt(0, 0, 0);

 const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

 const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ color: 0xcccccc })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

 const geometries = [
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.ConeGeometry(1, 2, 32),
    new THREE.CylinderGeometry(0.8, 0.8, 2, 32),
    new THREE.TorusGeometry(0.9, 0.35, 16, 48),
];

 const positions = [
    [-6, 1, -4], [-2, 1, -4], [2, 1, -4], [6, 1, -4], [-4, 1, 0],
    [0, 1, 0], [4, 1, 0], [-6, 1, 4], [-2, 1, 4], [3, 1, 4],
];

 const pickableObjects = [];

for (let i = 0; i < positions.length; i++) {
    const geometry = geometries[i % geometries.length];
    const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({ color: 0x3399ff })
    );
    mesh.position.set(positions[i][0], positions[i][1], positions[i][2]);
    scene.add(mesh);

     if (i % 2 === 0) {
        pickableObjects.push(mesh);
    } else {
         mesh.material.color.set(0x999999);
    }
}

 const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('scene').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

 const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selected = null;

renderer.domElement.addEventListener('click', function (event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

     const intersects = raycaster.intersectObjects(pickableObjects);

     if (selected) {
        selected.material.emissive.set(0x000000);
        selected = null;
    }

    if (intersects.length > 0) {
        selected = intersects[0].object;
        selected.material.emissive.set(0xffaa00);
    }
});

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
