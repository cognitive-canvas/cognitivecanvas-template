/*
    UI Constants
*/
let blendModeNames = ['Blend', 'Add'];
let primitives = ["Point", "Square"];
let paletteColors = [
    ['#28706A','#314127','#c36a60','#59798c','#9E562F'],
    ['#7a543d','#f4ca38','#c0a689','#614748','#542624'],
]

const paletteNames = [
    "MyPalette1",
    "MyPalette2",
];

/*
    Thumbnail handling. A 512x512 graphics context is created and updated in the draw loop.
*/
let gthumb;
function saveThumbnail() {
    gthumb.canvas.toBlob(function (blob) {
        ccSaveThumbnail(blob);
    });
}

/*
    This is called when the user configuring a live mint is about to publish. Save 
    the parameters and attributes and confirm.
*/
function confirmUpdate() {
    saveParams();
    saveAttributes();
    ccConfirmUpdate();
}

/*
    Configuration file handling. For this arwork, only the paramameter file is updated. If 
    you allow more configuration files, then update appropriately.
*/
let paramsUrl = null;
async function preloadParamUrls() {
  paramsUrl = await ccFetchUrlFromParams("params.json", "application/json");
}

// Shortcut function
function int(v) { return Math.floor(v); }

/*
    Kick everything off on the browser load event.
*/
window.addEventListener("load", async (event) => {

    // palette is the only property that is fixed
    const palette = int(ccrand() * paletteColors.length);
    console.log('palette', palette)

    // Get configuration parameter files
    await preloadParamUrls();
    try {
      if (paramsUrl) {
        const res = await fetch(paramsUrl, { redirect: "follow" });
        if (res.status === 200) {
          const parms = await res.json();
          console.log('got parameters', parms)
          setParameters(parms);
        }
      }
    } catch (e) {}

    // Show the ui if in live mode and resize
    setupLive();

    const sketch = document.getElementById("sketch");
    psk = new Q5(sketch);
    let blendModes = [psk.BLEND, psk.ADD];
    const palettes = paletteColors.map(pal => pal.map(c => psk.color(c)))

    function pickColor(idx) {
        return palettes[palette][colors[idx]];
    }

    function pickPaletteColor(v) {
        const idx = int(v)%palettes[palette].length
        const col = palettes[palette][idx];
        return col;
    }

    // The following handles all the ui interactions.

    captureFullscreenButton();

    captureButtonClick("button-stop", (event, ele) => {
        if (psk._loop) {
            ele.innerHTML = "Start";
            psk.noLoop();
        } else {
            ele.innerHTML = "Pause";
            psk.loop();
        }
    },
    (ele) => {
        ele.innerHTML = psk._loop ? "Pause" : "Start";
    })

    captureRgbColor("background", parameters.background, (e, c) => {
        parameters.background = c;
        saveParams();
    })

    captureButtonClick("button-restart", (event) => {
        restart();
    })

    captureButtonClick("button-setseed", (event) => {
        const strval = getEleValue("seed");
        const val = Number(strval);
        if (isNaN(val)) return;
        const seed = int(val);
        parameters.randSeed = seed;
        setEleValue("seed", `${seed}`);
        console.log('button-setseed', seed);
        saveParams();
        restart();
    })

    setEleValue("seed", `${parameters.randSeed}`);
    captureButtonClick("button-newseed", (event) => {
        newRandSeed();
        setEleValue("seed", `${parameters.randSeed}`);
        saveParams();
        restart();
    })

    captureSelect("outlineColor", paletteColors[palette], parameters.outlineColor, (e, idx) => {
        parameters.outlineColor = idx;
        saveParams();
    });

    captureSelect("primitive", primitives, parameters.primitive, (e, idx) => {
        parameters.primitive = idx;
        saveParams();
    });


    captureSelect("blendMode", blendModeNames, parameters.blendMode, (e, idx) => {
        parameters.blendMode = idx;
        saveParams();
    });

    // shortcut to handle the rest of the numeric inputs.
    captureNumericInputs([
        'loop', 
        'loopIterations', 
        'size', 
        'maskCircles',
        'maskSeed',
        'maskRadiusLow',
        'maskRadiusHigh',
        'maskCircleStart',
        'maskCircleEnd',
        'outlineWeight',
        'outlineAlpha',
    ])

    let i = 0;
    let g1;

    let maskCircles;
    let maskSeed;
    let maskRadiusLow;
    let maskRadiusHigh;
    let maskCircleStart;
    let maskCircleEnd;

    let prim;
    let size;
    let blendMode;

    let loop;
    let loopIterations;

    let colors;
    let background;

    let outlineAlpha;
    let outlineWeight;
    let outlineColor;

    function p5ToHex(col) {
        return hexColor([psk.red(col), psk.green(col), psk.blue(col)]);
    }

    function setLoopVars() {
        // drawing is based on our randSeed paramter, which the user can modify
        psk.randomSeed(parameters.randSeed);
        psk.noiseSeed(parameters.randSeed);

        colors = parameters.colors.length > 0 ? parameters.colors : Array.from({ length: palettes[palette].length }, (_, i) => i),

        prim = parameters.primitive;
        blendMode = blendModes[parameters.blendMode];
        size = parameters.size;
        background = parameters.background;

        maskRadiusLow = parameters.maskRadiusLow;
        maskRadiusHigh = parameters.maskRadiusHigh;
        maskCircleStart = parameters.maskCircleStart;
        maskCircleEnd = parameters.maskCircleEnd;
        maskCircles =  parameters.maskCircles,
        maskSeed = psk.random() * 9999999;
    
        outlineAlpha = parameters.outlineAlpha;
        outlineWeight = parameters.outlineWeight;
        outlineColor = parameters.outlineColor;

        loop = parameters.loop;
        loopIterations = parameters.loopIterations;

        attributes = [
            {
                trait_type: "Palette",
                value: paletteNames[palette],
            },
            {
                trait_type: "Colors",
                value: colors.map(i => p5ToHex(pickColor(i))).join(','),
            },
            {
                trait_type: "Background",
                value: hexColor(background),
            },
            {
                trait_type: "BlendMode",
                value: blendModeNames[parameters.blendMode],
            },
            {
                trait_type: "Primitive",
                value: primitives[prim],
            },
            {
                trait_type: "Size",
                value: size.toString(),
            },
            {
                trait_type: "OutlineAlpha",
                value: outlineAlpha.toString(),
            },
            {
                trait_type: "OutlineColor",
                value: pickPaletteColor(outlineColor),
            },
            {
                trait_type: "OutlineWeight",
                value: outlineWeight.toString(),
            },
            {
                trait_type: "MaskCircles",
                value: maskCircles.toString(),
            },
            {
                trait_type: "MaskRadiusLow",
                value: maskRadiusLow.toString(),
            },
            {
                trait_type: "MaskRadiusHigh",
                value: maskRadiusHigh.toString(),
            },
            {
                trait_type: "MaskCircleStart",
                value: maskCircleStart.toString(),
            },
            {
                trait_type: "Loop",
                value: loop.toString(),
            },
            {
                trait_type: "LoopIterations",
                value: loopIterations.toString(),
            },
            {
                trait_type: "RandSeed",
                value: parameters.randSeed.toString(),
            },
        ]

        //console.log('attrs', attributes)
    }

    function setBackground(g) {
        g.background(parameters.background[0],parameters.background[1],parameters.background[2]);
    }

    function drawCircle(g, x, y, r) {
        g.circle(x, y, 2 * r);
    }

    function loopInit() {
        setLoopVars();
        setBackground(psk);
        setBackground(g1);
        i = 0;
    }

    function restart() {
        loopInit();
        psk.loop();
    }

    psk.setup = function () {
        const { width, height } = resizeParams();
        psk.createCanvas(width, height);
        g1 = psk.createGraphics(width, height);
        gthumb = psk.createGraphics(512, 512);
        loopInit();
    };

    // incrementally draw. Does loopIterations at a time
    function drawOneIteration(g) {

        for (let i = 0; i < loopIterations; i++) {
            let x = psk.random(g.width * 2);
            let y = psk.random(g.height * 2);
            let noiseVal = psk.noise(x * 0.01, y * 0.01);
            let idx = int(noiseVal * colors.length);
            let col = pickPaletteColor(idx);
            const n = psk.random(1);
            switch (prim) {
                case 0: //point
                    g.stroke(psk.red(col), psk.green(col), psk.blue(col), Math.max(128, int(n * 255)));
                    g.strokeWeight(size);
                    g.point(x, y);
                    break;
                case 1: //square
                    g.fill(psk.red(col), psk.green(col), psk.blue(col), Math.max(128, int(n * 255)));
                    g.noStroke();
                    g.square(x, y, size);
                    break;
            }
        }
    }

    // Draw the final outline
    function drawOutline() {
        psk.noFill();
        psk.strokeWeight(outlineWeight);
        psk.randomSeed(maskSeed);
        drawCirclesOutline();
        psk.randomSeed(ccrand()*99999)
        psk.noStroke();
    }

    // Draw circle outlines
    function drawCirclesOutline() {
        const col = pickPaletteColor(outlineColor);
        for (let i = 0; i < maskCircles; i++) {
            const x = psk.random(maskCircleStart * psk.width, psk.width * maskCircleEnd);
            const y = psk.random(maskCircleStart * psk.height, psk.height * maskCircleEnd);
            const r = psk.random(maskRadiusLow, maskRadiusHigh);
            psk.stroke(psk.red(col), psk.green(col), psk.blue(col), outlineAlpha);
            drawCircle(psk, x, y, r);
        }
    }


    // Renders incrementally loop time, with loopIterations each time. Handles the starting and stopping of the draw
    // loop and also handles thumbnail generation.
    psk.draw = function () {

        if (i > loop) {
            psk.noLoop();
            return;
        }

        psk.background(background);

        drawOneIteration(g1);
        psk.image(g1, 0, 0);

        // Draw the outline and thumbnail on the last loop. Otherwise a progress message.
        if (i == loop) {
            psk.noLoop();
            drawOutline();
            gthumb.image(psk, 0, 0, gthumb.width, gthumb.height, 0, 0, psk.width*2, psk.height*2);
        } else if (i < loop - 1) {
            const textColor = psk.color(255 - parameters.background[0], 255 - parameters.background[1], 255 - parameters.background[2]);
            psk.fill(textColor);
            psk.text(`Palette ${paletteNames[palette]}, ${i} of ${loop}`, 20, 20);
            psk.noFill();    
        }
        i++;
    };

    // Basic key handling
    psk.keyPressed = (e) => {
        if (e.key === 'd') {
            download();
        } else if (e.key === 's')
            i = parameters.loopIterations; 
        else if (e.key === 'r')
            restart(); 
    }

    // Get a full res image
    function download() {
        const p = int(Math.random() * 999999).toString();
        psk.saveCanvas(`cognitive-template-${p}`, 'png');
    }
    
});
