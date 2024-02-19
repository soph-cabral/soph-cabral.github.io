// references them by name.
let strokeColor = [0, 0, 0, 0];
let strokeWidth = 0;
let fillColor = [0, 0, 0, 0];
let shapeMode = '';
let bgMusic;
let stars = [];

// Other things to keep track of
let canvas, buffer;
let points = [];
let spherePosition; // Declare spherePosition

// Let's keep track of the state of mouse interactions.
let lastClick = {
  x: 0,
  y: 0
};

function preload() {
    bgMusic = loadSound('music/take-on-me.mp3');
  }

// setup
function setup() {
  windowResized();
  //background(fillColor);

  //------------starry night----------
  background(0);
  for (i = 0; i < 1000; i++){
		let star = {
			x:random(-width,width),
			y:random(-height,height)
		};
    stars.push(star);	
  }
  

  spherePosition = createVector(0, 0);

  let density = strokeColor[3];
  let space = width / density;
  for (let x = 0; x < width; x += space) {
    for (let y = 0; y < height; y += space) {
      let p = createVector(x, y);
      points.push(p);
    }
  }
}

// draw
function draw() {
  noStroke();
  fill(strokeColor);
  sparkleStars();

  // Update the sphere position based on the mouse position
  spherePosition.x = mouseX;
  spherePosition.y = mouseY;

  for (let i = 0; i < points.length; i++) {
    // Calculate individual target position based on the current position of each sphere
    let targetX = mouseX;
    let targetY = mouseY;
    
    let v = createVector(mouseX, mouseY);
    v.sub(points[i]);
    v.setMag(2);
    points[i].add(v);

    push(); // Save the current transformation matrix
    pointLight(strokeColor[0], strokeColor[1], strokeColor[2], -200, 0, 0);
    pointLight(strokeColor[2], strokeColor[1], strokeColor[0], 200, 200, 0);
    ambientLight(strokeColor[1], strokeColor[2], strokeColor[1], 200);
    specularMaterial(250);
    translate(points[i].x - width / 2, points[i].y - height / 2);
    sphere(strokeWidth);
    pop();
  }

  // Check if the music is not playing, and start playing it
  if (!bgMusic.isPlaying()) {
    bgMusic.play();
  }
}

// ---------- Helper function to create a canvas and a buffer for drawing---------
function windowResized() {
  // Take a snapshot of the canvas before deleting it,
  // and then redraw the snapshot after creating a new canvas.
  const pixels = canvas?.get();

  // Delete element before measuring parent.
  // Otherwise, if downsizing, a large canvas will force the parent div
  // to remain large, and we cannot measure the effect of the window resize.
  canvas?.remove();

  // Measure the parent div and create a new canvas.
  const containerDimensions = getElementDimensions("canvas-container");
  canvas = createCanvas(containerDimensions.width, containerDimensions.height,WEBGL);
  canvas.parent("canvas-container");
  canvas.drop(parseFile);

  // Create the buffer for background drawing.
  buffer = createGraphics(containerDimensions.width, containerDimensions.height);
  buffer.background(0);

  // Redraw the snapshot.
  if (pixels !== undefined) {
    image(pixels, 0, 0);
    buffer.image(pixels, 0, 0);
  }
}

// Helper function to parse a file when it is dropped.
function parseFile(file) {
  console.log("Parsing file: ");
  console.log(file);

  if (file.subtype === 'png') {
    loadImage(file.data, img => {
      // Add the imported image centered in the buffer.
      buffer.imageMode(CENTER);
      buffer.image(img, 0.5 * buffer.width, 0.5 * buffer.height);
    });
  }
}


// Helper function to get the dimensions of an element.
function getElementDimensions(elementId) {
  const element = document.getElementById(elementId);
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height
  };
}


function keyPressed() {
  if (keyCode === 32) { // Space bar
    resetPoints();
  } else if (keyCode === ENTER) {
    resetCanvas();
  } else if (keyCode === ESCAPE) {
    noLoop();
  }
  else if (keyCode === 9) {
    loop();
  }
}

function resetPoints() {
  points = [];
  let density = 30;
  let space = width / density;
  for (var x = 0; x < width; x += space) {
    for (var y = 0; y < height; y += space) {
      var p = createVector(x, y);
      points.push(p);
    }
  }
}

function resetCanvas() {
  // Reset all variables and setup the canvas again
  shapeMode = '';
  points = [];
  //bgMusic.stop();
  
  setup();
  loop(); // Start the animation loop again
}

//s to save as png
function keyTyped() {
  if (key === 's') {
    const filename = "canvas-" + getYYYYMMDD_HHMMSS();
    saveCanvas(filename, "png");
  }
}

//tab to resume
function keyReleased() {
  if (keyCode === 9) {
    loop();
  }
}

// Helper function to update the selected music
function updateSelectedMusic() {
    let musicSelector = document.getElementById('music-selector');
    let selectedMusic = musicSelector.value;
  
    // Stop the currently playing music, if any
    if (bgMusic.isPlaying()) {
      bgMusic.stop();
    }
  
    // Load the selected music
    bgMusic = loadSound(selectedMusic, () => {
      // Music loaded callback
      console.log('Music loaded!');
      bgMusic.loop();
    });
}


function sparkleStars() {

    for (let i = 0; i < stars.length; i++) {
      let x = stars[i].x;
      let y = stars[i].y;
    
      fill(255-i, 255-i, 255-i, random(0, 255));
  
      // Change size randomly
      let starradius = random(0.05, 3);
  
      ellipse(x/2, y/2, starradius, starradius);
    }
}
