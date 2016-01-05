/* main.js, start the client! */
var camera, scene, renderer, stats;
var surface, surfaceMaterial, surfaceMesh,
    ocean, oceanMaterial, oceanMesh;
var shaders, start;

loadShaders();

function loadShaders() {
  shaders = {
    planetVertex: 'shaders/planet_vertex.glsl',
    planetFragment: 'shaders/planet_fragment.glsl',
    oceanVertex: 'shaders/ocean_vertex.glsl',
    oceanFragment: 'shaders/ocean_fragment.glsl',
    classicNoise3D: 'shaders/noise/classicnoise3D.glsl',
    simplexNoise3D: 'shaders/noise/noise3D.glsl',
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

  var uniforms = {
    time: { // time is a float initialized to 0
      type: "f",
      value: 0.0
    }
  };

  var segments = 128,
      size = 300;
  surface = new THREE.SphereGeometry(size, segments, segments);
  // set up materials with shaders, and prepend the
  // shaders with the shader noise functions
  surfaceMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: shaders.simplexNoise3D + shaders.planetVertex,
    fragmentShader: shaders.classicNoise3D + shaders.planetFragment,
    //wireframe: true
  });
  surfaceMesh = new THREE.Mesh(surface, surfaceMaterial);

  ocean = new THREE.SphereGeometry(size, segments, segments);
  // set up materials with shaders, and prepend the
  // shaders with the shader noise functions
  oceanMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: shaders.simplexNoise3D + shaders.oceanVertex,
    fragmentShader: shaders.classicNoise3D + shaders.oceanFragment,
    transparent: true,
    //wireframe: true
  });
  oceanMesh = new THREE.Mesh(ocean, oceanMaterial);

  scene.add(surfaceMesh);
  scene.add(oceanMesh);

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
  start = Date.now();
  animate();
}

function animate() {
  stats.begin();

  surfaceMaterial.uniforms.time.value = Date.now() - start;

  //surfaceMesh.rotation.x += 0.005;
  surfaceMesh.rotation.y += 0.002;
  oceanMesh.rotation.y += 0.002;
  //surfaceMesh.rotation.z += 0.03;

  renderer.render(scene, camera);
  stats.end();

  requestAnimationFrame(animate);
}
