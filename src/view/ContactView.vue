<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import FerrisWheel from "@/assets/threejs/FerrisWheel.js";

export default {
  name: "ContactView",
  components: {
    // Intentionally blank
  },
  data(){
    return{
      // Intentionally not using THREE.js here
      // https://stackoverflow.com/questions/65693108/threejs-component-working-in-vuejs-2-but-not-3/65732553
      linkedinlink: "https://www.linkedin.com/in/matthew-peach-dev/",
      email: "peach.matthew.93@gmail.com",
      mouseClick: false,
      mouseDragging: false,
    }
  },
  beforeMount(){

  },
  mounted(){
    // Scene
    this.scene = new THREE.Scene();
    // Renderer
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor("#eaeaea");
    // Camera
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 100;
    // Append child
    document.getElementById("sceneContainer").appendChild(this.renderer.domElement);
    // Set controls after appending to child
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    // For raycasting
    this.mouse = new THREE.Vector2(0,0);
    // ... Apparently all arguments are optional? Ok javascript...
    this.raycaster = new THREE.Raycaster();
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Add objects so scene
    this.populateScene();
    // Resize listener
    window.addEventListener("resize", this.onWindowResize);

    // Mouse event listeners - maybe use "window" instead...?
    this.renderer.domElement.addEventListener("pointerdown", this.pointerdown)
    this.renderer.domElement.addEventListener("pointerup", this.pointerup)
    this.renderer.domElement.addEventListener("pointermove", this.pointerMove);

    this.animate();

  },
  beforeUnmount(){
    // Different from StatueScene for some odd reason.
    const sceneContainer = document.getElementById("sceneContainer");
    if(sceneContainer.contains(this.renderer.domElement)){
      sceneContainer.removeChild(this.renderer.domElement);
    }
    // Remove event listeners
    this.renderer.domElement.removeEventListener("pointerdown", this.pointerdown);
    this.renderer.domElement.removeEventListener("pointerup", this.pointerup);
    this.renderer.domElement.removeEventListener("pointermove", this.pointerMove);
  },
  methods: {
    animate(){
      // ============================================
      requestAnimationFrame(this.animate);
      const time = performance.now() / 3000;
      // -------------------------------------------

      this.raycaster.setFromCamera(this.mouse, this.camera);
      //console.log(this.mouse);

      const intersectsLinkedinlogo = this.raycaster.intersectObject(this.linkedinCircle);
      if(intersectsLinkedinlogo.length > 0){
        this.linkedinCircle.rotateY(5);
        if(this.mouseClick == true && this.mouseDragging == false){
          this.openLinkedin();
        }
      }

      // mailto: Will work this out later...
      // const intersectsMail = this.raycaster.intersectObject(this.mail);
      // if(intersectsMail.length > 0){
      //   this.mail.rotateY(5);
      //   if(this.mouseClick == true && this.mouseDragging == false){
      //     this.openEmail();
      //   }
      // }

      this.linkedinCircle.rotateY(0.075);
      this.myPicture.rotateY(0.05);
      this.wheel1.rotate(0.002);
      this.wheel2.rotate(0.003);
      this.wheel3.rotate(0.005);
      this.torus.rotation.x += 0.005;
      this.torus.rotation.y += 0.005;

      // --------------------------------------------
      this.renderer.render(this.scene, this.camera);
      // ============================================

    },
    populateScene(){
      const torusGeometry = new THREE.TorusGeometry(200, 1.6, 3, 9);
      const material = new THREE.MeshBasicMaterial({color: 0xff9891});
      this.torus = new THREE.Mesh(torusGeometry, material);
      this.torus.rotation.x -= 5
      this.torus.rotation.y += 4
      this.scene.add(this.torus);

      this.wheel1 = new FerrisWheel({
        radius: 30,
        innerWheelColor: 0x1779e8,
        outerWheelColor: 0x1779e8,
        riggingColor: 0x000fff,
        cartColor: 0xf2a500
      });
      this.wheel1.group.position.x -= 25;
      this.wheel1.group.position.y += 30;
      this.scene.add(this.wheel1.group);

      this.wheel2 = new FerrisWheel({
        radius: 30,
        innerWheelColor: 0x9421df,
        outerWheelColor: 0x9421df,
        riggingColor: 0x735d78,
        cartColor: 0x4275ff
      });
      this.wheel2.group.position.y -= 30;
      this.wheel2.group.position.z -= 20;
      this.wheel2.group.position.x += 10;
      this.wheel2.group.rotation.x -= 20;
      this.wheel2.group.rotation.y -= 10;
      this.scene.add(this.wheel2.group);

      this.wheel3 = new FerrisWheel({
        radius: 30,
        innerWheelColor: 0x6ada32,
        outerWheelColor: 0x6ada32,
        riggingColor: 0x457a2a,
        cartColor: 0xf3531c
      });
      this.wheel3.group.position.y += 40;
      this.wheel3.group.position.z -= 100;
      this.wheel3.group.rotation.x -= 0.5;
      this.scene.add(this.wheel3.group);

      // mailto: Will work this out later...
      // ====== Letter/Email ==============
      // const mailTexture = new THREE.TextureLoader().load("/other/email.jpg");
      // this.mail = new THREE.Mesh(
      //     new THREE.PlaneGeometry(20, 20, 5),
      //     new THREE.MeshBasicMaterial({map: mailTexture, side:THREE.DoubleSide, transparent: true})
      // );
      // this.mail.position.z -= 50;
      // this.mail.position.x += 15;
      // this.mail.position.y -= 5;
      // this.mail.rotateZ(0.5);
      // this.scene.add(this.mail);

      // ===== Linkedin Circle =============
      const linkedinlogo = new THREE.TextureLoader().load("/logos/linkedin.jpg");
      this.linkedinCircle = new THREE.Mesh(
          new THREE.CircleGeometry(10,20,10),
          new THREE.MeshBasicMaterial({map: linkedinlogo, side: THREE.DoubleSide, transparent: true})
      );

      this.linkedinCircle.position.z -= 10;
      this.linkedinCircle.position.x -= 10;
      this.linkedinCircle.position.y -= 5;
      this.scene.add(this.linkedinCircle);

      // ====== Picture ============
      const mypic = new THREE.TextureLoader().load("/other/me.jpg");
      this.myPicture = new THREE.Mesh(
          new THREE.CircleGeometry(10, 20, 10),
          new THREE.MeshBasicMaterial({map: mypic, side: THREE.DoubleSide})
      );
      this.myPicture.position.z -= 20;
      this.myPicture.position.x += 10;
      this.myPicture.position.y += 15;
      this.scene.add(this.myPicture);
    },
    onWindowResize(){
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    pointerMove(event){
      // Allow dragging - mouse will be clicked while dragging, trying to prevent accidentally opening the link
      if(this.mouseClick == true){
        this.mouseDragging = true;
      }
      // event.offsetX and Y, NOT event.clientX and Y
      this.mouse.x = ( event.offsetX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.offsetY / window.innerHeight ) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
    },
    pointerup(){
      // reset
      this.mouseClick = false;
      this.mouseDragging = false;
    },
    pointerdown(){
      this.mouseClick = true;
    },
    openLinkedin(){
      window.open(this.linkedinlink);
    },
    // openEmail(){
    //   location.href="mailto:" + this.email;
    // }
  }
}
</script>

<template>
  <div class="relative">
    <div class="absolute">
      <div id="sceneContainer"></div>
    </div>
  </div>
</template>