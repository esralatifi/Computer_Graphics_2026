import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.y = 2;
camera.position.z = 6;

//trupi i shtepis (ose cilinderi)
const cylinderGeometry = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc99 });
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
scene.add(cylinder);

// kulmi (kon)
const coneGeometry = new THREE.ConeGeometry(2, 1.5, 32);
const coneMaterial = new THREE.MeshStandardMaterial({ color: 0xaa0000 });
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.y = 1.75;
scene.add(cone);

const light = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 3, 100);
pointLight.position.set(3, 3, 4);
scene.add(pointLight);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById('scene').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();