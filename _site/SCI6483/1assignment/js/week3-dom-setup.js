// DOM setup
// A collection of functions that set up the DOM elements for the drawing UI.


// Handler to update the color swatch
const colorSwatchStroke = document.getElementById("color-swatch-stroke");
const updateColorSwatchStroke = () => {
  // in css, alpha has a range of 0 to 1
  colorSwatchStroke.style.borderColor = `rgba(${strokeColor[0]},${strokeColor[1]},${strokeColor[2]},${strokeColor[3] / 255.0})`;
  colorSwatchStroke.style.borderWidth = strokeWidth + "px";
  colorSwatchStroke.style.backgroundColor = `rgba(${fillColor[0]},${fillColor[1]},${fillColor[2]},${fillColor[3] / 0.0})`;
}


// STROKE SLIDERS
const strokeSliderR = document.getElementById("stroke-slider-red");
const strokeValueR = document.getElementById("stroke-value-red");
strokeValueR.innerHTML = strokeSliderR.value;
strokeSliderR.oninput = function () {
  strokeValueR.innerHTML = this.value;
  strokeColor[0] = Number(this.value);
  updateColorSwatchStroke();
}
strokeSliderR.oninput();

const strokeSliderG = document.getElementById("stroke-slider-green");
const strokeValueG = document.getElementById("stroke-value-green");
strokeValueG.innerHTML = strokeSliderG.value;
strokeSliderG.oninput = function () {
  strokeValueG.innerHTML = this.value;
  strokeColor[1] = Number(this.value);
  updateColorSwatchStroke();
}
strokeSliderG.oninput();

const strokeSliderB = document.getElementById("stroke-slider-blue");
const strokeValueB = document.getElementById("stroke-value-blue");
strokeValueB.innerHTML = strokeSliderB.value;
strokeSliderB.oninput = function () {
  strokeValueB.innerHTML = this.value;
  strokeColor[2] = Number(this.value);
  updateColorSwatchStroke();
}
strokeSliderB.oninput();

const strokeSliderA = document.getElementById("stroke-slider-alpha");
const strokeValueA = document.getElementById("stroke-value-alpha");
strokeValueA.innerHTML = strokeSliderA.value;
strokeSliderA.oninput = function () {
  strokeValueA.innerHTML = this.value;
  strokeColor[3] = Number(this.value);
  updateColorSwatchStroke();
}
strokeSliderA.oninput();

const strokeSliderW = document.getElementById("stroke-slider-width");
const strokeValueW = document.getElementById("stroke-value-width");
strokeValueW.innerHTML = strokeSliderW.value;
strokeSliderW.oninput = function () {
  strokeValueW.innerHTML = this.value;
  strokeWidth = parseFloat(this.value);
  strokeWidth = Number(this.value);
  updateColorSwatchStroke();
}
strokeSliderW.step = 0.01; // Set the step attribute for 0.01 precision
strokeSliderW.min = 0.3; // Set the minimum value
strokeSliderW.oninput();


// FILL SLIDERS
const fillSliderR = document.getElementById("fill-slider-red");
const fillValueR = document.getElementById("fill-value-red");
fillValueR.innerHTML = fillSliderR.value;
fillSliderR.oninput = function () {
  fillValueR.innerHTML = this.value;
  fillColor[0] = Number(this.value);
  updateColorSwatchStroke();
}
fillSliderR.oninput();

const fillSliderG = document.getElementById("fill-slider-green");
const fillValueG = document.getElementById("fill-value-green");
fillValueG.innerHTML = fillSliderG.value;
fillSliderG.oninput = function () {
  fillValueG.innerHTML = this.value;
  fillColor[1] = Number(this.value);
  updateColorSwatchStroke();
}
fillSliderG.oninput();

const fillSliderB = document.getElementById("fill-slider-blue");
const fillValueB = document.getElementById("fill-value-blue");
fillValueB.innerHTML = fillSliderB.value;
fillSliderB.oninput = function () {
  fillValueB.innerHTML = this.value;
  fillColor[2] = Number(this.value);
  updateColorSwatchStroke();
}
fillSliderB.oninput();

const fillSliderA = document.getElementById("fill-slider-alpha");
const fillValueA = document.getElementById("fill-value-alpha");
fillValueA.innerHTML = fillSliderA.value;
fillSliderA.oninput = function () {
  fillValueA.innerHTML = this.value;
  fillColor[3] = Number(this.value);
  updateColorSwatchStroke();
}
fillSliderA.oninput();


// SHAPE SELECTOR
const shapeSelector = document.getElementById("shape-selector");
shapeSelector.onchange = function () {
  shapeMode = shapeSelector.value;
  console.log("Shape selector changed to: " + shapeMode);
}
shapeSelector.onchange();


// BUTTONS
const clearButton = document.getElementById("clear-canvas-button");
clearButton.onclick = function () {
  console.log("Clearing canvas...");
  background(30);
  buffer?.background(30);
}

const saveButton = document.getElementById("save-canvas-button");
saveButton.onclick = function () {
  console.log("Saving canvas...");
  const filename = "canvas-" + getYYYYMMDD_HHMMSS();
  saveCanvas(filename, "png");
}





// UTILITY FUNCTIONS

/**
 * A function that returns the current time in the format of YYYYMMDD_HHMMSS, 
 * padding with 0s if necessary.
 * @returns 
 */
function getYYYYMMDD_HHMMSS() {
  const now = new Date();
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

/**
 * A function that pads a positive number with a 0 if it is less than 10.
 * @param {*} num 
 * @returns 
 */
function pad(num) {
  return (num > -1 && num < 10) ? `0${num}` : `${num}`;
}