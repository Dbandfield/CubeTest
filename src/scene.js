import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import PlusIcon from './img/plus.svg';
import MenuIcon from './img/menu.svg';
import TrashIcon from './img/trash.svg';
import ScaleIcon from './img/scale.svg';
import { CirclePicker } from 'react-color';

function SliderElement(props)
{
  return (
    <input type='range' min="1" max="10" defaultValue="1"
           className='slider'
           onInput={(event) =>{ 
              var scaleValue = parseInt(event.target.value);
              console.log(scaleValue);
              props.onInput(scaleValue);
            }}/>
  )
}

function Text(props)
{
  return(
    <p className='gui-text gui-child'>
    {props.value}
    </p>
  )
}

function SideBar(props)
{
  return(
    <div className='sidebar'>
      <br/>
      <br/>
      <img src={ScaleIcon} />
      <SliderElement onInput={props.onSlider}/>
      <br/>
      <br/>
      <CirclePicker onChangeComplete={props.onNewColour}/>
      <Button img={TrashIcon} onClick={() => {props.onDelete()}} />

    </div>
  );
   
}

class TopBar extends Component
{
  constructor(props)
  {
    super(props)

    this.state = 
    {
      displaySidebar: false
    }
  }

  onClickMenu()
  {
    console.log("hello: " + this.state.displaySidebar);
    var opp = !this.state.displaySidebar;
    this.setState({displaySidebar: opp});
  }

  render()
  {
    return (
    <div className='gui-root container'>
      <div className='row'>
          <div className='topbar col-sm-4'>
            <div className='row'>
              <div className='col-sm'>
                <Button img={MenuIcon} onClick={() => {this.onClickMenu()}} />
              </div>
              <div className='col-sm'>
                <Text value={this.props.name} />
              </div>
              <div className='col-sm'>
                <Button img={PlusIcon} onClick={this.props.onNewCube}/>
              </div>
            </div>
              {
                this.state.displaySidebar &&
                <div className='row'>
                  <SideBar onSlider={this.props.onSlider}
                            onNewColour = {this.props.onNewColour} 
                            onDelete = {this.props.onDelete}/>
                </div>
              } 
          </div>
        </div>
      </div>);


  }
}

function Button(props)
{
    return(
        <input type="image" src={props.img} className='button gui-child' onClick={props.onClick}>
        </input>);
}

class Cube
{
  constructor(_maxDistance, _scene)
  {
    this.scene = _scene;

    const randomRotation = Math.random() * 360; 
    const randomDistance = Math.random() * _maxDistance;
    const randomColour = new THREE.Color();
    // use HSL for prettier randomness
    randomColour.setHSL(Math.random(), 1, 0.5);

    // No need for lots of polies at the moment, so
    // segements is set to 1
    const cubeSize = 10;
    var geo = new THREE.CubeGeometry(cubeSize, cubeSize, cubeSize, 1, 1);
    this.material = new THREE.MeshLambertMaterial({color: randomColour});
    this.mesh = new THREE.Mesh(geo, this.material);

    var vec = new THREE.Vector3(randomDistance, cubeSize/2, 0);
    vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), degToRad(randomRotation));
    this.mesh.position.copy(vec);
    this.scene.add(this.mesh);
  }

  setScale(_value)
  {
    console.log("Scaling cube to " + _value);
    this.mesh.scale.set(_value, _value, _value);
  }

  setColour(_rgb)
  {
    var colour = new THREE.Color();
    // colour picker user 0 - 255, three uses 0 -1
    colour.setRGB(_rgb.r/255, _rgb.g/255, _rgb.b/255);
    this.material.setValues({color: colour});
  }

  deconstruct()
  {
    this.scene.remove(this.mesh);
  }
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
    this.selectedCube = null;

    this.scene.add(this.floor);
    this.scene.add(new THREE.Mesh(new THREE.CubeGeometry(10, 10), new THREE.MeshBasicMaterial({color: 0xff0000})));

    // controls 
    this.controls = new OrbitControls(this.camera, this.mount);

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
    this.camera.rotateX(degToRad(-15));

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
   * Add a new cube to the scene
   */
  newCube()
  {
    const l = this.cubes.push(new Cube(200, this.scene));
    this.selectedCube = l - 1;
  }

  scaleCube(_value)
  {
    if(this.selectedCube != null) 
    {
      this.cubes[this.selectedCube].setScale(_value);
    }
  }

  onNewColour(_colour)
  {
    console.log(_colour);
    if(this.selectedCube != null) 
    {
      this.cubes[this.selectedCube].setColour(_colour.rgb);
    }
  }

  onDelete()
  {
    if(this.selectedCube != null)
    {
      console.log("deleting");
      // remove cube from array
      this.cubes[this.selectedCube].deconstruct();
      this.cubes.splice(this.selectedCube, 1);
      this.selectedCube = this.cubes.length <= 0 ? null : 0;
    }
  }

  render() 
  {
    return (
      <div>
        <TopBar name="Cube 01" 
                onNewCube={() => this.newCube()}
                onSlider={(_val) => {this.scaleCube(_val)}}
                onNewColour={(_col) => {this.onNewColour(_col)}} 
                onDelete={() => {this.onDelete()}}/>

        <div
          style={{ width: '400px', height: '400px' }}
          ref={(mount) => { this.mount = mount }}
        />
      </div>
    )
  }
}

function degToRad(_deg)
{
    return _deg * (Math.PI / 180);
} 

function radTodeg(_rad)
{
    return _rad * (180 / Math.PI);
}

export default ThreeScene