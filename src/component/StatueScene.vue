<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PLYLoader } from "three/addons/loaders/PLYLoader.js";

export default{
  name: "StatueScene",
  data(){
    return{
      // Intentionally blank
      // https://stackoverflow.com/questions/65693108/threejs-component-working-in-vuejs-2-but-not-3/65732553
    };
  },
  mounted(){
    this.init();
    document.body.appendChild(this.renderer.domElement);
    this.animate();
  },
  beforeUnmount(){
    document.body.removeChild(this.renderer.domElement);

  },
  methods: {
    init(){
      this.scene = new THREE.Scene();
      this.setRenderer();
      this.setCamera();
      this.setLighting();
      this.setFloor();
      this.setStatue();

      this.statueGeometry = null;
      this.statueMaterial = new THREE.MeshLambertMaterial();
      this.statue = new PLYLoader();
      this.statue.load("/models/mercury.ply", (geometry) => {
        console.log("Statue loaded");

        this.statueGeometry = geometry;
        this.statueGeometry.scale(0.0024, 0.0024, 0.0024);
        this.statueMesh = new THREE.Mesh(this.statueGeometry, this.statueMaterial);
        this.statueMesh.rotation.x -= Math.PI * 0.5;
        this.statueMesh.position.y = -1;
        this.statueMesh.position.x = -1.5;
        this.statueMesh.castShadow = true;
        this.statueMesh.receiveShadow = true;
        this.scene.add(this.statueMesh);
      });

      window.addEventListener("resize", this.onWindowResize);

    },
    setRenderer(){
      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById("three-scene-canvas").appendChild(this.renderer.domElement);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1;
    },
    setCamera(){
      this.camera = new THREE.PerspectiveCamera(
          40,
          window.innerWidth / window.innerHeight,
          0.1,
          1000);
      this.camera.position.set(7,4,1);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.minDistance = 2;
      this.controls.maxDistance = 10;
      this.controls.maxPolarAngle = Math.PI / 2;
      this.controls.target.set(0, 1, 0);
      this.controls.update();
    },
    setLighting(){
      this.ambientLight = new THREE.HemisphereLight(0xffffff,
          0x8d8d8d,
          0.15);
      this.scene.add(this.ambientLight);

      this.spotlight = new THREE.SpotLight(0xcd26c8, 75);
      this.spotlight.position.set(2.5, 5, 2.5);
      this.spotlight.angle = Math.PI / 6;
      this.spotlight.penumbra = 1;
      this.spotlight.decay = 2;
      this.spotlight.distance = 0;
      this.spotlight.castShadow = true;
      this.spotlight.shadow.mapSize.width = 1024;
      this.spotlight.shadow.mapSize.height = 1024;
      this.spotlight.shadow.camera.near = 1;
      this.spotlight.shadow.camera.far = 10;
      this.spotlight.shadow.focus = 0.75;
      this.scene.add(this.spotlight);
      this.lightHelper = new THREE.SpotLightHelper(this.spotlight);
      this.scene.add(this.lightHelper);
    },
    setFloor(){
      this.floorGeometry = new THREE.PlaneGeometry(200,200);
      this.floorMaterial = new THREE.MeshPhongMaterial({color: 0xbcbcbc});
      this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
      this.floor.position.set(0, - 1, 0);
      this.floor.rotation.x = -Math.PI / 2;
      this.floor.receiveShadow = true;
      this.scene.add(this.floor);
    },
    setStatue(){

    },
    animate(){
      requestAnimationFrame(this.animate);
      const time = performance.now() / 3000;

      this.spotlight.position.x = Math.cos(time) * 2.5;
      this.spotlight.position.z = Math.sin(time) * 2.5;

      this.lightHelper.update();

      this.renderer.render(this.scene, this.camera);
    },
    onWindowResize(){
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
}

</script>

<template>
  <div class="scene">
    <div id="three-scene-canvas"></div>
  </div>
</template>

<style scoped>

</style>