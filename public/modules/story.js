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
        this._index = -1;
        this._currentLine;
        this._timeLineChanged = 0;
        this._textArray5 = [];
    }
    get type() {
        return this._type;
    }
    set type(t) {
        this._type = t;
        this._text1 = getBeginText(this._type);
        this._index = 0;
    }
    get line() {
        return this._text1[this._index];
    }

    get currentLine() {
        return this._currentLine;
    }
    set currentLine(l) {
        this._currentLine = l;
    }

    get timeLineChanged() {
        return this._timeLineChanged;
    }
    set timeLineChanged(i) {
        this._timeLineChanged = i;
    }

    get textArray5() {
        return this._textArray5;
    }

    text1EndLine(type) {
        return this._text1End[type];
    }
    nextLine() {
        if (this._index === this._text1.length-1) {
            return true;
        } else if (this._index === this._text1.length-2) {
            this._index++;
            return true;
        } else {
            this._index++;
            return false;
        }
    }

    draw(p5) {
        p5.text(this._text1[this._index], 0, 0);
    }

    part4Text(p, fade, pos) {
        //Show text story.currentLine
        p.push();
        p.noStroke();
        p.fill(0, 0, 0, fade * 255);
        const textSize = 18 * (p.sin(p.frameCount * 0.03) * 0.15 + 1);
        p.textSize(textSize);
        p.text(this._currentLine, p.width*pos.x, p.height*pos.y);
        p.pop();
    }

    part5Text(p) {
        p.push();
        p.noStroke();
        p.fill(0);
        p.textSize(p.width* 0.001);
        //for each line in part 5 add it to a loop
        this._textArray5.forEach(l => {
            p.text(l, p.random() * p.width, p.random() * p.height); //change this to set positions
        });
        p.pop();
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
                "Until this frozen state",
                "I can no longer",
                "adhere",
                "And I begin to tear.",
                "My time feels longer here, longer than you.",
            ]
            break;
        case "CLOUD":
            text = [
                "Hanging high, squinting so",
                "my view is less of a bird and more of",
                "hazy",
                "dismemberment.",
                "I have never liked this part.",
                "But how radiant weightlessness feels, suspending inevitability with aplomb-",
                "I hover,",
                "Until I can no longer bear such loftiness.",
                "My time feels shorter here, shorter than you."
            ]
            break;
        case "PRECIPITATION":
            text = [
                "Free,",
                "Fall,",
                "I Deluge",
                "Mist,",
                "Glisten,",
                "You guess my form as you",
                "listen",
                "to hits and thuds-",
                "I am thunderous, a",
                "Cascade of strikes.",
                "Harsh and still not",
                "Hard enough.",
                "Impact stings me with undo",
                "Emphasis of an already",
                "Bristling (bracing) downfall.",
                "Violent velocity-",
                "Careful crystals-",
                "Unrelenting and surely fleeting-",
                "I am too much to last.",
                "My time passes quickly here, quicker than you."
            ]
            break;
        case "OCEAN":
            text = [
                "I float,",
                "Succumb,",
                "With buoyant spirit,",
                "Emerging on a surface or diving deep towards a core.",
                "Appearing boundless-",
                "Incompatibly colossal.",
                "This place- this state- always feels",
                "Somewhat ultimate.",
                "Even though breadth",
                "Cannot outlast my bounds.",
                "My time feels longer here, longer than you.",
            ]
            break;
        case "RIVER":
            text = [
                "Stone thrown and slippery,",
                "Smoothed and unsalted,",
                "Slurping and slushing",
                "I sinuate towards the next-",
                "What’s down-",
                "Creeping, dripping, draining, gushing towards an expansive reserve that will reflect hues of sky’s",
                "temperament above.",
                "I am eager to find my way out,",
                "my way through.",
                "My time feels similar here, similar to you."
            ]
            break;
        case "AQUIFER":
            text = [
                "Nestled beneath stratas of soil and earth, within aquifers",
                "I defer",
                "An escape for decades…",
                "centuries…",
                "of years...",
                "Still, I move.",
                "Seeping until",
                "my soaking",
                "saturates.",
                "Until I almost forget",
                "I might exist elsewhere.",
                "My time feels long here, longer than you.",
            ]
            break;
    }
    return text;
}

export default Story;