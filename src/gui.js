import React, { Component } from 'react';
import PlusIcon from './img/plus.svg';
import MenuIcon from './img/menu.svg';
import TrashIcon from './img/trash.svg';
import ScaleIcon from './img/scale.svg';
import CameraIcon from './img/camera.svg';
import ResetIcon from './img/reset.svg';
import { CirclePicker, GithubPicker } from 'react-color';

function Confirmation(props)
{
  return (
    <div className='confirm-blocker'>
      <div className='confirm background'>
        <p className='confirm-text'> 
          {props.text}
        </p>
        <br/>
        <div className='confirm-btn-grp'>
          <input value="Yes" className='confirm-btn' type='button' onClick={props.yes}/>
          <input value="No" className='confirm-btn' type='button' onClick={props.no}/>
        </div>
      </div>
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
    <p className='gui-text'>
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
        <div>
          <img className='scaleIcon' src={ScaleIcon} />
          <SliderElement onInput={this.props.onSlider}/>
          <Button img={ResetIcon} onClick={() => {this.props.resetScale()}} />
        </div>
        <br/>
        <br/>

        <CirclePicker onChangeComplete={this.props.onNewColour}/>
        <br/>
        <br/>
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

class GUI extends Component
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
      <div className='background row'>
        {this.props.cubesExist &&
        <div className='col-sm'>
          <Button img={MenuIcon} onClick={() => {this.onClickMenu()}} />
        </div>}
        <div className='col-sm-5'>
          <Text value={this.props.name} />
          <Text value={this.props.number} />
        </div>

        <div className='col-sm'>
          <Button img={PlusIcon} onClick={this.props.onNewCube}/>
        </div>
      </div>
        {
          this.state.displaySidebar && this.props.cubesExist &&
          <div className='row background'>
            <SideBar delMsg = {this.props.delMsg}
                      onSlider={this.props.onSlider}
                      onNewColour = {this.props.onNewColour} 
                      onDelete = {this.props.onDelete}
                      resetScale = {this.props.resetScale} />
          </div>
        } 
      </div>);
  }
}

function Button(props)
{
    return(
        <input type="image" src={props.img} className='button' onClick={props.onClick}>
        </input>);
}

export {GUI, Button};