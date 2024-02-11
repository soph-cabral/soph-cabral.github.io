let movers = [];
let sun;
let detailX;


function setup() {
  // Create canvas within the canvas-container div
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('canvas-container');



  for (let i = 0; i < 10; i++) {
    let pos = p5.Vector.random2D();
    let vel = pos.copy();
    vel.setMag(random(10, 15));
    pos.setMag(random(100, 150));
    vel.rotate(PI / 2);
    let m = random(10, 15);
    movers[i] = new Mover(pos.x, pos.y, vel.x, vel.y, m);
  }
  sun = new Mover(0, 0, 0, 0, 500);

  detailX = createSlider(3, 24, 3);
  detailX.parent('slider-container'); // Specify the parent div for the slider
  detailX.style('width', '80px');
  
  background(0);
}

function draw() {
  background(0, 20);

  for (let mover of movers) {
    sun.attract(mover);
    for (let other of movers) {
      if (mover !== other) {
        mover.attract(other);
      }
    }
  }

  for (let mover of movers) {
    mover.update();
    mover.show();
  }
}


