class Stream {
  constructor(container, chanName) {
    this._container = container;
    this._container.style.display = "none";
    this._player = new Twitch.Player(container, {
      width: "100%",
      height: "100%",
      channel: chanName,
      controls: false,
      autoplay: false,
    });
    this._online = false;
    // this._ready = false;
    this._started = false;
    // this._player.addEventListener(Twitch.Player.READY, () => {
    //   this._ready = true;
    //   if (this._started) {
    //     this.start();
    //   }
    // });
    this._player.addEventListener(Twitch.Player.OFFLINE, () => {
      this._online = false;
    });
    this._player.addEventListener(Twitch.Player.ONLINE, () => {
      this._online = true;
      if (this._started) {
        this.start();
      }
    });
  }

  get player() {
    return this._player;
  }
  start() {
    if (this._online) {
      this._player.setVolume(1.0);
      this._player.play();
    }
    this._container.style.display = "block";
    this._started = true;
  }

  stop() {
    this._player.stop();
    this._container.style.display = "none";
    this._container.classList.remove('show');
  }
}


export default Stream;