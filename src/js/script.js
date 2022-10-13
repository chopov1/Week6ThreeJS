import * as THREE from "three";
import { DirectionalLight, Mesh, Object3D, Vector3 } from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import myImage from '../img/weirdFaceIdk.png'

//use ctrl c to stop the program running and gain control of the console
//ThreeJS is a Y-up platform
//use f12 on website to debug
//to run type "parcel ./src/index.html"

var height = window.innerHeight;
var width = window.innerWidth;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width,height);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width/height, 0.1,1000);
camera.position.set(-10,30,30);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();
scene.add(camera);

const axeshelper = new THREE.AxesHelper(3);
scene.add(axeshelper);

const textureLoader = new THREE.TextureLoader();
//scene.background = textureLoader.load(myImage,myImage,myImage,myImage,myImage,myImage);

const cubeLoader = new THREE.CubeTextureLoader();
scene.background = cubeLoader.load([myImage,myImage,myImage,myImage,myImage,myImage]);

const boxGeo = new THREE.BoxGeometry();
const boxMat = new THREE.MeshBasicMaterial({color:0x00ff00});
const box = new THREE.Mesh(boxGeo, boxMat);
scene.add(box);

const planeGeo = new THREE.PlaneGeometry(40,40);
const planeMat = new THREE.MeshStandardMaterial({color: 0x00fff0, side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.receiveShadow = true;
scene.add(plane);
plane.rotateX(Math.PI * .5);

const gridHelper = new THREE.GridHelper(40, 10);
scene.add(gridHelper);

const sphereGeo = new THREE.SphereGeometry( 10, 40, 40 );
const sphereMat = new THREE.MeshStandardMaterial({color: 0xAABBCC});
const sphere = new THREE.Mesh(sphereGeo,sphereMat);
sphere.position.y = 400;
sphere.castShadow = true;
//scene.add(sphere);

const tetGeo = new THREE.TetrahedronGeometry(5, 1);
const tetMat = new THREE.MeshToonMaterial({color: 0xAABBCC});
const tet = new Mesh(tetGeo, tetMat);
tet.castShadow = true;
scene.add(tet);

const ringGeo = new THREE.TorusGeometry(1, .4, 20, 20);
const ring = new THREE.Mesh(ringGeo, sphereMat);
ring.castShadow = true;
scene.add(ring);

const ambLight = new THREE.AmbientLight({color: 0xAABBCC});
//scene.add(ambLight);

const spotLight = new THREE.SpotLight(0xfaadb5, 2);
spotLight.position.set(-20,20,0);
spotLight.castShadow = true;
scene.add(spotLight);

const gui = new dat.GUI();

const guiOptions = {RingColor: '#0000FF', 
wireframe: true, 
speed: .02,
xPos: 2,
ringHeight: 10,
TetColor: '#aabbcc',
EmissiveColor: '#0000FF',
EmissiveIntensity: 1
};

gui.addColor(guiOptions, 'RingColor').onChange(function(e){
    sphere.material.color.set(e)
});

gui.addColor(guiOptions, 'EmissiveColor').onChange(function(c){
    tetMat.EmissiveColor = c;
});

gui.add(guiOptions, 'EmissiveIntensity', 0, 20);

gui.add(guiOptions, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e;
    tet.material.wireframe = e;
});

gui.addColor(guiOptions, 'TetColor').onChange(function(w){
    tet.material.color.set(w);
});
gui.add(guiOptions, 'speed', 0, .1);
gui.add(guiOptions, 'xPos', -30, 30);
gui.add(guiOptions, 'ringHeight', 1, 40);

var angle = 0;
var dir = 1;

function animate(time){
    box.rotation.x = time /1000;
    box.rotation.y = time /1000;

    ring.rotation.y = time/1000;

    angle += guiOptions.speed;
    sphere.position.y = 10 *Math.abs(Math.sin(angle)) + 10;
    ring.position.x = guiOptions.xPos;

    ring.position.y = guiOptions.ringHeight * Math.abs(Math.cos(angle));
    
    tetMat.bumpScale = guiOptions.EmissiveIntensity;

    tet.position.z += guiOptions.speed * dir;
    if(tet.position.z >= 30 || tet.position.z <= -30){
        dir *= -1;
    }

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
