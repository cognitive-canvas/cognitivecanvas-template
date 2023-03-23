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

const fs = document.getElementById('button-fullscreen');
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

function setFsText(mode) {
  if (fs)
    fs.innerHTML = mode ? "Full Screen" : "Restore";
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
  This changes the body flex container to center everything if the window is large enough in
  full screen mode, or if not in live mode.

  If in live mode, it sets the iframe size to my liking
*/
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
