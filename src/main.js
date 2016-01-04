/* main.js, start the client! */
var camera, scene, renderer, stats, shaders;
var geometry, material, mesh;

loadShaders();

function loadShaders() {
  shaders = {
    planetVertex: 'shaders/planet_vertex.glsl',
    planetFragment: 'shaders/planet_fragment.glsl',
    classicNoise: 'shaders/noise/classicnoise3D.glsl',
    simplexNoise: 'shaders/noise/noise3D.glsl',
  };

  var numberOfShaders = _.size(shaders),
      loader = new THREE.XHRLoader(),
      onProgress = _.identity,
      onError = console.error;

  // loop through shaders, load them
  _.forEach(shaders, function loadShader(url, key) {
    loader.load(url, function shaderLoaded(shaderContent) {
      // replace shader url with shader content
      shaders[key] = shaderContent;
      numberOfShaders--;
      // all shaders are loaded, proceed to init
      if (numberOfShaders === 0) init();
    }, onProgress, onError);
  });
}

function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  scene = new THREE.Scene();

  var segments = 48;
  geometry = new THREE.SphereGeometry(300, segments, segments);
  // set up materials with shaders, and prepend the
  // shaders with the shader noise functions
  material = new THREE.ShaderMaterial({
    vertexShader: shaders.simplexNoise + shaders.planetVertex,
    fragmentShader: shaders.simplexNoise + shaders.planetFragment,
    //wireframe: true
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

  // lets start animating!
  animate();
}

function animate() {
  stats.begin();

  //mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.005;
  //mesh.rotation.z += 0.03;

  renderer.render(scene, camera);
  stats.end();

  requestAnimationFrame(animate);
}
