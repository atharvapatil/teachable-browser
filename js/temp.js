// Normal Youtube link & Embedded youtube url samples for reference
// const EMBED_URL = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
// const VIDEO_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

let URL = 'https://storage.googleapis.com/tm-models/QDvGMpQt/';

let model, webcam, ctx, labelContainer, maxPredictions;

window.addEventListener('load', landingPageLoad);

function landingPageLoad() {
  console.log("Well let's begin");

  document.getElementById('begin-tutorial').addEventListener('click', beginTutorial);

  videoElementPlay();

  document.getElementById('start-app').addEventListener('click', init);
}

function videoElementPlay(){
  // The video element on the page to display the webcam
  var video = document.getElementById('thevideo');
  let constraints = {
    audio: false,
    video: true
  };

  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      // Attach to our video object
      video.srcObject = stream;
      // Wait for the stream to load enough to play
      video.onloadedmetadata = function(e) {
        video.play();
      };
    })
    .catch(function(err) {
      alert(err);
    });

  // Canvas element on the page
  var thecanvas = document.getElementById('thecanvas');
  var thecontext = thecanvas.getContext('2d');

  var draw = function() {
    // Draw the video onto the canvas
    thecontext.drawImage(video, 0, 0, video.width, video.height);

    var overlayImage = new Image();
    overlayImage.src = "./img/intro/intro-4.png";

    thecontext.drawImage(overlayImage, 0, 0);

    // Draw again in 3 seconds
    setTimeout(draw, 60);

  };

  draw();
}

function beginTutorial() {
  console.log("Tutorial begining");

  document.getElementById('intro-wrapper').style.display = 'none';
  document.getElementById('tutorial-wrapper').style.display = 'flex';

  // The video element on the page to display the webcam
  var othervideo = document.getElementById('othervideo');
  let constraints = {
    audio: false,
    video: true
  };

  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      // Attach to our video object
  othervideo.srcObject = stream;
      // Wait for the stream to load enough to play
      othervideo.onloadedmetadata = function(e) {
        othervideo.play();
      };
    })
    .catch(function(err) {
      alert(err);
    });

  // Canvas element on the page
  var othercanvas = document.getElementById('othercanvas');
  var othercontext = othercanvas.getContext('2d');

  let otherdraw = function() {
    // Draw the video onto the canvas
    othercontext.drawImage(othervideo, 0, 0, othervideo.width, othervideo.height);

    let overlayImage = new Image();
    overlayImage.src = "./img/tutorial/ideal-placement.png";

    othercontext.drawImage(overlayImage, 0, 0);

    // Draw again in 3 seconds
    setTimeout(otherdraw, 60);

  };

  otherdraw();

  document.getElementById('start-exp').addEventListener('click', init);

}


async function init() {
  const modelURL = URL + 'model.json';
  const metadataURL = URL + 'metadata.json';

  document.getElementById('intro-wrapper').style.display = 'none';
  document.getElementById('tutorial-wrapper').style.display = 'none';
  document.getElementById('loading-wrapper').style.display = 'block';


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
  // var drawBG = function() {
  //   // Draw the video onto the canvas
  //   // ctx.drawImage(video, 0, 0, size, size);
  //
  //   var overlayImage = new Image();
  //   overlayImage.src = "./img/intro/intro-4.png";
  //
  //   ctx.drawImage(overlayImage, 0, 0, size, size);
  //
  //   // Draw again in 3 seconds
  //   setTimeout(drawBG, 300);
  //
  // };
  //
  // drawBG();
  labelContainer = document.getElementById('label-container');
  for (let i = 0; i < maxPredictions; i++) { // and class labels
    labelContainer.appendChild(document.createElement('div'));
  }
}

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

  if (pose) {
    document.getElementById('app-wrapper').style.display = 'block';
    document.getElementById('tensorflow').style.display = 'block';
    document.getElementById('embed-video').style.display = 'block';
    document.getElementById('inputs').style.display = 'flex';
    document.getElementById('loading').style.display = 'none';
  }

  let neutral_probablity = prediction[0].probability;
  let left_probablity = prediction[1].probability;
  let right_probablity = prediction[2].probability;

  let topResult = await largest(neutral_probablity, left_probablity, right_probablity);

  if (topResult === 'neutral') {
    noBlur();
  } else if (topResult === 'left' || topResult === 'right') {
    blurScreen();
  }

  drawPose(pose);

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
  document.getElementById('vid').src = newURL;

}

function blurScreen() {
  // document.body.style.filter = 'blur(18px)';
  document.getElementById('app-wrapper').style.filter = 'blur(18px)';
  document.body.style.transition = '1.2s';
}

function noBlur() {
  // document.body.style.filter = 'blur(0px)';
  document.getElementById('app-wrapper').style.filter = 'blur(0px)';
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
