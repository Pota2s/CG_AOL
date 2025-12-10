import * as THREE from "./three.js/build/three.module.js"
import { TextGeometry } from "./three.js/examples/jsm/geometries/TextGeometry.js"
import { FontLoader } from "./three.js/examples/jsm/loaders/FontLoader.js"

let currentCamera, thirdPersonCamera,firstPersonCamera , renderer, scene;

let spellEffect;

function init () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    thirdPersonCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    thirdPersonCamera.position.set(6,3,5);
    thirdPersonCamera.lookAt(0,0,0);

    firstPersonCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    firstPersonCamera.position.set(0,1.8,0);
    firstPersonCamera.lookAt(1.18,0);

    currentCamera = thirdPersonCamera;

    renderer = new THREE.WebGL1Renderer();
    renderer.setSize(width,height);
    renderer.shadowMap.enabled = true;

    scene = new THREE.Scene();

    document.body.appendChild(renderer.domElement)
}

function createLighting(){
    let ambientLight = new THREE.AmbientLight(0xFFFFFF,0.7);

    let spotLight = new THREE.SpotLight(0xFFFFFF,1.2,1000);
    spotLight.position.set(0,10,0)
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048
    spotLight.shadow.mapSize.height = 2048
    
    let directionalLight = new THREE.DirectionalLight(0xFFFFEE,0.5)
    directionalLight.position.set(5,2,8)

    spellEffect = new THREE.PointLight(0xFFD700,2,3)

    scene.add(ambientLight,spotLight,directionalLight,spellEffect);

}

function render(){
    renderer.render(scene,currentCamera);
    requestAnimationFrame(render);
}

async function createText(){
    const fontLoader = new FontLoader();
    const font = await fontLoader.loadAsync("./three.js/examples/fonts/helvetiker_bold.typeface.json")

    const textGeometry = new TextGeometry("OVerlord",{
        font:font,
        size:1,
        height:0.2,
        depth:1
    });

    const textMaterial = new THREE.MeshStandardMaterial({
        color:0xFFFFFF
    });

    const textMesh = new THREE.Mesh(textGeometry,textMaterial);

    textMesh.position.set(-6, 4, 5)
    textMesh.rotateY(Math.PI/2)

    scene.add(textMesh)
}

async function loader(){
    init();

    createLighting();

    await createTrees()
    await createText();
    render();
}

async function createTrees(){
    createTree(-5,-5)
    createTree(7,-6)
    createTree(-8,8)
}

async function createTree(x,z){
    const textureLoader = new THREE.TextureLoader()
    const texture = await textureLoader.loadAsync("./textures/trunk.png") 

    const trunkGeometry = new THREE.CylinderGeometry(0.6,0.6,3)
    const trunkMaterial = new THREE.MeshStandardMaterial({
        map: texture
    })

    const trunkMesh = new THREE.Mesh(trunkGeometry,trunkMaterial)

    trunkMesh.position.set(x,1.5,z)

    const lowerLeafGeometry = new THREE.ConeGeometry(3,4)
    const upperLeafGeometry = new THREE.ConeGeometry(2.1,2.8)

    const leafMaterial = new THREE.MeshStandardMaterial({
        color:0x374F2F
    })

    const lowerLeafMesh = new THREE.Mesh(lowerLeafGeometry,leafMaterial)
    const upperLeafMesh = new THREE.Mesh(upperLeafGeometry,leafMaterial)

    lowerLeafMesh.position.set(x,4,z)
    upperLeafMesh.position.set(x,6,z)

    scene.add(trunkMesh,lowerLeafMesh,upperLeafMesh)

}

function resizer(){
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    firstPersonCamera.aspect = aspect;
    firstPersonCamera.updateProjectionMatrix();

    thirdPersonCamera.aspect = aspect;
    thirdPersonCamera.updateProjectionMatrix();

    renderer.setSize(width,height);

}

addEventListener("load",loader);
addEventListener("resize",resizer)