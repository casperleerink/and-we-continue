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
        this._textPart3 = text3Times();
        this._textPart4 = text4Times();
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
    get textPart3() {
        return this._textPart3;
    }
    get textPart4() {
        return this._textPart4;
    }
    get textPart5() {
        return this._textPart5;
    }
    get text5Amount() {
        return this._text5Amount;
    }
    set text5Amount(i) {
        this._text5Amount = i;
    }

    text1EndLine(type) {
        return this._text1End[type];
    }
    nextLine() {
        if (this._index === this._text1.length-1) {
            this._index = 0;
        } else {
            this._index++;
        }
    }

    draw(p5) {
        p5.text(this._text1[this._index], 0, 0);
    }
    part4Text(p, time, pos) {
        p.push();
        p.noStroke();
        // p.textSize((p.width * 0.015) * (p.sin(p.frameCount * 0.03) * 0.1 + 1));
        p.textSize(p.width * 0.015);
        this._textPart4.forEach(l => {
            //only show the line at the right time
            if (time >= l.s && time <= l.e) {
                let fade = 1;
                const fadeTime = (l.e - l.s) / 3;
                const timeFromStart = time - l.s;
                const timeTillEnd = l.e - time;
                if (timeFromStart < fadeTime) {
                    fade = timeFromStart / fadeTime
                } else if (timeTillEnd < fadeTime) {
                    fade = timeTillEnd / fadeTime;
                }
                p.fill(0, fade*255);
                p.text(l.text, pos.x*p.width, pos.y*p.height);
            }
        });
        p.pop();
    }

    part5Text(p, fade) {
        p.push();
        p.noStroke();
        p.fill(0, fade * 255);
        p.textSize(p.width * 0.015);
        //for each line in part 5 add it to a loop
        const amount = this._text5Amount > this._textPart5.length ? this._textPart5.length : this._text5Amount;
        for (let i = 0; i < amount; i++) {
            const l = this._textPart5[i];
            p.text(l.text, l.x * p.width, l.y * p.height);
        }
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

function text3Times() {
    return [
        {text: "until we are found", s: 2000, e: 6000},
        {text: "tugged down", s: 7000, e: 9000},
        {text: "with suddenness that", s: 10000, e: 13000},
        {text: "somehow passes slowly", s: 13500, e: 16000},
        {text: "then- captured", s: 17000, e: 19500},
        {text: "in high, harsh places", s: 20000, e: 23000},
        {text: "harbored for an age of feigned silence until", s: 24000, e: 29000},
        {text: "we crash and gush and bruise", s: 29500, e: 34000},
        {text: "salting wounds", s: 34500, e: 37000},
        {text: "then- spread across dizzying depths to", s: 40000, e: 45000},
        {text: "bathe and wait", s: 46000, e: 49000},
        {text: "for that familiar tug", s: 50000, e: 54000},
        {text: "this time drawn up", s: 55000, e: 58000},
        {text: "away from thirsty lives", s: 60000, e: 63500},
        {text: "lived below", s: 64000, e: 68000},
        {text: "we remember this place", s: 72000, e: 77000},
        {text: "this time", s: 80000, e: 82500},
        {text: "but less surely", s: 85000, e: 88000},
        {text: "less and less surely.", s: 90000, e: 93000},
        {text: "our movements are becoming", s: 95000, e: 99000},
        {text: "Off", s: 100000, e: 102000},
        {text: "in tally, in scope", s: 104000, e: 108000},
        {text: "in pacing and waiting", s: 110000, e: 114000},

        {text: "Our time chilled feels shorter, further from you.", s: 124000, e: 132000},
        {text: "Our time hotter feels longer, nearer to you.", s: 138000, e: 146000},
        {text: "Our time feels thrown, tousled by you.", s: 150000, e: 157000},
    ]
}

function text4Times() {
    return [
        {text: "more of us gather along certain terrains", s: 2000, e: 8000},
        {text: "saturating until", s: 10000, e: 14000},
        {text: "dryness bears a bittersweet remembrance", s: 15000, e: 20000},
        {text: "for these lands that cannot be wrung of wetness", s: 22000, e: 28000},
        {text: "and people chase after places that are parched", s: 30000, e: 36000},
        {text: "fleeing from knee-deep depths of us", s: 38000, e: 45000},
        {text: "us, who have assured their vitality for so long", s: 47000, e: 52000},
        {text: "we are fled from", s: 53000, e: 56000},
        {text: "to a place they can stand", s: 57000, e: 61000},

        {text: "and then in a single turn", s: 70000, e: 74000},
        {text: "we are missed", s: 74500, e: 79000},
        {text: "once their throats gasp", s: 80000, e: 83000},
        {text: "and tongues plead", s: 84000, e: 87000},
        {text: "and skins itch", s: 88000, e: 90000},
        {text: "and bellies beckon", s: 91000, e: 94000},
        {text: "to be sunken once more", s: 95000, e: 99000},
        {text: "into our depths", s: 100000, e: 103000},
        {text: "forgetting that their own swimming victories", s: 103500, e: 107000},
        {text: "have plunged fates deeper towards drowning", s: 107500, e: 110000},
        {text: "than we ever could have- would have- pushed for", s: 110500, e: 114000},
    ]
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
        {x: 0.24, y: 0.44, text: "of composition and moves like water"},
        {x: 0.56, y: 0.40, text: "through river bends, between rocks and then-"},
        {x: 0.83, y: 0.43, text: "into air..."},
        {x: 0.14, y: 0.52, text: "until it is not there"},
        {x: 0.46, y: 0.58, text: "any longer but somewhere, some way else"},
        {x: 0.78, y: 0.62, text: "a bit differently than how you had expected"},
        {x: 0.35, y: 0.67, text: "and I continue"},
        {x: 0.5, y: 0.7, text: "and I invent"},
        {x: 0.65, y: 0.73, text: "and I negotiate"},
        {x: 0.2, y: 0.72, text: "and even still, I move"},
        {x: 0.45, y: 0.77, text: "missing you"},
        {x: 0.7, y: 0.8, text: "until we collide"},
        {x: 0.4, y: 0.85, text: "next."},
        {x: 0.6, y: 0.92, text: "again"},
    ]
}

export default Story;