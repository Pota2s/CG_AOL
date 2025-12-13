import * as THREE from "./three.js/build/three.module.js"
import { TextGeometry } from "./three.js/examples/jsm/geometries/TextGeometry.js"
import { FontLoader } from "./three.js/examples/jsm/loaders/FontLoader.js"
import { GLTFLoader } from "./three.js/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls} from "./three.js/examples/jsm/controls/OrbitControls.js"

let currentCamera, thirdPersonCamera,firstPersonCamera , renderer, scene; // Global Stage components
let currentFace, sadFace, happyFace, faceMaterial; // Hamster face components
let hamster; // Hamster, for raycast detection
let darkWarrior; // Dark Warrior movement component
let spell = []; // Spell Toggling component


function init () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    thirdPersonCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    thirdPersonCamera.position.set(6,3,5);
    thirdPersonCamera.lookAt(0,0,0);

    firstPersonCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    firstPersonCamera.position.set(0,1.8,0);
    firstPersonCamera.lookAt(1,1.8,0);

    currentCamera = thirdPersonCamera;

    renderer = new THREE.WebGL1Renderer();
    renderer.setSize(width,height);
    renderer.shadowMap.enabled = true;
    renderer.shadow.type = THREE.PCFShadowMap;
    renderer.antialias = true;

    scene = new THREE.Scene();

    new OrbitControls(thirdPersonCamera,renderer.domElement);

    document.body.appendChild(renderer.domElement)
}

async function createGround(){
    const textureLoader = new THREE.TextureLoader();
    
    const groundMap = await textureLoader.loadAsync("./textures/ground.jpg");
    const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    map : groundMap
    });
    
    const groundGeometry = new THREE.BoxGeometry(25,2,25);

    const groundMesh = new THREE.Mesh(groundGeometry,groundMaterial);

    groundMesh.receiveShadow = true;
    groundMesh.position.set(0,-1,0);

    scene.add(groundMesh);
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

    scene.add(ambientLight,spotLight,directionalLight);
}

function render(){
    renderer.render(scene,currentCamera);
    requestAnimationFrame(render);
}



async function createHamster(){
    const textureLoader = new THREE.TextureLoader();

    const backTexture = await textureLoader.loadAsync("./textures/hamster-back.png");
    const sideTexture = await textureLoader.loadAsync("./textures/hamster-side.png");

    happyFace = await textureLoader.loadAsync("./textures/hamster-joy.png");
    sadFace = await textureLoader.loadAsync("./textures/hamster-sad.png");
    
    currentFace = happyFace;

    const backMaterial = new THREE.MeshPhongMaterial({
        map: backTexture
    });
    const sideMaterial = new THREE.MeshPhongMaterial({
        map: sideTexture
    }) ;
    const miscMaterial = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF
    });
    faceMaterial = new THREE.MeshPhongMaterial({
        map: currentFace
    });

    const bodyMaterialArray = [sideMaterial,sideMaterial,backMaterial,miscMaterial,faceMaterial,backMaterial];

    const bodyGeometry = new THREE.BoxGeometry(2,2,2);

    const bodyMesh = new THREE.Mesh(bodyGeometry,bodyMaterialArray);
    bodyMesh.position.set(3,1,-1);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    bodyMesh.rotateY(Math.PI/8);

    hamster = bodyMesh;

    const mainMaterial = new THREE.MeshPhongMaterial({
        color: 0x023020
    })
    const rightEarMaterial = new THREE.MeshPhongMaterial({
        color: 0x6b6860
    })

    const tailGeometry = new THREE.BoxGeometry(0.6, 2.8, 0.6)
    const extraTailGeometry = new THREE.BoxGeometry(0.6,0.6,1.4)

    const tailMesh = new THREE.Mesh(tailGeometry,mainMaterial)
    const extraTailMesh = new THREE.Mesh(extraTailGeometry,mainMaterial)

    tailMesh.castShadow = true;
    extraTailMesh.receiveShadow = true;
    tailMesh.receiveShadow = true;
    extraTailMesh.receiveShadow = true;

    tailMesh.rotateY(Math.PI/8)
    tailMesh.position.set(2.6, 1.4, -2.25)
    extraTailMesh.rotateY(Math.PI/8)
    extraTailMesh.rotateZ(Math.PI/2)
    extraTailMesh.position.set(2.44, 2.8, -2.62)

    const earGeometry = new THREE.ConeGeometry(0.2,0.7,128)

    const leftEarMesh = new THREE.Mesh(earGeometry,mainMaterial)
    const rightEarMesh =new THREE.Mesh(earGeometry,rightEarMaterial)

    leftEarMesh.castShadow = true;
    rightEarMesh.castShadow = true;
    leftEarMesh.receiveShadow = true;
    rightEarMesh.receiveShadow = true;

    leftEarMesh.rotateZ(-Math.PI/8);
    leftEarMesh.position.set(4.05, 2.2, -0.6);
    
    rightEarMesh.rotateZ(-Math.PI/8);
    rightEarMesh.position.set(2.5, 2.2, 0);

    scene.add(bodyMesh,tailMesh,extraTailMesh,leftEarMesh,rightEarMesh);
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

//entry point
async function loader(){
    init();
    //Dynamic Elements
    await createWarrior();
    await createSpell();
    await createHamster();
    // Static Elements
    createLighting();
    createGround();
    createTrees();
    createText();
    createSkybox();
    //Render call
    render();
}

