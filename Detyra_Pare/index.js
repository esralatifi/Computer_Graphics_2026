import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x25282b);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(3.2, 2.6, 4.6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.body.style.margin = '0';
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(-0.2, 0.7, -0.4);
controls.update();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// room is 5 x 5 m
const W = 2.5;
const H = 2.8;

// lights
scene.add(new THREE.AmbientLight(0xffffff, 0.25));
scene.add(new THREE.HemisphereLight(0xdfe6ee, 0x6b5f55, 0.45));

const fill = new THREE.DirectionalLight(0xcfd8e3, 0.5);
fill.position.set(3, 5, 5);
scene.add(fill);

const mainLight = new THREE.PointLight(0xffd9a8, 40, 12, 2);
mainLight.position.set(0, 1.95, 0);
mainLight.castShadow = true;
mainLight.shadow.mapSize.set(1024, 1024);
mainLight.shadow.bias = -0.0008;
scene.add(mainLight);

// textures
function makeTileTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 1024;
  const g = c.getContext('2d');
  const n = 8;
  const s = c.width / n;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const dark = (i + j) % 2 === 0;
      const v = (dark ? 62 : 150) + (Math.random() - 0.5) * 14;
      g.fillStyle = `rgb(${v}, ${v + 2}, ${v - 4})`;
      g.fillRect(i * s, j * s, s, s);
    }
  }

  for (let i = 0; i < 30; i++) {
    const x = Math.random() * c.width;
    const y = Math.random() * c.height;
    const r = 30 + Math.random() * 90;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(30, 25, 15, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    g.fillStyle = grad;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  for (let i = 0; i < 40; i++) {
    const x = Math.random() * c.width;
    const y = Math.random() * c.height;
    g.strokeStyle = 'rgba(220, 220, 215, 0.12)';
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + (Math.random() - 0.5) * 120, y + (Math.random() - 0.5) * 120);
    g.stroke();
  }

  g.strokeStyle = 'rgba(25, 25, 22, 0.85)';
  g.lineWidth = 4;
  for (let k = 0; k <= n; k++) {
    g.beginPath(); g.moveTo(k * s, 0); g.lineTo(k * s, c.height); g.stroke();
    g.beginPath(); g.moveTo(0, k * s); g.lineTo(c.width, k * s); g.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

function makeConcreteTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d');

  g.fillStyle = '#8e8e8a';
  g.fillRect(0, 0, c.width, c.height);

  for (let i = 0; i < 40; i++) {
    const x = Math.random() * c.width;
    const y = Math.random() * c.height;
    const r = 40 + Math.random() * 120;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    const dark = Math.random() < 0.5;
    grad.addColorStop(0, dark ? 'rgba(60, 60, 58, 0.25)' : 'rgba(200, 200, 195, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    g.fillStyle = grad;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  for (let i = 0; i < 8000; i++) {
    const v = Math.random() < 0.5 ? 40 : 220;
    g.fillStyle = `rgba(${v}, ${v}, ${v}, ${0.08 + Math.random() * 0.12})`;
    g.fillRect(Math.random() * c.width, Math.random() * c.height, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set((W * 2) / H, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

// floor and walls
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(W * 2, W * 2),
  new THREE.MeshStandardMaterial({ map: makeTileTexture(), roughness: 0.7 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const wallMat = new THREE.MeshStandardMaterial({ map: makeConcreteTexture(), roughness: 1 });

const backWall = new THREE.Mesh(new THREE.PlaneGeometry(W * 2, H), wallMat);
backWall.position.set(0, H / 2, -W);
backWall.receiveShadow = true;
scene.add(backWall);

const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(W * 2, H), wallMat);
leftWall.position.set(-W, H / 2, 0);
leftWall.rotation.y = Math.PI / 2;
leftWall.receiveShadow = true;
scene.add(leftWall);

// loads a model, scales it, moves it and rotates it
const loader = new GLTFLoader();

async function addModel(folder, { height, maxSize, x = 0, z = 0, y = 0, rotY = 0, shadow = true, tint }) {
  const gltf = await loader.loadAsync(`./models/${folder}/${folder}`);
  const model = gltf.scene;

  model.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = shadow;
    o.receiveShadow = true;

    if (tint !== undefined) {
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      const painted = mats.map((m) => {
        const copy = m.clone();
        copy.map = null;
        copy.color.set(tint);
        return copy;
      });
      o.material = Array.isArray(o.material) ? painted : painted[0];
    }
  });

  let box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const factor = height ? height / size.y : maxSize / Math.max(size.x, size.y, size.z);
  model.scale.setScalar(factor);

  box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.set(-center.x, -box.min.y, -center.z);

  const group = new THREE.Group();
  group.add(model);
  group.position.set(x, y, z);
  group.rotation.y = rotY;
  scene.add(group);

  return { group, size: box.getSize(new THREE.Vector3()) };
}

async function build() {
  // left wall
  const stove = await addModel('electric_stove_1k.gltf', { height: 0.9, rotY: Math.PI / 2 });
  const cart = await addModel('tool_cart_1k.gltf', { height: 0.8, rotY: Math.PI / 2 });
  const cab = await addModel('painted_wooden_cabinet_1k.gltf', { height: 1.1, rotY: Math.PI / 2 });

  const gap = 0.08;
  const total = stove.size.x + cart.size.x + cab.size.x + gap * 2;
  const startZ = -total / 2 - 0.2;

  const stoveX = -W + stove.size.z / 2 + 0.02;
  const stoveZ = startZ + stove.size.x / 2;
  stove.group.position.set(stoveX, 0, stoveZ);

  const cartX = -W + cart.size.z / 2 + 0.02;
  const cartZ = startZ + stove.size.x + gap + cart.size.x / 2;
  cart.group.position.set(cartX, 0, cartZ);

  const cabX = -W + cab.size.z / 2 + 0.02;
  const cabZ = startZ + stove.size.x + gap + cart.size.x + gap + cab.size.x / 2;
  cab.group.position.set(cabX, 0, cabZ);

  await Promise.all([
    addModel('vintage_spacecraft_instrument_1k.gltf', { maxSize: 0.45, x: cartX, z: cartZ - cart.size.x * 0.2, y: 0.8, rotY: Math.PI / 2 - 0.4 }),
    addModel('long_life_food_1k.gltf', { maxSize: 0.3, x: cartX, z: cartZ + cart.size.x * 0.22, y: 0.8, rotY: 0.5 }),
    addModel('boombox_1k.gltf', { maxSize: 0.5, x: cabX, z: cabZ, y: 1.1, rotY: Math.PI / 2 + 0.2 }),
  ]);

  // back wall
  const bed = await addModel('vintage_day_bed_1k.gltf', { height: 0.8 });
  const bedX = 0.1;
  const bedZ = -W + bed.size.z / 2 + 0.03;
  bed.group.position.set(bedX, 0, bedZ);

  const coffee = await addModel('CoffeeTable_01_1k.gltf', { height: 0.45, tint: 0x2f80a8 });
  const coffeeZ = bedZ + bed.size.z / 2 + 0.35 + coffee.size.z / 2;
  coffee.group.position.set(bedX, 0, coffeeZ);

  await Promise.all([
    addModel('concrete_cat_statue_1k.gltf', { height: 0.5, x: bedX - coffee.size.x * 0.28, z: coffeeZ - coffee.size.z * 0.05, y: 0.45, rotY: 0.8 }),
    addModel('cigarette_pack_1k.gltf', { maxSize: 0.18, x: bedX + coffee.size.x * 0.25, z: coffeeZ + coffee.size.z * 0.15, y: 0.45, rotY: 0.6 }),
    addModel('pocket_watch_1k.gltf', { maxSize: 0.14, x: bedX + coffee.size.x * 0.02, z: coffeeZ - coffee.size.z * 0.1, y: 0.45, rotY: 1.2 }),
  ]);

  const crate = await addModel('wooden_crate_01_1k.gltf', { height: 0.55, rotY: 0.3 });
  const crateX = bedX + bed.size.x / 2 + 0.25 + crate.size.x / 2;
  const crateZ = -W + crate.size.z / 2 + 0.2;
  crate.group.position.set(crateX, 0, crateZ);

  // table and chairs
  const tx = 0.6;
  const tz = 0.5;
  const table = await addModel('painted_wooden_table_1k.gltf', { height: 0.75, x: tx, z: tz });
  const dz = table.size.z / 2 + 0.1;
  const dx = table.size.x / 2 + 0.1;
  const chairName = 'painted_wooden_chair_02_1k.gltf';

  await Promise.all([
    addModel(chairName, { height: 0.9, x: tx + 0.2,       z: tz + dz + 0.12, rotY: Math.PI + 0.15 }),
    addModel(chairName, { height: 0.9, x: tx - 0.25,      z: tz - dz + 0.15, rotY: -0.3 }),
    addModel(chairName, { height: 0.9, x: tx + dx + 0.05, z: tz - 0.1,       rotY: -Math.PI / 2 + 0.25 }),
    addModel(chairName, { height: 0.9, x: tx - dx - 0.45, z: tz + 0.35,      rotY: Math.PI / 2 + 0.8 }),

    addModel('vintage_oil_lamp_1k.gltf', { maxSize: 0.45, x: tx + table.size.x * 0.2, z: tz, y: 0.75 }),
    addModel('ceramic_pot_1k.gltf', { maxSize: 0.38, x: tx - table.size.x * 0.25, z: tz + table.size.z * 0.15, y: 0.75 }),

    addModel('Chandelier_02_1k.gltf', { height: 0.9, x: 0, z: 0, y: 1.85, shadow: false }),
  ]);

  const lampLight = new THREE.PointLight(0xffb870, 6, 3, 2);
  lampLight.position.set(tx + table.size.x * 0.2, 1.1, tz);
  scene.add(lampLight);
}
build();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();