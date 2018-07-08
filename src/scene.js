import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import PlusIcon from './img/plus.svg';
import MenuIcon from './img/menu.svg';
import TrashIcon from './img/trash.svg';
import ScaleIcon from './img/scale.svg';
import CameraIcon from './img/camera.svg';
import { CirclePicker } from 'react-color';

function Confirmation(props)
{
  return (
    <div className='confirm'>
      <p className='confirm-text'> 
        {props.text}
      </p>
      <br/>
      <input value="Yes" className='confirm-btn' type='button' onClick={props.yes}/>
      <input value="No" className='confirm-btn' type='button' onClick={props.no}/>
    </div>
  )
}

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

class SideBar extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {deleteConfirm: false}
  }

  removeConfirm()
  {
    this.setState({deleteConfirm: false});
  }

  render()
  {
    return(
      <div className='sidebar'>
        <br/>
        <br/>
        <img src={ScaleIcon} />
        <SliderElement onInput={this.props.onSlider}/>
        <br/>
        <br/>
        <CirclePicker onChangeComplete={this.props.onNewColour}/>
        <Button img={TrashIcon} onClick={() => {this.setState({deleteConfirm: true})}} />
        {
          this.state.deleteConfirm &&
          <Confirmation text = {this.props.delMsg}
                        yes={()=>
                          {
                            this.props.onDelete();
                            this.removeConfirm();
                          }}
                        no={()=> {this.removeConfirm()}} />
        }

      </div>
    );
  }
   
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
              {this.props.cubesExist &&
              <div className='col-sm'>
                <Button img={MenuIcon} onClick={() => {this.onClickMenu()}} />
              </div>}
              <div className='col-sm'>
                <Text value={this.props.name} />
              </div>
              <div className='col-sm'>
                <Button img={PlusIcon} onClick={this.props.onNewCube}/>
              </div>
            </div>
              {
                this.state.displaySidebar && this.props.cubesExist &&
                <div className='row'>
                  <SideBar delMsg = {this.props.delMsg}
                            onSlider={this.props.onSlider}
                            onNewColour = {this.props.onNewColour} 
                            onDelete = {this.props.onDelete}/>
                </div>
              } 
          </div>
          {/* <div className='col-sm-7'>
          </div> */}
          <div className='col-sm'>
              <div className='float-right'>
                <Button img={CameraIcon} onClick={() =>{this.props.onResetCam()}} />
                </div>
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
  constructor(_maxDistance, _scene, _name)
  {
    this.scene = _scene;

    this.name = _name;

    const randomRotation = Math.random() * 360; 
    const randomDistance = Math.random() * _maxDistance;

    this.colour = new THREE.Color();
    this.selectColour = new THREE.Color();

    // use HSL for prettier randomness
    this.colour.setHSL(Math.random(), 1, 0.5);

    var hsl = {h:0, s:0, l:0};
    this.colour.getHSL(hsl);
    this.selectColour.setHSL(hsl.h, hsl.s, 0.9);

    // No need for lots of polies at the moment, so
    // segements is set to 1
    const cubeSize = 10;
    var geo = new THREE.CubeGeometry(cubeSize, cubeSize, cubeSize, 1, 1);
    this.material = new THREE.MeshLambertMaterial({color: this.colour});
    this.mesh = new THREE.Mesh(geo, this.material);

    var vec = new THREE.Vector3(randomDistance, cubeSize/2, 0);
    vec.applyAxisAngle(new THREE.Vector3(0, 1, 0), degToRad(randomRotation));
    this.mesh.position.copy(vec);
    this.scene.add(this.mesh);

    this.selected = false;
  }

  selectCube()
  {
    this.selected = true;
    this.material.setValues({color: this.selectColour});
  }

  deselectCube()
  {
    this.selected = false;
    this.material.setValues({color: this.colour});
  }

  getName()
  {
    return this.name;
  }

  getMesh()
  {
    return this.mesh;
  }

  setScale(_value)
  {
    this.mesh.scale.set(_value, _value, _value);
  }

  setColour(_rgb)
  {
    this.colour.setRGB(_rgb.r/255, _rgb.g/255, _rgb.b/255);
    var hsl = {h:0, s:0, l:0};
    this.colour.getHSL(hsl);
    this.selectColour.setHSL(hsl.h, hsl.s, 0.7);

    if(this.selected)
    {
      this.material.setValues({color: this.selectColour});
    }
    else
    {
      this.material.setValues({color: this.colour});
    }

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

    this.state = {selectedName: '',
                  cubesExist: false,
                  delMsg: ''};

    this.MAX_CUBES = 15;
  }

  componentDidMount() 
  {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.light = null;

    this.cubeNames = 
    [
      'Danny', 'Sandy', 'Kenickie', 'Doody', 
      'Sonny', 'Putzie', 'Frenchy', 'Jan', 'Marty', 'Cha-cha',
      'Rizzo'
    ]

    this.nextName = 0;

    this.setupScene();

    // Meshes
    this.floor = this.makeFloor(2000, 2000);
    this.cubes = 
    {
      meshes: [],
      objects: []
    }

    this.selectedCube = null;

    this.scene.add(this.floor);

    // controls 
    this.controls = new OrbitControls(this.camera, this.mount);

    this.mouse = new THREE.Vector2();

    this.newCube();

    this.raycaster = new THREE.Raycaster();

    document.addEventListener( 'mousedown', (_e)=>{this.onDocumentMouseDown(_e)}, false );
    document.addEventListener( 'touchstart', (_e)=>{this.onDocumentTouchStart(_e)}, false );

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

  onDocumentTouchStart(_event) 
  {
    _event.preventDefault();

    _event.clientX = _event.touches[0].clientX;
    _event.clientY = _event.touches[0].clientY;
    onDocumentMouseDown(event);
  }

  updateDeleteText()
  {
    if(this.selectedCube != null)
    {

      var str = "Are you sure you would like to delete " + 
          this.cubes.objects[this.selectedCube].getName();
      this.setState({delMsg: str});
    }
  }

  updateSelectedText()
  {
    var str;
    if(this.selectedCube != null)
    {
      var humanIndex = parseInt(this.selectedCube) + 1;
      str = this.cubes.objects[this.selectedCube].getName() + 
                ', cube ' + humanIndex + ' of ' +
                this.cubes.objects.length;
      this.setState({selectedName: str});
    }
    else
    {
      str = "Press the plus to create a cube";
      this.setState({selectedName: str})
    }
  }

  onDocumentMouseDown(_event) 
  {

    // _event.preventDefault();

    this.mouse.x = (_event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
    this.mouse.y = - (_event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera );

    var intersects = this.raycaster.intersectObjects(this.cubes.meshes);

    if (intersects.length > 0) 
    {
      for(var m in this.cubes.meshes)
      {
        if(this.cubes.meshes[m] == intersects[0].object)
        {
          this.selectedCube = m;
          this.cubes.objects[m].selectCube();
          this.updateSelectedText();
          this.updateDeleteText();


        }
        else
        {
          this.cubes.objects[m].deselectCube();
        }
      }

    }
  }

  makeFloor(_width, _height)
  {
    var geo = new THREE.PlaneBufferGeometry(_width, _height, 1, 1);
    var mat = new THREE.MeshLambertMaterial({color: 0x99ff99});

    // By default it is facing the wrong way to be a floor 
    geo.rotateX(-Math.PI / 2);

    return new THREE.Mesh(geo, mat);
  }

  setInitialCameraPos()
  {
    this.camera.position.set(0, 50, 20);
    this.camera.rotateX(degToRad(-15));  
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

    this.setInitialCameraPos();

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
    if(this.cubes.objects.length < this.MAX_CUBES)
    {
      const l = this.cubes.objects.push(new Cube(200, this.scene, this.cubeNames[this.nextName]));
      this.nextName ++;
      if(this.nextName >= l) this.nextName = 0;
      this.cubes.meshes.push(this.cubes.objects[l -1].getMesh());
      this.selectedCube = l - 1;
      this.updateSelectedText();
      this.updateDeleteText();


      this.setState({cubesExist: true});
    }
  }

  scaleCube(_value)
  {
    if(this.selectedCube != null) 
    {
      this.cubes.objects[this.selectedCube].setScale(_value);
    }
  }

  onNewColour(_colour)
  {
    if(this.selectedCube != null) 
    {
      this.cubes.objects[this.selectedCube].setColour(_colour.rgb);
    }
  }

  onDelete()
  {
    if(this.selectedCube != null)
    {
      // remove cube from array
      this.cubes.objects[this.selectedCube].deconstruct();
      this.cubes.objects.splice(this.selectedCube, 1);
      this.cubes.meshes.splice(this.selectedCube, 1);

      if(this.cubes.objects.length <= 0)
      {
        this.selectedCube = null;
        this.setState({cubesExist: false});
      }
      else
      {
        this.selectedCube = 0;
      }
    }

    this.updateSelectedText();
    this.updateDeleteText();
  }

  render() 
  {
    return (
      <div className='scene'>
        <TopBar delMsg={this.state.delMsg}
                name={this.state.selectedName}
                cubesExist={this.state.cubesExist}
                onNewCube={() => this.newCube()}
                onSlider={(_val) => {this.scaleCube(_val)}}
                onNewColour={(_col) => {this.onNewColour(_col)}} 
                onDelete={() => {this.onDelete()}}
                onResetCam={() => {this.setInitialCameraPos()}}/>

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