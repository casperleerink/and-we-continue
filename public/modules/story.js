class Story {
    constructor(type) {
        this._type = type;
        this._text = getBeginText(this._type);
        this._index = 0;
    }
    get line() {
        return this._text[this._index];
    }
    nextLine() {
        this._index++;
    }

    draw(p5) {
        p5.text(this._text[this._index], p5.width * 0.5, p5.height * 0.5);
    }
}


function getBeginText(type) {
    let text;
    switch (type) {
        case "ICE":
            text = [
                "Sculpted stoicism.",
                "A gemstone of",
                "feigned rigidity.",
                "Cold and compressed.",
                "Braced and unmoved,",
                "Until this frozen state I can no longer",
                "adhere",
                "And I begin to tear.",
                "My time feels longer here, longer than you.",
            ]
            break;
        case "CLOUD":
            text = [
                "I have never liked this part.",
                "Hanging high, squinting so",
                "my view is less of a bird and more of hazy",
            ]
            break;
        case "RAIN":
            text = [
                "Free-",
                "fall",
                "Deluge",
            ]
            break;
        case "HAIL":
            text = [
                "I am harsh and still not",
                "Hard enough.",
                "The impact stings me with undo",
            ]
            break;
        case "OCEAN":
            text = [
                "I float,",
                "Succumb,",
                "With buoyant spirit,",
                "Emerging on a surface or diving deep towards a core.",
            ]
            break;
        case "RIVER":
            text = [
                "Unsalty, still grainy-",
                "I sinuate towards what’s next-",
                "What’s down-",
                "Crafting towards ease,",
            ]
            break;
        case "AQUIFER":
            text = [
                "Nestled beneath stratas of soil and earth, within aquifers",
                "I defer",
                "An escape for decades, centuries, thousands of years.",
            ]
            break;
    }
    return text;
}

export default Story;