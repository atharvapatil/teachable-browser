console.log("javaScript file initiated");

window.addEventListener('load', () => {
  document.getElementById('text').textContent = 'What does the fox say?';
  // document.body.style.filter = 'blur(1px)';
});


function stringTest(){
  // let inputString = 'https://www.youtube.com/watch?v=Ez89l1NTFXU';

  let inputString = document.getElementById('youtube-url').value;

  let splitString = inputString.split('=');

  console.log(splitString);

  const BASE_COMMON_URL = 'https://www.youtube.com/';
  const TO_REPLACE = 'embed/';
  let videoURL = splitString[1];

  let newURL = BASE_COMMON_URL + TO_REPLACE + videoURL;

  console.log(newURL);

  document.getElementById('embed-video').src = newURL;
}


function testFunction(){
  const inputValue = document.getElementById('youtube-url').value;
  document.getElementById('text').textContent = inputValue;
  console.log(inputValue);

  return inputValue;
}


function videoURLUpdate(){

}

// const EMBED_URL = 'https://www.youtube.com/embed/_t0ZBAk72K8';
// const VIEO_URL = 'https://www.youtube.com/watch?v=_t0ZBAk72K8';
//
//
// const BASE_COMMON_URL = 'https://www.youtube.com/';
// const TO_REMOVE = 'watch?v=';
// const TO-REPLACE = 'embed/';
