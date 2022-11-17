import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

/* Storing user's device details in a variable*/
const details = navigator.userAgent;
  
const regexp = /android|iphone|kindle|ipad/i;

/* Using test() method to search regexp in details
it returns boolean value*/
const isMobileDevice = regexp.test(details);

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * GLTF Loader
 */

let model

const gltfLoader = new GLTFLoader()
gltfLoader.load(
    '/models/UnluckyFam/logoFamLights.glb',
    (gltf) =>
    {   
        model = gltf.scene.children[0]
        scene.add(gltf.scene.children[0])
    }
)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 3)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)


const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(10, 10, 10)

const pointLight2 = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(-10, -10, -10)

scene.add(pointLight)
scene.add(pointLight2)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 15)
camera.position.set(2, 3, 7)

scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let mouseX, lastMouseX
let mouseXDelta = Math.abs(mouseX - lastMouseX)

if (!isMobileDevice){
    canvas.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / sizes.width) * 2 - 1
    })
}else {
    canvas.addEventListener('touchmove', (event) => {
        mouseX = (e.changedTouches[0].clientX / sizes.width) * 2 - 1
    })
}


// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 3, 0)
controls.enableDamping = true
controls.enableZoom = false
controls.enablePan = false
controls.enableRotate = false


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousRotate = 0
let permanentRotation = .01

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()
    // console.log(mouseX)

    if(model){

        previousRotate = model.rotation.y
        mouseXDelta = mouseX - lastMouseX

        if (mouseX < .4 && mouseX > -.4) {
            if(mouseXDelta > .05 || mouseXDelta < -.05) {
                model.rotation.y += mouseXDelta * 2
            }

        }
        if (previousRotate != model.rotation.y){
                permanentRotation = mouseXDelta / 2
        } else if (permanentRotation > .02 || permanentRotation < -.02){
            permanentRotation = permanentRotation > .02 ? permanentRotation - (.02 * (permanentRotation)) : permanentRotation + (.02 * -(permanentRotation))
            console.log(permanentRotation)
        }
        model.rotation.x = Math.sin(elapsedTime / 2) / 8
        model.rotation.y += permanentRotation
        lastMouseX = mouseX
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()