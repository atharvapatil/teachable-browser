// const mySoundModelURL = 'https://storage.googleapis.com/teachable-machine-pubilshed-models/df7542cb-b60e-4187-bfcd-61efdecb9467/model.json';
const mySoundModelURL = 'https://storage.googleapis.com/teachable-machine-pubilshed-models/f54c5740-c672-4e7c-aac8-a68007189ead/model.json';
let mySoundModel;
let resultDiv;
let voiceResult;

function preload() {
  mySoundModel = ml5.soundClassifier(mySoundModelURL);
}

function setup() {
  mySoundModel.classify(gotResults);
  noCanvas();
}

function gotResults(err, results) {
  if (err) console.log(err);
  if (results) {
    voiceResult = results[0].label;
    console.log(results[1].label + ' ' + results[1].confidence*100);

    document.getElementById('results').innerHTML = voiceResult;

    //Math.abs converts a negative number to a positive one
    if (voiceResult == 'open') {
      removeBlur();
    }

    if (voiceResult == 'close' || voiceResult == '_background_noise_') {
      blurScreen();
    }

  }
}

function blurScreen() {
  document.body.style.filter = 'blur(18px)';
  document.body.style.transition = '1.2s';
}

function removeBlur() {
  document.body.style.filter = 'blur(0px)';
}
