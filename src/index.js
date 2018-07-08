import React from "react";
import ReactDOM from "react-dom";
import ThreeScene from "./scene.js";
import 'bootstrap';	
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/main.css'

/** This is the entry point for the app. 
 * The bulk of the app is in scene.js
*/

ReactDOM.render(
	<ThreeScene />,
	document.getElementById("root")
);

