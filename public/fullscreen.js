document.querySelector('body').addEventListener('fullscreenchange', (event) => {
    if (document.fullscreenElement) {
        document.getElementById('fsButton').innerHTML = "<i class='fas fa-compress'></i>";
      } else {
        document.getElementById('fsButton').innerHTML = "<i class='fas fa-expand'></i>";
      }
});
document.querySelector('body').addEventListener('webkitfullscreenchange', (event) => {
  console.log("fullscreen!");
  if (document.webkitFullscreenElement) {
    document.getElementById('fsButton').innerHTML = "<i class='fas fa-compress'></i>";
  } else {
    document.getElementById('fsButton').innerHTML = "<i class='fas fa-expand'></i>";
  }
});

function toggleFullscreen() {
    const elem = document.querySelector('body');
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
          alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
}