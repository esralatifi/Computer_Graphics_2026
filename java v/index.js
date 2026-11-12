import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);


// 1) Perspective camera (objects shrink with distance).
const perspectiveCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// 2) Orthographic camera (no perspective, parallel projection).
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 10;
const orthographicCamera = new THREE.OrthographicCamera(
    -frustumSize * aspect / 2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    -frustumSize / 2,
    0.1,
    1000
);

perspectiveCamera.position.set(6, 5, 8);
orthographicCamera.position.set(6, 5, 8);
perspectiveCamera.lookAt(0, 0, 0);
orthographicCamera.lookAt(0, 0, 0);

let camera = perspectiveCamera;
 
const box = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0x3399ff })
);
box.position.set(-2.5, 1, 0);
scene.add(box);

 const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xff5533 })
);
sphere.position.set(2.5, 1.2, 0);
scene.add(sphere);

 const cone = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    new THREE.MeshStandardMaterial({ color: 0x33cc66 })
);
cone.position.set(0, 1, -2.5);
scene.add(cone);

 const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0xcccccc })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const grid = new THREE.GridHelper(20, 20);
scene.add(grid);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

 const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('scene').appendChild(renderer.domElement);

 let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

const info = document.getElementById('info');

 window.addEventListener('keydown', function (event) {
    if (event.key.toLowerCase() !== 'c') return;

    camera = (camera === perspectiveCamera) ? orthographicCamera : perspectiveCamera;

     controls.dispose();
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.update();

    const name = (camera === perspectiveCamera) ? 'Perspective' : 'Orthographic';
    info.innerHTML = 'Camera: ' + name + ' &nbsp;|&nbsp; press <b>C</b> to toggle';
});

 window.addEventListener('resize', function () {
    const aspect = window.innerWidth / window.innerHeight;

    perspectiveCamera.aspect = aspect;
    perspectiveCamera.updateProjectionMatrix();

    orthographicCamera.left = -frustumSize * aspect / 2;
    orthographicCamera.right = frustumSize * aspect / 2;
    orthographicCamera.top = frustumSize / 2;
    orthographicCamera.bottom = -frustumSize / 2;
    orthographicCamera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
