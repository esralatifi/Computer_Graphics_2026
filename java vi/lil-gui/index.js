import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(4, 3, 6);
camera.lookAt(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0xcccccc })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const grid = new THREE.GridHelper(20, 20);
scene.add(grid);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x3399ff })
);
sphere.position.set(0, 1, 0);
scene.add(sphere);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('scene').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

const gui = new GUI();

const positionFolder = gui.addFolder('Position');
positionFolder.add(sphere.position, 'x', -5, 5, 0.1);
positionFolder.add(sphere.position, 'y', 0, 5, 0.1);
positionFolder.add(sphere.position, 'z', -5, 5, 0.1);

gui.add(sphere.material, 'wireframe');

gui.addColor(sphere.material, 'color');

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
