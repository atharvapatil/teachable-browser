console.log("javaScript file initiated");
// Normal Youtube link & Embedded youtube url samples for reference
// const EMBED_URL = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
// const VIDEO_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

window.addEventListener('load', () => {
  document.getElementById('text').textContent = 'What does the fox say?';
  // document.body.style.filter = 'blur(1px)';
});

function handleVideoUpdate(){
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
//
// function testFunction(){
//   const inputValue = document.getElementById('youtube-url').value;
//   document.getElementById('text').textContent = inputValue;
//   console.log(inputValue);
//
//   return inputValue;
// }
