import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

export default function () {
    const renderer = new THREE.WebGLRenderer({
        alpha:true
    });

    renderer.outputEncoding = THREE.sRGBEncoding

    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const environtmentMap = cubeTextureLoader.load([
        'assets/environments/px.png','assets/environments/nx.png',
        'assets/environments/py.png','assets/environments/ny.png',
        'assets/environments/pz.png','assets/environments/nz.png'
    ]);

    environtmentMap.encoding = THREE.sRGBEncoding;

    const container = document.querySelector('#container');

    container.appendChild(renderer.domElement);

    const canvasSize = {
        width:window.innerWidth,
        height:window.innerHeight
    }
    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene();
    scene.background = environtmentMap;
    scene.environment = environtmentMap;

    const camera = new THREE.PerspectiveCamera(
        75,
        canvasSize.width / canvasSize.height,
        0.1,
        100
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    const addLight = () => {
        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(2.65, 2.13, 1.02);
        scene.add(light)
    }

    camera.position.set(0,0,3);

    const createEarth1 = () =>{
        const material = new THREE.MeshStandardMaterial({
            map:textureLoader.load('assets/earth-night-map.jpg'),
            roughness:0,
            metalness:0,
        })
        const geometry = new THREE.SphereGeometry(1.3, 30, 30)
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh)
    }

    const resize = ()=> {
        canvasSize.width = window.innerWidth;
        canvasSize.height = window.innerHeight;

        camera.aspect = canvasSize.width / canvasSize.height;
        camera.updateProjectionMatrix();

        renderer.setSize(canvasSize.width, canvasSize.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    const addEvent = () => {
        window.addEventListener('resize', resize)
    }

    const draw = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(()=>{
            draw();
        })
    }

    const initialize = () =>{
        addLight()
        createEarth1()
        addEvent();
        resize();
        draw();
    }

    initialize();
}
