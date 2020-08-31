const fullscreenButton = () => {
  document.getElementById('fsButton').addEventListener("click", toggleFullscreen)
}

export default fullscreenButton;

function toggleFullscreen() {
    const elem = document.querySelector('body');
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      //change icon
      document.getElementById('fsButton').innerHTML = "<i class='fas fa-expand'></i>";

      //exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      }
    } else {
      //change icon
      document.getElementById('fsButton').innerHTML = "<i class='fas fa-compress'></i>";

      //enter fullscreen
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      }
    }
}
