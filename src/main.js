/* main.js, start the client! */
var camera, cameraControls, scene, renderer;
var sharedUniforms,
    surface, surfaceMaterial, surfaceMesh,
    ocean, oceanMaterial, oceanMesh,
    sun, sunMaterial, sunMesh,
    cloud, cloudMaterial, cloudMesh,
    atmosphere, atmosphereMaterial, atmosphereMesh;
var shaders, start;

//setTimeout(loadShaders, 2000);
loadShaders();

function loadShaders() {
  shaders = {
    surfaceVertex: 'shaders/surface_vertex.glsl',
    surfaceFragment: 'shaders/surface_fragment.glsl',
    oceanVertex: 'shaders/ocean_vertex.glsl',
    oceanFragment: 'shaders/ocean_fragment.glsl',
    cloudVertex: 'shaders/cloud_vertex.glsl',
    cloudFragment: 'shaders/cloud_fragment.glsl',
    atmosphereVertex: 'shaders/atmosphere_vertex.glsl',
    atmosphereFragment: 'shaders/atmosphere_fragment.glsl',
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
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
  camera.position.z = 1000;

  scene = new THREE.Scene();

  var light = new THREE.PointLight(0xffffff);
  var lightPos = new THREE.Vector3(10000, 5000, 5000);
  light.position = lightPos;
  scene.add(light);

  sharedUniforms = {
    time: { // time is a float initialized to 0
      type: "f",
      value: 0.0
    },
    lightPos: {
      type: "v3",
      value: lightPos
    },
    poleSize: {
      type: "f",
      value: 0.0
    },
    oceanLevel: {
      type: "f",
      value: 0
    },
  };

  var heightSegments = 256;
  var widthSegments = heightSegments;
  var radius = 300;

  surface = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
  // set up materials with shaders, and prepend the
  // shaders with the shader noise functions
  surfaceMaterial = new THREE.ShaderMaterial({
    uniforms: _.extend({
      altitude: {
        type: "f",
        value: 40.0
      },
      defaultAltitude: {
        type: "f",
        value: 40.0
      },
    }, sharedUniforms),
    vertexShader: shaders.simplexNoise3D + shaders.surfaceVertex,
    fragmentShader: shaders.classicNoise3D + shaders.surfaceFragment,
    derivatives: true,
    //wireframe: true
  });
  surfaceMesh = new THREE.Mesh(surface, surfaceMaterial);

  ocean = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  // set up materials with shaders, and prepend the
  // shaders with the shader noise functions
  oceanMaterial = new THREE.ShaderMaterial({
    uniforms: _.extend({
      roughness: {
        type: "f",
        value: 1.5
      },
      intensity: {
        type: "f",
        value: 0.1
      },
    }, sharedUniforms),
    vertexShader: shaders.simplexNoise4D + shaders.oceanVertex,
    fragmentShader: shaders.simplexNoise4D + shaders.oceanFragment,
    derivatives: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    //wireframe: true
  });
  oceanMesh = new THREE.Mesh(ocean, oceanMaterial);

  cloud = new THREE.SphereBufferGeometry(radius + 50, widthSegments, heightSegments);
  // set up materials with shaders, and prepend the
  // shaders with the shader noise functions
  cloudMaterial = new THREE.ShaderMaterial({
    uniforms: _.extend({
      cloudColor: {
        type: "v3",
        value: new THREE.Vector3(1, 1, 1)
      },
      cloudDensity: {
        type: "f",
        value: 0.8
      },
      cloudVariation: {
        type: "f",
        value: 0.013
      },
      cloudHeight: {
        type: "f",
        value: 16.0
      },
      cloudLimit: {
        type: "f",
        value: 0.0
      },
      cloudAnimation: {
        type: "f",
        value: 0.5
      },
    }, sharedUniforms),
    vertexShader: shaders.simplexNoise4D + shaders.cloudVertex,
    fragmentShader: shaders.simplexNoise4D + shaders.cloudFragment,
    derivatives: true,
    transparent: true,
    //wireframe: true
  });
  cloudMesh = new THREE.Mesh(cloud, cloudMaterial);

  atmosphere = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
  atmosphereMaterial = new THREE.ShaderMaterial({
    uniforms: _.extend({
      atmosphereColor: {
        type: "c",
        value: new THREE.Color(0xDDDD00)
      },
      opacity: {
        type: "f",
        value: 0.2
      },
      atmosphereAltitude: {
        type: "f",
        value: 100
      },
    }, sharedUniforms),
    vertexShader: shaders.atmosphereVertex,
    fragmentShader: shaders.atmosphereFragment,
    transparent: true
  });
  atmosphereMesh = new THREE.Mesh(atmosphere, atmosphereMaterial);

  sun = new THREE.SphereBufferGeometry(20, 10, 10);
  sun.translate(lightPos.x, lightPos.y, lightPos.z);
  //sun.translate(lightPos);
  sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
  sunMesh = new THREE.Mesh(sun, sunMaterial);

  scene.add(surfaceMesh);
  scene.add(oceanMesh);
  scene.add(cloudMesh);
  scene.add(atmosphereMesh);
  scene.add(sunMesh);

  // setup renderer and activate proper shader extensions
  renderer = new THREE.WebGLRenderer();
  //renderer.context.getExtension('OES_standard_derivatives');
  onWindowResize();

  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.zoomSpeed = 0.1;
  cameraControls.enableKeys = false;

  var loader = document.getElementById('loader');
  loader.parentNode.removeChild(loader);
  document.getElementById('canvasContainer').appendChild(renderer.domElement);

  // start event listeners for the controls, inform them of our uniforms
  var uniforms = [surfaceMaterial.uniforms,
    sharedUniforms,
    cloudMaterial.uniforms,
    oceanMaterial.uniforms,
    atmosphereMaterial.uniforms
  ];
  var inputCtrl = new InputControl(document.getElementById("controls"), uniforms);
  inputCtrl.startGeneralListeners();
  inputCtrl.startSpecificListeners();
  // lets start animating!
  start = Date.now();
  animate();
}

function animate() {
  sharedUniforms.time.value = (Date.now() - start) / 250;

  //cloudMesh.rotation.y += 0.0005;

  cameraControls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}
