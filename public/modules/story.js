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

    part5Text(p, time) {
        if (time < 120000) {
            p.push();
            p.noStroke();
            p.textSize(p.width * 0.015);
            const fadeTime = 1000;
            let generalFade = 1;
            if (time > 110000) {
                generalFade = 1 - ((time-110000) / 10000);
            }
            //for each line in part 5 add it to a loop
            this._textPart5.forEach(l => {
                if (time >= l.s) {
                    let fade = 1;
                    if (time < l.s + fadeTime) {
                        fade = (time - l.s) / fadeTime
                    }
                    p.fill(0, generalFade*fade*255);
                    p.text(l.text, l.x*p.width, l.y*p.height);
                }
            })
            p.pop();
        }
    }
}


function getBeginText(type) {
    let text;
    switch (type) {
        case "ICE":
            text = [
                "Sculpted stoicism",
                "a gemstone of",
                "feigned rigidity",
                "cold and compressed",
                "braced and unmoved",
                "until this frozen state",
                "I can no longer",
                "adhere",
                "and I begin to tear",
                "My time feels stiller here, stiller than you.",
            ]
            break;
        case "CLOUD":
            text = [
                "Hanging high, squinting so",
                "my view is less of a bird and more of",
                "hazy",
                "dismemberment",
                "I have never liked this part.",
                "But how radiant weightlessness feels here",
                "suspending inevitability with aplomb",
                "I hover",
                "until I can no longer bear such loftiness",
                "My time feels shorter here, shorter than you."
            ]
            break;
        case "PRECIPITATION":
            text = [
                "Free,",
                "fall",
                "I Deluge",
                "mist",
                "glisten",
                "you guess my form, you listen",
                "to hits and thuds",
                "I am thunderous",
                "a cascade of strikes",
                "harsh and still not",
                "hard enough",
                "impact stings me with undo",
                "emphasis of an already",
                "bracing downfall",
                "violent velocity",
                "careful crystals",
                "unrelenting and surely fleeting",
                "I am too much to last",
                "My time passes quickly here, quicker than you."
            ]
            break;
        case "OCEAN":
            text = [
                "I succumb",
                "float",
                "with buoyant spirit",
                "emerging on a surface or diving deep towards a core",
                "appearing boundless",
                "incompatibly colossal",
                "this place- this state- always feels",
                "somewhat ultimate",
                "even though breadth",
                "will not outlast my bounds",
                "My time feels longer here, longer than you.",
            ]
            break;
        case "RIVER":
            text = [
                "Stone thrown and slippery",
                "smoothed and unsalted",
                "slurping and slushing",
                "I sinuate towards what’s next",
                "what’s down",
                "creeping, dripping, draining, gushing towards",
                "an expansive reservoir that reflect hues of sky’s temperament above",
                "I am eager to find my way out",
                "my way through",
                "My time feels similar here, similar to you."
            ]
            break;
        case "AQUIFER":
            text = [
                "Nestled beneath stratas of soil and earth",
                "within aquifers",
                "I defer",
                "an escape for decades",
                "centuries",
                "still, I move",
                "seeping until",
                "my soaking",
                "saturates",
                "until I almost forget",
                "I might exist elsewhere",
                "My time feels vast here, vaster than you.",
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
        {text: "then captured", s: 17000, e: 19500},
        {text: "in high, harsh places", s: 20000, e: 23000},
        {text: "harbored for a silent age until", s: 24000, e: 29000},
        {text: "we crash and gush and bruise", s: 29500, e: 34000},
        {text: "salting wounds", s: 34500, e: 37000},
        {text: "then spread across dizzying depths to", s: 40000, e: 45000},
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

        {text: "Our time chilled feels shorter, further from you.", s: 130000, e: 137000},
        {text: "Our time hotter feels longer, nearer to you.", s: 139000, e: 146000},
        {text: "Our time feels thrown, tousled by you.", s: 148000, e: 157000},
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
        {text: "really, they want to repel and attract, on command, by design ", s: 115000, e: 119000},
        {text: "within a time scale that would crush", s: 120000, e: 123000},
        {text: "our very countenance", s: 123500, e: 126000},
        {text: "a dance continues", s: 130000, e: 133000},
        {text: "much like ours", s: 133500, e: 136000},
        {text: "but with blurry eyes", s: 136500, e: 139000},
        {text: "and shifty feet", s: 140000, e: 143000},
        {text: "and unmeasured pacing", s: 143500, e: 145000},
        {text: "and fallen figures", s: 145500, e: 147000},
        {text: "this is not our chaos of abundant complexity", s: 147500, e: 151000},
        {text: "unpredictable multitudes", s: 152000, e: 155000},
        {text: "and unlocatable intelligence", s: 156000, e: 159000},
        {text: "this is chaos", s: 160000, e: 165000},
        {text: "of flight", s: 166500, e: 168000},
        {text: "of fright", s: 168100, e: 170000},
        {text: "a contemptible complexity", s: 172000, e: 177000},

        {text: "We", s: 230000, e: 231500},
        {text: "Are", s: 232000, e: 233500},
        {text: "Split", s: 234000, e: 235500},
        {text: "Together", s: 236000, e: 238000},
        {text: "Everywhere", s: 238500, e: 240000},
        {text: "I can’t keep track", s: 240500, e: 243000},
        {text: "Keep up", s: 243500, e: 245000},
        {text: "Follow down", s: 245500, e: 247000},
        {text: "It’s weird", s: 247500, e: 249000},
        {text: "We’re, You and I", s: 249500, e: 252000},
        {text: "Everything is churning and I’m not sure how", s: 253000, e: 256000},
        {text: "We collide until", s: 260500, e: 262000},
        {text: "We’re together and then", s: 263000, e: 266000},
        {text: "There’s this thing going on that I can see a corner of but not the", s: 266500, e: 270000},
        {text: "Whole springs dry up", s: 280000, e: 285000},
        {text: "and coastlines crumble", s: 286000, e: 292000},
        {text: "and permafrosts shrink", s: 294000, e: 300000},
        {text: "and oceans widen", s: 305000, e: 310000},
        {text: "and we negotiate", s: 313000, e: 316000},
        {text: "and we invent", s: 317000, e: 320000},
        {text: "and we continue", s: 321000, e: 323000},
        {text: "and we miss each other", s: 324000, e: 328000},
        {text: "if only we hadn’t attracted", s: 334500, e: 339000},
        {text: "how vastly this would have turned out", s: 342500, e: 346000},
        {text: "differently", s: 348500, e: 358000},
    ]
}

function text5Positions() {
    return [
        {x: 0.14, y: 0.08, text: "I am", s: 2000},
        {x: 0.17, y: 0.08, text: "shy", s: 3000},
        {x: 0.35, y: 0.06, text: "by my squinted perspective of", s: 7000},
        {x: 0.85, y: 0.07, text: "befores.", s: 9000},
        {x: 0.2, y: 0.14, text: "Look at myself wide.", s: 10500},
        {x: 0.5, y: 0.11, text: "You- look at me, wider.", s: 13000},
        {x: 0.7, y: 0.15, text: "Narrow in and you’ve lost sight-", s: 17000},
        {x: 0.3, y: 0.22, text: "there is nothing exacting to discover within,", s: 20000},
        {x: 0.5, y: 0.21, text: "only a totality", s: 24000},
        {x: 0.84, y: 0.21, text: "existing nowhere precisely", s: 28000},
        {x: 0.13, y: 0.32, text: "extrapolated never surely", s: 32000},
        {x: 0.5, y: 0.28, text: "impacting fully through fullness,", s: 36000},
        {x: 0.72, y: 0.34, text: "which slips betweens the dots and points", s: 40000},
        {x: 0.24, y: 0.44, text: "of composition and moves like water", s: 44000},
        {x: 0.56, y: 0.40, text: "through river bends, between rocks and then-", s: 48000},
        {x: 0.83, y: 0.43, text: "into air...", s: 54000},
        {x: 0.14, y: 0.52, text: "until it is not there", s: 60000},
        {x: 0.46, y: 0.58, text: "any longer but somewhere, some way else", s: 64000},
        {x: 0.78, y: 0.62, text: "a bit differently than how you had expected", s: 68000},
        {x: 0.35, y: 0.67, text: "and I continue", s: 74000},
        {x: 0.5, y: 0.7, text: "and I invent", s: 76000},
        {x: 0.65, y: 0.73, text: "and I negotiate", s: 78000},
        {x: 0.2, y: 0.72, text: "and even still, I move", s: 81000},
        {x: 0.45, y: 0.77, text: "missing you", s: 85000},
        {x: 0.7, y: 0.8, text: "until we collide", s: 88000},
        {x: 0.4, y: 0.85, text: "next.", s: 92000},
        {x: 0.6, y: 0.92, text: "again", s: 96000},
    ]
}

export default Story;