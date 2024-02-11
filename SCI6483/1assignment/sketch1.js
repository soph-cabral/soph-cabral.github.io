let angle = 0;

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight, WEBGL);
    cnv.parent('canvas-container');
  }
  
  function draw() {
    background(205, 102, 94);
    rectMode(CENTER);
    noStroke();
    translate (0,0, mouseX);
    rotateX(angle);
    rotateY(angle);
    torus(50, 16);

    angle += 0.07;
  }