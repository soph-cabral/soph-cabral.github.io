// Example adapted from https://p5js.org/reference/#/p5.FFT

let sound, fft, waveform, spectrum;

let theShader;
let oldTime;
let shaderNdx = 0;

const shaders = [];

let jlx;


function preload(){
  sound = loadSound('assets/tuyo.mp3');
  // Load shaders as strings
  shaders.push(loadShader('shaders/vshader.vert', 'shaders/romance-2.frag'));
  shaders.push(loadShader('shaders/vshader.vert', 'shaders/shader5.frag'));
  theShader = shaders[0];  // start with the first shader

}

function loadShaderSource(path) {
  // Load shader source as string
  let source = loadStrings(path).join('\n');
  if (source === null) {
    console.error('Failed to load shader source:', path);
  }
  return source;
}


function setup() {
  // Use WEBGL renderer for shaders
  let cnv = createCanvas(windowWidth, windowHeight, WEBGL);
    
  cnv.mouseClicked(togglePlay);

  pixelDensity(1);

  fft = new p5.FFT();

}

function draw() {


  // `waveform` is now an array of 1024 values 
  // ranging from -1.0 to 1.0, representing the amplitude
  // of the audio signal at each frequency sample.
  // https://p5js.org/reference/#/p5.FFT/waveform
  waveform = fft.waveform();

  // Alternatively, you can also use the `analyze` method.
  // `spectrum` is now an array of 1024 values
  // ranging from 0 to 255, representing the amplitude
  // of the audio signal at each frequency sample
  // with 127 representing silence.
  // https://p5js.org/reference/#/p5.FFT/analyze
  spectrum = fft.analyze();


      // switch shaders every second
      let time = performance.now() / 10000 | 0;  // convert to seconds
      if (oldTime !== time) {
        oldTime = time;
        // increment shader index to the next shader but wrap around 
        // back to 0 at then of the array of shaders
        shaderNdx = (shaderNdx + 1) % shaders.length;
        theShader = shaders[shaderNdx]
      }

  shader(shaders[0]);

      // Draw a full-screen rectangle to apply the background shader
  rect(0, 0, width, height);

      //sets the active shader
  shader(theShader);

  // Send uniforms to the current shader
  theShader.setUniform('u_resolution', [width, height]);
  theShader.setUniform('u_mouse', [mouseX, height - mouseY]);
  theShader.setUniform('u_time', 0.001 * millis());

  // The best way to pass large amounts of data to a shader
  // is by converting the data to a texture.
  // Convert waveform and spectrum arrays to p5.Image objects
  let waveformAsImg = floatArrayToImage(waveform);
  theShader.setUniform('u_waveform_tex', waveformAsImg);

  let spectrumAsImg = byteArrayToImage(spectrum);
  theShader.setUniform('u_spectrum_tex', spectrumAsImg);

  // Draw a full-screen rectangle to apply the shader
  rect(0, 0, width, height);

}



function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}


function keyPressed() {
  if (key === 's') {
    console.log("Waveform:");
    console.log(waveform);
    
    console.log("Spectrum:");
    console.log(spectrum);
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/**
 * This function takes an array of floating point values
 * between [-1, 1] and returns a p5.Image object where
 * each pixel's color has been mapped from to [0, 255].
 * @param {*} array 
 * @returns 
 */
function floatArrayToImage(array) {
  let img = createImage(array.length, 1);
  img.loadPixels();
  for (let i = 0; i < img.width; i++) {
    const val = (0.5 + 0.5 * array[i]) * 255;
    img.pixels[i * 4 + 0] = val;
    img.pixels[i * 4 + 1] = val;
    img.pixels[i * 4 + 2] = val;
    img.pixels[i * 4 + 3] = 255;
  }
  img.updatePixels();
  return img;
}

/**
 * This function takes an array of byte values
 * between [0, 255] and returns a p5.Image object
 * where each pixel's color has been set to the
 * corresponding byte value.
 * @param {*} array 
 * @returns 
 */
function byteArrayToImage(array) {
  let img = createImage(array.length, 1);
  img.loadPixels();
  for (let i = 0; i < img.width; i++) {
    const val = array[i];
    img.pixels[i * 4 + 0] = val;
    img.pixels[i * 4 + 1] = val;
    img.pixels[i * 4 + 2] = val;
    img.pixels[i * 4 + 3] = 255;
  }
  img.updatePixels();
  return img;
}