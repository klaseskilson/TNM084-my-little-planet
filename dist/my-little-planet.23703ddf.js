/*! my-little-planet
(c) Klas Eskilson 2016
Built 2016-01-12 14:43
https://github.com/klaseskilson/TNM084-my-little-planet#readme */
function onWindowResize(){var a=window.innerWidth,b=window.innerHeight;renderer.setSize(a,b),camera.aspect=a/b,camera.updateProjectionMatrix()}function loadShaders(){shaders={surfaceVertex:"shaders/surface_vertex.glsl",surfaceFragment:"shaders/surface_fragment.glsl",oceanVertex:"shaders/ocean_vertex.glsl",oceanFragment:"shaders/ocean_fragment.glsl",cloudVertex:"shaders/cloud_vertex.glsl",cloudFragment:"shaders/cloud_fragment.glsl",atmosphereVertex:"shaders/atmosphere_vertex.glsl",atmosphereFragment:"shaders/atmosphere_fragment.glsl",classicNoise3D:"shaders/noise/classicnoise3D.glsl",simplexNoise3D:"shaders/noise/noise3D.glsl",classicNoise4D:"shaders/noise/classicnoise4D.glsl",simplexNoise4D:"shaders/noise/noise4D.glsl"};var a=_.size(shaders),b=new THREE.XHRLoader,c=_.identity,d=console.error;_.forEach(shaders,function(e,f){b.load(e,function(b){shaders[f]=b,a--,0===a&&init()},c,d)})}function init(){camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,1e5),camera.position.z=1e3,scene=new THREE.Scene;var a=new THREE.PointLight(16777215),b=new THREE.Vector3(1e4,5e3,5e3);a.position=b,scene.add(a),sharedUniforms={time:{type:"f",value:0},lightPos:{type:"v3",value:b},poleSize:{type:"f",value:0},oceanLevel:{type:"f",value:0}};var c=window.innerWidth<=800?128:256,d=c,e=300;surface=new THREE.SphereBufferGeometry(e,d,c),surfaceMaterial=new THREE.ShaderMaterial({uniforms:_.extend({altitude:{type:"f",value:40},defaultAltitude:{type:"f",value:40}},sharedUniforms),vertexShader:shaders.simplexNoise3D+shaders.surfaceVertex,fragmentShader:shaders.classicNoise3D+shaders.surfaceFragment,derivatives:!0}),surfaceMesh=new THREE.Mesh(surface,surfaceMaterial),ocean=new THREE.SphereGeometry(e,d,c),oceanMaterial=new THREE.ShaderMaterial({uniforms:_.extend({roughness:{type:"f",value:1.5},intensity:{type:"f",value:.15}},sharedUniforms),vertexShader:shaders.simplexNoise4D+shaders.oceanVertex,fragmentShader:shaders.simplexNoise4D+shaders.oceanFragment,derivatives:!0,transparent:!0,blending:THREE.AdditiveBlending}),oceanMesh=new THREE.Mesh(ocean,oceanMaterial),cloud=new THREE.SphereBufferGeometry(e+50,d,c),cloudMaterial=new THREE.ShaderMaterial({uniforms:_.extend({cloudColor:{type:"c",value:new THREE.Color(16777215)},cloudDensity:{type:"f",value:.8},cloudVariation:{type:"f",value:.007},cloudHeight:{type:"f",value:16},cloudLimit:{type:"f",value:.25},cloudAnimation:{type:"f",value:.5}},sharedUniforms),vertexShader:shaders.simplexNoise4D+shaders.cloudVertex,fragmentShader:shaders.simplexNoise4D+shaders.cloudFragment,derivatives:!0,transparent:!0}),cloudMesh=new THREE.Mesh(cloud,cloudMaterial),atmosphere=new THREE.SphereBufferGeometry(e,d,c),atmosphereMaterial=new THREE.ShaderMaterial({uniforms:_.extend({atmosphereColor:{type:"c",value:new THREE.Color(14540032)},atmosphereOpacity:{type:"f",value:.2},atmosphereAltitude:{type:"f",value:100}},sharedUniforms),vertexShader:shaders.atmosphereVertex,fragmentShader:shaders.atmosphereFragment,transparent:!0}),atmosphereMesh=new THREE.Mesh(atmosphere,atmosphereMaterial),sun=new THREE.SphereBufferGeometry(20,10,10),sun.translate(b.x,b.y,b.z),sunMaterial=new THREE.MeshBasicMaterial({color:16777215}),sunMesh=new THREE.Mesh(sun,sunMaterial),scene.add(surfaceMesh),scene.add(oceanMesh),scene.add(cloudMesh),scene.add(atmosphereMesh),scene.add(sunMesh),renderer=new THREE.WebGLRenderer,onWindowResize(),cameraControls=new THREE.OrbitControls(camera,renderer.domElement),cameraControls.zoomSpeed=.1,cameraControls.enableKeys=!1;var f=document.getElementById("loader");f.parentNode.removeChild(f),document.getElementById("canvasContainer").appendChild(renderer.domElement);var g=[surfaceMaterial.uniforms,sharedUniforms,cloudMaterial.uniforms,oceanMaterial.uniforms,atmosphereMaterial.uniforms],h=new InputControl(document.getElementById("controls"),g);h.startGeneralListeners(),h.startSpecificListeners(),h.setupToggles(),start=Date.now(),animate()}function animate(){sharedUniforms.time.value=(Date.now()-start)/250,cameraControls.update(),renderer.render(scene,camera),requestAnimationFrame(animate)}var InputControl=function(a,b){var c=this;c.uniforms={},c.domElement=a||body,b&&Array.isArray(b)&&_.each(b,function(a){_.each(a,function(a,b){c.uniforms[b]=a})})};_.extend(InputControl.prototype,{startGeneralListeners:function(){var a=this,b=function(b,c,d){var e=a.uniforms[b]||{};return d||function(a){c=c||_.identity;var d=c.call(null,a.target.value);console.info("changed",b,"to",d),e.value=d}};_.each(a.domElement.querySelectorAll("input[data-key][type=number]"),function(c){var d=c.attributes["data-key"].value;c.value=a.getUniform(d),c.addEventListener("input",b(d,parseFloat))})},startSpecificListeners:function(){var a=this,b=18,c=.4,d=[{selector:"#atmosphereColor",callback:a.colorCallback("atmosphereColor")},{selector:"#cloudColor",callback:a.colorCallback("cloudColor")},{selector:"#temperature",callback:function(c){var d=parseFloat(c.target.value),e=d-b;a.applyDiff("oceanLevel",e),b=d}},{selector:"#humidity",callback:function(b){var d=parseFloat(b.target.value)/100,e=d-c;a.applyDiff("cloudDensity",e,function(b){return a.clamp(a.floatPrecision(b,3),0,1)}),c=d}}];_.each(d,function(b){var c=a.domElement.querySelectorAll(b.selector);_.each(c,function(a){var c=b.eventType||"input";a.addEventListener(c,b.callback)})})},setupToggles:function(){var a=this,b=a.domElement.querySelectorAll(".toggle");_.each(b,function(a){var b=a.attributes["data-target"].value,c=document.getElementById(b);a.addEventListener("click",function(){var b="hide"===a.innerHTML?"show":"hide";a.innerHTML=b,c.classList.toggle("hidden")})})},colorCallback:function(a){var b=this;return function(c){var d=c.target.value;"#"===d[0]&&(d=d.slice(0));var e=parseInt(d,16);b.uniforms[a].value.set(e);var f=e>>16&255,g=e>>8&255,h=e>>0&255,i=.2126*f+.7152*g+.0722*h,j=40>i?"#fff":"#111";c.target.style.backgroundColor="#"+d,c.target.style.color=j}},setUniform:function(a,b,c,d){var e=this;c?e.uniforms[a][c].apply(null,b):e.uniforms[a].value=b;var f=d||b,g=e.domElement.querySelectorAll("[data-key="+a+"]");_.each(g,function(a){a.value=f})},getUniform:function(a){return this.uniforms[a]&&this.uniforms[a].value},applyDiff:function(a,b,c){var d=this;c=c||d.floatPrecision;var e=d.getUniform(a);e+=b,d.setUniform(a,c.call(d,e))},floatPrecision:function(a,b){return b=b||1,Math.round(a*Math.pow(10,b))/Math.pow(10,b)},clamp:function(a,b,c){return Math.min(Math.max(a,b),c)}}),window.addEventListener("resize",onWindowResize,!1);var camera,cameraControls,scene,renderer,sharedUniforms,surface,surfaceMaterial,surfaceMesh,ocean,oceanMaterial,oceanMesh,sun,sunMaterial,sunMesh,cloud,cloudMaterial,cloudMesh,atmosphere,atmosphereMaterial,atmosphereMesh,shaders,start;loadShaders();