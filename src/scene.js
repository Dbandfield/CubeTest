import React, { Component } from 'react'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

function Button(props)
{
    return(
        <button className='button' onClick={props.onClick}>
        {props.value}
        </button>);
}


class ThreeScene extends Component 
{
  constructor(props) 
  {
    super(props)

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)
  }

  componentDidMount() 
  {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.light = null;

    this.setupScene();

    // Meshes
    this.floor = this.makeFloor(2000, 2000);
    this.cubes = []

    this.scene.add(this.floor);
    this.scene.add(new THREE.Mesh(new THREE.CubeGeometry(10, 10), new THREE.MeshBasicMaterial({color: 0xff0000})));

    // controls 
    this.controls = new OrbitControls(this.camera);

    this.newCube();

    this.start();
  }

  componentWillUnmount() 
  {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  start() 
  {
    if (!this.frameId) 
    {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop() 
  {
    cancelAnimationFrame(this.frameId)
  }

  animate() 
  {
    this.controls.update();
    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene() 
  {
    this.renderer.render(this.scene, this.camera)
  }

  makeFloor(_width, _height)
  {
    var geo = new THREE.PlaneBufferGeometry(_width, _height, 1, 1);
    var mat = new THREE.MeshLambertMaterial({color: 0x99ff99});

    // By default it is facing the wrong way to be a floor 
    geo.rotateX(-Math.PI / 2);

    return new THREE.Mesh(geo, mat);
  }

  setupScene()
  {
    const width = window.innerWidth;
    const height= window.innerHeight;

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )

    this.camera.position.set(0, 50, 20);
    this.camera.rotateX(this.degToRad(-15));

    this.renderer = new THREE.WebGLRenderer({ antialias: true })

    this.renderer.setClearColor('#000000')
    this.renderer.setSize(width, height)
    this.mount.appendChild(this.renderer.domElement)

    // the light
    this.light = new THREE.HemisphereLight(0xffffff, 0x112255, 1);
    this.light.position.set(0.5, 1, 0.75);
    this.scene.add(this.light);
  }

  /**
   * Return a new cube at a random position,
   * with a random colour. It will be no
   * further away from the camera than 
   * _maxDistance.
   * 
   * @param {number} _maxDistance 
   */
  makeCube(_maxDistance)
  {
    const randomRotation = Math.random() * 360; 
    const randomDistance = Math.random() * _maxDistance;
    const randomColour = new THREE.Color();
    // use HSL for prettier randomness
    randomColour.setHSL(Math.random(), 1, 0.5);

    // No need for lots of polies at the moment, so
    // segements is set to 1
    const cubeSize = 10;
    var geo = new THREE.CubeGeometry(cubeSize, cubeSize, cubeSize, 1, 1);
    var mat = new THREE.MeshLambertMaterial({color: randomColour});
    var mesh = new THREE.Mesh(geo, mat);

    var vec = new THREE.Vector3(randomDistance, cubeSize/2, 0);
    vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.degToRad(randomRotation));
    mesh.position.copy(vec);

    return mesh;
  }

  /**
   * Add a new cube to the scene
   */
  newCube()
  {
    console.log("new cube");
    const l = this.cubes.push(this.makeCube(200));
    this.scene.add(this.cubes[l-1]);    
  }

  degToRad(_deg)
  {
      return _deg * (Math.PI / 180);
  }

  radTodeg(_rad)
  {
      return _rad * (180 / Math.PI);
  }

  render() 
  {
    return (
      <div>
        <Button value="I AM BUTTON" onClick={() => this.newCube()}/>

        <div
          style={{ width: '400px', height: '400px' }}
          ref={(mount) => { this.mount = mount }}
        />
      </div>
    )
  }
}

export default ThreeScene