class Story {
    constructor(type) {
        this._type = type;
        this._text1 = getBeginText(this._type);
        this._text1End = {
            "ICE": "My time feels longer here, longer than you.",
            "CLOUD": "My time feels shorter here, shorter than you.",
            "PRECIPITATION": "My time passes quickly here, quicker than you.",
            "RIVER": "My time feels similar here, similar to you.",
            "OCEAN": "My time feels longer here, longer than you.",
            "AQUIFER": "My time feels long here, longer than you.",
        }
        this._index = 0;
    }
    get line() {
        return this._text1[this._index];
    }

    text1EndLine(type) {
        return this._text1End[type];
    }
    nextLine() {
        this._index++;
    }

    draw(p5) {
        p5.text(this._text1[this._index], 0, 0);
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
        case "PRECIPITATION":
            text = [
                "Free,",
                "Fall,",
                "I Deluge",
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