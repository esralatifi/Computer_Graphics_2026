import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);

const pointLight = new THREE.PointLight(0xffffff, 1);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(pointLight, ambientLight);

//Dielli
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, wireframe: true });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);

const earthOrbit = new THREE.Object3D();
//Toka
const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x000066, wireframe: true });
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthMesh.position.x = 2;
earthOrbit.add(earthMesh);

const moonGeometry = new THREE.SphereGeometry(0.1, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonMesh.position.x = 0.7;


earthOrbit.add(moonMesh);
earthMesh.add(moonMesh);

scene.add(earthOrbit);

//Marsi
const marsOrbit = new THREE.Object3D();
const marsGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const marsMaterial = new THREE.MeshStandardMaterial({ color: 0xff3300, wireframe: true });
const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
marsMesh.position.x = 3.5;
marsOrbit.add(marsMesh);

//Phobos
const phobosGeometry = new THREE.SphereGeometry(0.08, 32, 32);
const phobosMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const phobosMesh = new THREE.Mesh(phobosGeometry, phobosMaterial);
phobosMesh.position.x = 0.6;
marsMesh.add(phobosMesh);

scene.add(marsOrbit);

camera.position.z = 8;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById('scene').appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
      controls.update();
    sunMesh.rotation.y += 0.01;
    earthOrbit.rotation.y += 0.01;
    earthMesh.rotation.y += 0.02;
    marsOrbit.rotation.y += 0.005;
    marsMesh.rotation.y += 0.04;
    renderer.render(scene, camera);
}
animate();