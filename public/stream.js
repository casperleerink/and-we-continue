document.getElementById('stream-container').style.display = "none";
const streamOptions = {
    width: "100%",
    height: "100%",
    channel: "casperleerink",
    controls: false,
    autoplay: false,
};
const player = new Twitch.Player("stream-container", streamOptions);

player.addEventListener(Twitch.Player.READY, () => {
  player.setVolume(1.0);
  player.play();
  document.getElementById('stream-container').style.display = "block";
});
