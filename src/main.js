/* main.js, start the client! */
var camera, scene, renderer, stats;
var geometry, material, mesh;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  scene = new THREE.Scene();

  var segments = 20;
  geometry = new THREE.SphereGeometry(300, segments, segments);
  material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms, 2: mb
  // align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  renderer = new THREE.WebGLRenderer();
  onWindowResize();

  document.body.appendChild(stats.domElement);
  document.body.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);

  stats.begin();

  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.005;
  //mesh.rotation.z += 0.03;

  renderer.render(scene, camera);
  stats.end();
}
