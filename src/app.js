import React, { Component } from 'react'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'


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

    this.floor = this.makeFloor(2000, 2000);

    this.scene.add(this.floor);
    this.scene.add(new THREE.Mesh(new THREE.CubeGeometry(10, 10), new THREE.MeshBasicMaterial({color: 0xff0000})));

    // controls 
    this.controls = new OrbitControls(this.camera);

    this.start()
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

    this.camera.position.set(0, 20, 20);
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
      <div
        style={{ width: '400px', height: '400px' }}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}

export default ThreeScene