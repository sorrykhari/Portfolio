import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js"

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
const geo = new THREE.IcosahedronGeometry(1.0, 2);
const mat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
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
