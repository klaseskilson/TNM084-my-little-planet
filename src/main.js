/* main.js, start the client! */
var camera, cameraControls, scene, renderer, stats;
var surface, surfaceMaterial, surfaceMesh,
    ocean, oceanMaterial, oceanMesh;
var shaders, start;

//setTimeout(loadShaders, 2000);
loadShaders();

function loadShaders() {
  shaders = {
    surfaceVertex: 'shaders/surface_vertex.glsl',
    surfaceFragment: 'shaders/surface_fragment.glsl',
    oceanVertex: 'shaders/ocean_vertex.glsl',
    oceanFragment: 'shaders/ocean_fragment.glsl',
    classicNoise3D: 'shaders/noise/classicnoise3D.glsl',
    simplexNoise3D: 'shaders/noise/noise3D.glsl',
    classicNoise4D: 'shaders/noise/classicnoise4D.glsl',
    simplexNoise4D: 'shaders/noise/noise4D.glsl',
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

  var light = new THREE.PointLight(0xffffff, 1, 100);
  var lightPos = new THREE.Vector3(500, 500, 500);
  light.position = lightPos;

  var segments = 256;
  var size = 300;

  var uniforms = {
    time: { // time is a float initialized to 0
      type: "f",
      value: 0.0
    },
    amplitude: {
      type: "f",
      value: 40.0
    },
    roughness: {
      type: "f",
      value: 5.0
    },
    lightPos: {
      type: "v3",
      value: lightPos
    },
  };

  surface = new THREE.SphereGeometry(size, /*w*/segments, /*h*/segments);
  // set up materials with shaders, and prepend the
  // shaders with the shader noise functions
  surfaceMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: shaders.simplexNoise3D + shaders.surfaceVertex,
    fragmentShader: shaders.classicNoise3D + shaders.surfaceFragment,
    //wireframe: true
  });
  surfaceMesh = new THREE.Mesh(surface, surfaceMaterial);

  ocean = new THREE.SphereBufferGeometry(size, /*w*/2 * segments, /*h*/segments);
  // set up materials with shaders, and prepend the
  // shaders with the shader noise functions
  oceanMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: shaders.simplexNoise4D + shaders.oceanVertex,
    fragmentShader: shaders.simplexNoise4D + shaders.oceanFragment,
    derivatives: true,
    transparent: true,
    //wireframe: true
  });
  oceanMesh = new THREE.Mesh(ocean, oceanMaterial);

  scene.add(light);
  scene.add(surfaceMesh);
  scene.add(oceanMesh);

  stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms, 2: mb
  // align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  // setup renderer and activate proper shader extensions
  renderer = new THREE.WebGLRenderer();
  //renderer.context.getExtension('OES_standard_derivatives');
  onWindowResize();

  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);

  document.body.appendChild(stats.domElement);
  document.body.appendChild(renderer.domElement);

  // lets start animating!
  start = Date.now();
  animate();
}

function animate() {
  stats.begin();

  oceanMaterial.uniforms.time.value = (Date.now() - start) / 250;
  //oceanMaterial.uniforms.time.needsUpdate = true;

  //surfaceMesh.rotation.x += 0.005;
  //surfaceMesh.rotation.y += 0.002;
  //oceanMesh.rotation.y += 0.002;
  //surfaceMesh.rotation.z += 0.03;

  cameraControls.update();
  renderer.render(scene, camera);
  stats.end();

  requestAnimationFrame(animate);
}
