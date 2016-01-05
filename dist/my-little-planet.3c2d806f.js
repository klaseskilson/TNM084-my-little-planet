/*! my-little-planet
(c) Klas Eskilson 2016
Built 2016-01-05 03:01
https://github.com/klaseskilson/TNM084-my-little-planet#readme */
function onWindowResize(){var a=window.innerWidth,b=window.innerHeight;renderer.setSize(a,b),camera.aspect=a/b,camera.updateProjectionMatrix()}function loadShaders(){shaders={surfaceVertex:"shaders/surface_vertex.glsl",surfaceFragment:"shaders/surface_fragment.glsl",oceanVertex:"shaders/ocean_vertex.glsl",oceanFragment:"shaders/ocean_fragment.glsl",classicNoise3D:"shaders/noise/classicnoise3D.glsl",simplexNoise3D:"shaders/noise/noise3D.glsl",classicNoise4D:"shaders/noise/classicnoise4D.glsl",simplexNoise4D:"shaders/noise/noise4D.glsl"};var a=_.size(shaders),b=new THREE.XHRLoader,c=_.identity,d=console.error;_.forEach(shaders,function(e,f){b.load(e,function(b){shaders[f]=b,a--,0===a&&init()},c,d)})}function init(){camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,1e4),camera.position.z=1e3,scene=new THREE.Scene;var a={time:{type:"f",value:0},amplitude:{type:"f",value:40},roughness:{type:"f",value:5}},b=128,c=300;surface=new THREE.SphereGeometry(c,b,b),surfaceMaterial=new THREE.ShaderMaterial({uniforms:a,vertexShader:shaders.simplexNoise3D+shaders.surfaceVertex,fragmentShader:shaders.classicNoise3D+shaders.surfaceFragment}),surfaceMesh=new THREE.Mesh(surface,surfaceMaterial),ocean=new THREE.SphereBufferGeometry(c,b,b),oceanMaterial=new THREE.ShaderMaterial({uniforms:a,vertexShader:shaders.simplexNoise4D+shaders.oceanVertex,fragmentShader:shaders.oceanFragment,transparent:!0}),oceanMesh=new THREE.Mesh(ocean,oceanMaterial),scene.add(surfaceMesh),scene.add(oceanMesh),stats=new Stats,stats.setMode(0),stats.domElement.style.position="absolute",stats.domElement.style.left="0px",stats.domElement.style.top="0px",renderer=new THREE.WebGLRenderer,onWindowResize(),document.body.appendChild(stats.domElement),document.body.appendChild(renderer.domElement),start=Date.now(),animate()}function animate(){stats.begin(),oceanMaterial.uniforms.time.value=(Date.now()-start)/250,surfaceMesh.rotation.y+=.002,oceanMesh.rotation.y+=.002,renderer.render(scene,camera),stats.end(),requestAnimationFrame(animate)}window.addEventListener("resize",onWindowResize,!1);var camera,scene,renderer,stats,surface,surfaceMaterial,surfaceMesh,ocean,oceanMaterial,oceanMesh,shaders,start;loadShaders();