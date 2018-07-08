import React, { Component } from 'react'
import ThreeScene from './scene.js'

/**
 * This contains most of the React elements making
 * up the interface. The notable exception is the 
 * three scene, which gets its own file because 
 * it's big.
 */



class Main extends Component
{
    constructor(props)
    {
        super(props)
    }


    render()
    {
        return (
        <div>
        <ThreeScene />
        </div>)
    }
}

export default Main;