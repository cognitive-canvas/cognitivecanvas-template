/*
  If isCClive is set, then this is a live mint. Show the configuration GUI. 
*/
function setupLive() {
  if (isCClive) {
    document.getElementById("ui").style.display = "flex";
    readyLive();
  }
  resizeUI();
}

/*
  This is the handler for the Full Screen button.
*/

let fs;
function captureFullscreenButton(id = 'button-fullscreen') {
  fs = document.getElementById(id);
  if (fs) {
      fs.onclick = (e) => {
          const mode = isFullscreen();
          if (mode) {
              exitFullscreenMode();
          } else {
              setFullscreenMode();
          }
          setFsText(mode);
      }
  }
}

function setFsText(mode) {
  if (fs)
    fs.innerHTML = mode ? "Restore" : "Full Screen";
}  

document.onfullscreenchange = (e) => {
  resizeUI();
  setFsText(isFullscreen());
}

function exitFullscreenMode() {
  document.exitFullscreen();
}

function setFullscreenMode() {
  document.documentElement.requestFullscreen();
}

function isFullscreen() {
  return !!document.fullscreenElement;
}

/*
    This handles the screen size dimensions in the different contexts. This will work for and square artwork, and 
    can easily be adapted to any size.

    When running in live mint mode, the innerHeight will always be the real window.innerHeight (that's the size we make
    the iframe), so this is the same in all cases. The innerWidth will be at least 900 in live mint mode, but you can make 
    this larger since you can set the size that you want via ccSetSize.

    In other words, window.innerHeight is the same in all modes, and window.innerWidth can be managed by you in live mint mode.

    In this case, we are just using the window.innerHeight to make our canvas between 700px and 900px square. Then we just 
    add 500 for the width of the ui in the left nav if in live mint mode.

*/
let maxw = 0;
let maxh = 0;
let wwidth = 0;
let wheight = 0;
const MaxArtworkDim = 900;
const MinArtworkDim = 700;
const UIWidth = 500;
function resizeParams() {
  maxh = window.innerHeight;
  maxw = window.innerWidth;
  let dim = maxh;
  dim = Math.min(MaxArtworkDim, dim); // 900 max
  dim = Math.max(dim, MinArtworkDim); // 700 min
  wwidth = isCClive ? dim + UIWidth : dim;
  wheight = dim;
  return { width: dim, height: dim };
}

function resizeUI() {
  resizeParams();
  let align = "start";
  let justify = "flex-start";
  if (isCClive) {
    if (isFullscreen()) {
      align = maxh <= wheight ? "start" : "center";
      justify = wwidth <= maxw ? "center" : "flex-start";
    }
  } else {
    align = maxh <= wheight ? "start" : "center";
    justify = wwidth <= maxw ? "center" : "flex-start";
  }
  document.body.style.justifyContent = justify;
  document.body.style.alignItems = align;
  setSize(wwidth, wheight);
}

function setSize(wwidth, wheight) {
  if (isCClive) ccSetSize(wwidth, wheight);
}

/*
  Enable user thumbnail generation and enable the prepare button. For this simple example, we can enable these buttons
  in setup. For other more complicated examples, you can use your own logic to determine to when enable the buttons.
*/
function readyLive() {
  if (isCClive) {
    ccEnableThumbnail();
    ccEnablePrepare();
  }
}

/*
  Listen for messages from Cognitive Canvas when in live mint mode. 

  "save_thumbnail" - sent when the user clicks the save thumbnail button. 
  "confirm_update" - sent when the user clicks the prepare update button. Do any final actions here.

*/
window.addEventListener("message", (e) => {
  if (!e.data) return;
  switch (e.data.type) {
    case "save_thumbnail":
      saveThumbnail();
      break;
    case "confirm_update":
      confirmUpdate();
      break;
    default:
      break;
  }
});
