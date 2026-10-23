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

camera.position.set(8, 6, 12);
camera.lookAt(0, 3, 0);


const armMaterial = new THREE.MeshStandardMaterial({color: 0x3399ff});
const jointMaterial = new THREE.MeshStandardMaterial({color: 0x555555});
const handMaterial = new THREE.MeshStandardMaterial({color: 0xffaa55});
const fingerMaterial = new THREE.MeshStandardMaterial({color: 0xffcc88});


const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
const base = new THREE.Mesh(baseGeometry, jointMaterial);

scene.add(base);


const shoulder = new THREE.Group();
shoulder.position.y = 0.5;
base.add(shoulder);


const shoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), jointMaterial);

shoulder.add(shoulderJoint);


const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3, 0.7), armMaterial);

upperArm.position.y = 1.5;

shoulder.add(upperArm);

const elbow = new THREE.Group();
elbow.position.y = 3;
shoulder.add(elbow);

const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 32), jointMaterial);

elbow.add(elbowJoint);

const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.5, 0.6), armMaterial);

forearm.position.y = 1.25;

elbow.add(forearm);


const wrist = new THREE.Group();
wrist.position.y = 2.5;
elbow.add(wrist);


const wristJoint = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), jointMaterial);

wrist.add(wristJoint);

const palm = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.5, 0.4), handMaterial);
palm.position.y = 0.9;

wrist.add(palm);


const fingers = [];
const tips = [];
const fingerLengths = [0.8, 1, 1.3, 1.1, 0.7];

for (let i = 0; i < 5; i++) {

    const lowerLength = fingerLengths[i] * 0.6;
    const upperLength = fingerLengths[i] * 0.4;

    // fingerJoint = nyja ne shpute, tipJoint = nyja e dyte e gishtit
    const fingerJoint = new THREE.Group();

    const lowerFinger = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, lowerLength, 0.25),
        fingerMaterial
    );
    lowerFinger.position.y = lowerLength / 2;
    fingerJoint.add(lowerFinger);

    const tipJoint = new THREE.Group();
    tipJoint.position.y = lowerLength;
    fingerJoint.add(tipJoint);

    const upperFinger = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, upperLength, 0.22),
        fingerMaterial
    );
    upperFinger.position.y = upperLength / 2;
    tipJoint.add(upperFinger);

    if (i === 0) {
        // gishti i madh, ne anen e majte te shputes
        fingerJoint.position.x = -0.9;
        fingerJoint.position.y = -0.2;
        fingerJoint.rotation.z = THREE.MathUtils.degToRad(60);
    } else {
        fingerJoint.position.x = -0.5 + (i - 1) * 0.35;
        fingerJoint.position.y = 0.75;
    }

    palm.add(fingerJoint);
    fingers.push(fingerJoint);
    tips.push(tipJoint);
}


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff,2);

directionalLight.position.set(5, 10, 5);

scene.add(directionalLight);


const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        color: 0xcccccc
    })
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.25;

scene.add(ground);
 
const grid = new THREE.GridHelper(
    20,
    20
);

scene.add(grid);

 
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.getElementById('scene').appendChild(renderer.domElement);

 
const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.target.set(0, 3, 0);

controls.enableDamping = true;

controls.update();


shoulder.rotation.z = THREE.MathUtils.degToRad(-20);
elbow.rotation.z = THREE.MathUtils.degToRad(40);
wrist.rotation.z = THREE.MathUtils.degToRad(-20);

const rotationStep = THREE.MathUtils.degToRad(5);
const maxBend = THREE.MathUtils.degToRad(90);
const bends = [0, 0, 0, 0, 0];

function updateFinger(i) {
    const b = bends[i];
    if (i === 0) {
        // gishti i madh perkulet nga ana drejt gishtave
        fingers[0].rotation.z = THREE.MathUtils.degToRad(60) - b * 0.6;
        tips[0].rotation.z = -b * 0.4;
    } else {
        fingers[i].rotation.x = b;
        tips[i].rotation.x = b * 0.8;
    }
}

window.addEventListener('keydown', function(event) {

    const key = event.key.toLowerCase();

    if (key === 'q') {
        shoulder.rotation.z += rotationStep;
    }

    if (key === 'a') {
        shoulder.rotation.z -= rotationStep;
    }

    if (key === 'w') {
        elbow.rotation.z += rotationStep;
    }

    if (key === 's') {
        elbow.rotation.z -= rotationStep;
    }

    if (key === 'e') {
        wrist.rotation.z += rotationStep;
    }

    if (key === 'd') {
        wrist.rotation.z -= rotationStep;
    }

    // tastet 1-5 i perkulin gishtat (me Shift i drejton), tasti 0 i drejton te gjithe
    if (event.code >= 'Digit1' && event.code <= 'Digit5') {
        const i = Number(event.code.slice(5)) - 1;
        const direction = event.shiftKey ? -1 : 1;
        bends[i] = THREE.MathUtils.clamp(bends[i] + direction * rotationStep, 0, maxBend);
        updateFinger(i);
    }

    if (key === '0') {
        for (let i = 0; i < 5; i++) {
            bends[i] = 0;
            updateFinger(i);
        }
    }

});

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

animate();