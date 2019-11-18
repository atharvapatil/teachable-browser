console.log("javaScript file initiated");
// Normal Youtube link & Embedded youtube url samples for reference
// const EMBED_URL = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
// const VIDEO_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

let URL = 'https://storage.googleapis.com/tm-models/QDvGMpQt/';

// const size = 200;
// const flip = true;
let model, webcam, ctx, labelContainer, maxPredictions;

window.addEventListener('load', init);


async function init() {
  const modelURL = URL + 'model.json';
  const metadataURL = URL + 'metadata.json';

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // Note: the pose library adds 'tmPose' object to your window (window.tmPose)
  model = await tmPose.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const size = 200;
  const flip = true; // whether to flip the webcam
  webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  // await webcam.hide();
  window.requestAnimationFrame(loop);

  // append/get elements to the DOM
  const canvas = document.getElementById('canvas');
  canvas.width = size;
  canvas.height = size;
  ctx = canvas.getContext('2d');
  labelContainer = document.getElementById('label-container');
  for (let i = 0; i < maxPredictions; i++) { // and class labels
    labelContainer.appendChild(document.createElement('div'));
  }
}

// async function setup() {
//   myCanvas = createCanvas(size, size);
//   ctx = myCanvas.elt.getContext("2d");
//   // Call the load function, wait until it finishes loading
//   await load();
//   await loadWebcam();
// }

async function loop(timestamp) {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const {
    pose,
    posenetOutput
  } = await model.estimatePose(webcam.canvas);
  // Prediction 2: run input through teachable machine classification model
  const prediction = await model.predict(posenetOutput);

  for (let i = 0; i < 3; i++) {
    const classPrediction = prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }

  // console.log(prediction);

  let neutral_probablity = prediction[0].probability;
  let left_probablity = prediction[1].probability;
  let right_probablity = prediction[2].probability;

  let topResult = await largest(neutral_probablity, left_probablity, right_probablity);

  // var array = [prediction[0].probability, prediction[1].probability, prediction[2].probability];
  // array.sort();
  // console.log(array);

  // let topResult = prediction[0].className;

  if (topResult === 'neutral') {
    noBlur();
  } else if (topResult === 'left' || topResult === 'right') {
    blurScreen();
  }



  // finally draw the poses
  drawPose(pose);
}

function drawPose(pose) {
  if (webcam.canvas) {
    ctx.drawImage(webcam.canvas, 0, 0);
    // draw the keypoints and skeleton
    if (pose) {
      const minPartConfidence = 0.5;
      tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
      tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
    }
  }
}


function handleVideoUpdate() {
  //declaring common constant params
  const YOUTUBE_URL = 'https://www.youtube.com/';
  const EMBED_URL = 'embed/';

  //getting input url from user input
  let userVideoURL = document.getElementById('youtube-url').value;

  //splitting the input string at the '=' sign to make it a embed compatible URL
  let splitVideoURL = userVideoURL.split('=');

  //The unique video key is the 2nd element of the splitVideoURL array
  let videoKey = splitVideoURL[1];

  //The new url is a contactnation of YOUTUBE_URL + EMBED_URL + videoKey
  let newURL = YOUTUBE_URL + EMBED_URL + videoKey;

  // For debugging
  // console.log(newURL);

  //updating the embedded iframes source
  document.getElementById('embed-video').src = newURL;

}

function blurScreen() {
  document.body.style.filter = 'blur(10px)';
  document.body.style.transition = '1.2s';
}

function noBlur() {
  document.body.style.filter = 'blur(0px)';
}

function largest(num1, num2, num3) {

  let neutral = 'neutral';
  let left = 'left';
  let right = 'right';

  if (num1 > num2 && num1 > num3) {
    // console.log("neutral -is greatest");
    return neutral

  } else if (num2 > num1 && num2 > num3) {
    // console.log("left -is greatest");
    return left

  } else if (num3 > num1 && num3 > num1) {
    // console.log("right is greatest");
    return right

  }
}
