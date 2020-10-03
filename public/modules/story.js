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
        this._text5Amount = 0;
        this._textPart5 = text5Positions();
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

    get text5Amount() {
        return this._text5Amount;
    }
    set text5Amount(i) {
        text5Amount = i;
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
        const textSize = (p.width * 0.015) * (p.sin(p.frameCount * 0.03) * 0.15 + 1);
        p.textSize(textSize);
        p.text(this._currentLine, p.width*pos.x, p.height*pos.y);
        p.pop();
    }

    part5Text(p, fade) {
        p.push();
        p.noStroke();
        p.fill(0, fade * 255);
        p.textSize(p.width * 0.015);
        //for each line in part 5 add it to a loop
        this._textPart5.forEach(l => {
            p.text(l.text, l.x * p.width, l.y * p.height);
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

function text5Positions() {
    return [
        {x: 0.14, y: 0.08, text: "I am shy" },
        {x: 0.35, y: 0.06, text: "by my squinted perspective of"},
        {x: 0.85, y: 0.07, text: "befores."},
        {x: 0.2, y: 0.14, text: "Look at myself wide."},
        {x: 0.5, y: 0.11, text: "You- look at me, wider."},
        {x: 0.7, y: 0.15, text: "Narrow in and you’ve lost sight-"},
        {x: 0.3, y: 0.22, text: "there is nothing exacting to discover within,"},
        {x: 0.5, y: 0.21, text: "only a totality"},
        {x: 0.84, y: 0.21, text: "existing nowhere precisely"},
        {x: 0.13, y: 0.32, text: "extrapolated never surely"},
        {x: 0.5, y: 0.28, text: "impacting fully through fullness,"},
        {x: 0.72, y: 0.34, text: "which slips betweens the dots and points"},
        {x: 0.24, y: 0.42, text: "of composition and moves like water"},
        {x: 0.56, y: 0.41, text: "through river bends, between rocks and then-"},
        {x: 0.83, y: 0.43, text: "into air..."},
        {x: 0.14, y: 0.52, text: "until it is not there"},
        {x: 0.46, y: 0.54, text: "any longer but somewhere, some way else"},
        {x: 0.78, y: 0.59, text: "a bit differently than how you had expected"},
        {x: 0.35, y: 0.67, text: "and I continue"},
        {x: 0.5, y: 0.63, text: "and I invent"},
        {x: 0.65, y: 0.73, text: "and I negotiate"},
        {x: 0.2, y: 0.72, text: "and even still, I move"},
        {x: 0.45, y: 0.77, text: "missing you"},
        {x: 0.7, y: 0.8, text: "until we collide"},
        {x: 0.4, y: 0.85, text: "next."},
        {x: 0.6, y: 0.92, text: "again"},
    ]
}

export default Story;