async function createSpell(){
    
    const spellEffect = new THREE.PointLight(0xFFD700,2,3)
    spellEffect.position.set(0,0.5,0)
    
    const spellMaterial = new THREE.MeshPhongMaterial({
        color: 0xdaa520,
        emissive: 0xffcc00,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    })
    
    const innerRingGeometry = new THREE.RingGeometry(1  , 1.2, 64);
    const outerRingGeometry = new THREE.RingGeometry(1.8, 2  , 64);
    
    const pointerGeometry = new THREE.BoxGeometry(0.05,4,0.01)
    
    const innerRingMesh = new THREE.Mesh(innerRingGeometry,spellMaterial);
    const outerRingMesh = new THREE.Mesh(outerRingGeometry,spellMaterial);

    innerRingMesh.position.set(0, 0.02, 0)
    outerRingMesh.position.set(0, 0.02, 0)

    innerRingMesh.rotateX(Math.PI/2)
    outerRingMesh.rotateX(Math.PI/2)

    innerRingMesh.scale.set(100,100,100)
    outerRingMesh.scale.set(100,100,100)

    const pointerMeshA = new THREE.Mesh(pointerGeometry,spellMaterial); 
    const pointerMeshB = new THREE.Mesh(pointerGeometry,spellMaterial); 
    
    pointerMeshA.position.set(0, 0.01,0)
    pointerMeshB.position.set(0, 0.01,0)
    
    pointerMeshA.rotateX(Math.PI/2)
    pointerMeshA.rotateZ(Math.PI/2)
    
    pointerMeshB.rotateZ(Math.PI/2)
    pointerMeshB.rotateX(Math.PI/2)

    pointerMeshA.scale.set(100,100,100)
    pointerMeshB.scale.set(100,100,100)

    spell.push(spellEffect,innerRingMesh,outerRingMesh,pointerMeshA,pointerMeshB);
    darkWarrior.add(spellEffect,innerRingMesh,outerRingMesh,pointerMeshA,pointerMeshB);
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

async function createWarrior () {
    let loaderModel = new GLTFLoader()

    const gltf = await loaderModel.loadAsync("./models/momonga_ainz_ooal_gown/scene.gltf")

    darkWarrior = gltf.scene; 

    darkWarrior.position.set(0,-0.01,3) ;
    darkWarrior.scale.set(0.01, 0.01, 0.01);
    darkWarrior.rotation.set(0, Math.PI/2, 0); 

    darkWarrior.traverse(object => {
        if(object.isMesh){
            object.castShadow = true;
            object.receiveShadow = true; 
        }
    });

    darkWarrior.add(firstPersonCamera);
    firstPersonCamera.position.set(0,1.8,0);
    firstPersonCamera.lookAt(1,1.8,0);
    scene.add(darkWarrior);

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

function swapCamera(){
    if (currentCamera == thirdPersonCamera){
        currentCamera = firstPersonCamera;
    } else {
        currentCamera = thirdPersonCamera;
    }
}

function swapFace(){
    if (currentFace == sadFace){
        currentFace = happyFace;
    } else {
        currentFace = sadFace;
    }

    faceMaterial.map = currentFace;
}

function clickHandler(e){
    const width = Math.floor(window.innerWidth / 2);
    const height = Math.floor(window.innerHeight / 2);
    
    const clickLocationX = (e.clientX - width) / width;
    const clickLocationY = (height - e.clientY) / height;

    const clickLocation = new THREE.Vector2(clickLocationX,clickLocationY)
    
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(clickLocation,currentCamera)

    const intersection = raycaster.intersectObject(hamster)

    if (intersection.length > 0){
        swapFace();
    }

}

function moveCharacter(direction,rotation){
    darkWarrior.translateZ(direction.z)
    darkWarrior.translateX(direction.x)
    darkWarrior.rotateY(rotation)
}

function toggleSpell(){
    
    spell.forEach(element => {
        element.visible = !(element.visible)
    });
}

function keyHandler(e){
    const key = e.key
    switch(key){
        case "w":
            moveCharacter(new THREE.Vector3(0,0,1),0);
            break;
        case "s":
            moveCharacter(new THREE.Vector3(0,0,-1),0);
            break;
        case "d":
            moveCharacter(new THREE.Vector3(-1,0,0),0);
            break;
        case "a":
            moveCharacter(new THREE.Vector3(1,0,0),0);
            break;
        case "q":
            moveCharacter(new THREE.Vector3(0,0,0),0.05);
            break;
        case "e":
            moveCharacter(new THREE.Vector3(0,0,0),-0.05);
            break;
        case " ":
            toggleSpell();
            break;
        case "c":
            swapCamera();
            break;
    }
}

const createSkybox = async () =>{
    const right = new THREE.TextureLoader().load("./textures/skybox_right.jpg");
    const left = new THREE.TextureLoader().load("./textures/skybox_left.jpg");
    const up = new THREE.TextureLoader().load("./textures/skybox_top.jpg");
    const down = new THREE.TextureLoader().load("./textures/skybox_bottom.jpg");
    const front = new THREE.TextureLoader().load("./textures/skybox_front.jpg");
    const back = new THREE.TextureLoader().load("./textures/skybox_back.jpg");

    const bodyTextureArray = [right,left,up,down,front,back];
    const bodyMaterialArray = []

    bodyTextureArray.forEach(element => {
        bodyMaterialArray.push(new THREE.MeshBasicMaterial({map : element}))
    });
    
    bodyMaterialArray.forEach(element => {element.side = THREE.BackSide});

    const bodyGeometry = new THREE.BoxGeometry(1200,1200,1200);
    const skyboxMesh = new THREE.Mesh(bodyGeometry,bodyMaterialArray);

    scene.add(skyboxMesh);

}

addEventListener("load",loader);
addEventListener("resize",resizer)
addEventListener("click",clickHandler);
addEventListener("keypress",keyHandler)