import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js"
import getStarfield from "../assets/helpers/getStarfield.js"
import { getFresnelMat } from "../assets/helpers/getFresnelMat.js"

/* DUNE SPHERE
// Get dimensions of browser window
const w = window.innerWidth;
const h = window.innerHeight;

console.log(THREE);

// Renders the scene using the camera
const renderer = new THREE.WebGLRenderer({ antialias: true});

// Set size of render using width and height of window
renderer.setSize(w,h);
document.body.appendChild(renderer.domElement); //appends to dom, could also do through canvas element on template

// Initialize camera
const fov = 75; //75 degrees, not too narrow, or wide
const aspect = w / h;
const near = 0.1; // when it starts rendering anything closer to camera 0.1 units invisible
const far = 10;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2; // moves camera a little back

// Creates the scene 
const scene = new THREE.Scene();

// adds additional controls to scene
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// Specify geometry, color and material - which goes into mesh
const geo = new THREE.SphereGeometry(1, 32, 16);
const mat = new THREE.MeshDistanceMaterial({
  color: 0xfffff,
  flatShading: true
});

const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh); // add mesh to sceme

const wireMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true
});

// add wireframme mesh as child to mesh, not whole scene
const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.001); //scale up slightly to make animation less flickery
mesh.add(wireMesh);

// add light to scene
const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500); 
scene.add(hemiLight);

// continously call function to animate it
function animate(t = 0) {
  requestAnimationFrame(animate);
  mesh.rotation.y = t * 0.0001;
  renderer.render(scene, camera);
  controls.update();
}
animate();
*/

// Earth 
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);
const loader =new THREE.TextureLoader();  
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
  map: loader.load("../assets/textures/00_earthmap8k.jpg"),
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("../assets/textures/03_earthlights10k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);

const cloudsMat = new THREE.MeshBasicMaterial({
  map: loader.load("../assets/textures/04_earthcloudmap2k.jpg"),
  blending: THREE.AdditiveBlending,
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);

earthGroup.add(lightsMesh);
earthGroup.add(glowMesh);
//earthGroup.add(cloudsMesh);

const stars = getStarfield({ numStars: 3500 }); 
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xfffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);
function animate() {
  requestAnimationFrame(animate);
  earthMesh.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.002;
  glowMesh.rotation.y += 0.002;
  renderer.render(scene, camera);
}

animate();