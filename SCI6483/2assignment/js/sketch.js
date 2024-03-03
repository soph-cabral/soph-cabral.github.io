let myShader;
let soundFile;
let audioContext;
let analyser;
let frequencyData;

function preload() {
  myShader = loadShader('shaders/uniform.vert', 'shaders/romance.frag');
  soundFormats('mp3', 'ogg');
  soundFile = loadSound('js/tuyo.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  noStroke();
  shader(myShader);

  initializeAudio();
}

function draw() {
  updateFrequencyData();
  myShader.setUniform('u_resolution', [width, height]);
  myShader.setUniform('u_mouse', [mouseX, height - mouseY]);
  myShader.setUniform('u_time', 0.001 * millis());
  myShader.setUniform('u_frequencyData', frequencyData);

  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function initializeAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  frequencyData = new Uint8Array(analyser.frequencyBinCount);

  let source = audioContext.createMediaElementSource(AUDIO);
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  // Start playing the audio
  audio.play().then(() => {
    // The audio has started playing
    console.log('Audio started playing.');
  }).catch((error) => {
    console.error('Error starting audio:', error);
  });
}

function updateFrequencyData() {
  analyser.getByteFrequencyData(frequencyData);
}

function keyPressed() {
  if (key === ' ') {
    startAudio();
  } 
}

function startAudio() {
  if (audio.isPaused()) {
    audio.play();
    console.log('Audio started playing.');
  } else {
    console.log('Audio paused.');
  }
}
