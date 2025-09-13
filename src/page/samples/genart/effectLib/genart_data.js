export let genart_data = {
    AbstractPaint: {
        params: { nPixelSize: 50, nR: 35, nWidthFactor: .25, nHeightFactor: .1666 },
        help: { nPixelSize: 'pixel size', nR: 'stain radius', nWidthFactor: 'width factor', nHeightFactor: 'height factor' },
    },
    ArcMatrix: {
        params: { nPixelSize: 50, nLineWidth: 50 },
        help: { nPixelSize: 'pixel size', nLineWidth: 'radius of pixel' },
    },
    Ascii2D: {
        params: { nPixelSize: 30, sFontFamily: 'arial', sFontSize: '24px', bShowBG: false },
        help: { nPixelSize: 'pixel size', sFontFamily: 'font family', sFontSize: 'font size', bShowBG: 'show background' },
    },
    Bloom: {
        params: { nBlurVal: 20, nMult: 1.0 },
        help: { nBlurVal: 'blur size', nMult: 'blend mode multiply' },
    },
    Circle: {
        params: { bNoBG: true, nPixelSize: 20, nRadiusMultiplier: .6, nStrokeWidthMultiplier: 1 },
        help: { bNoBG: 'not display background', nPixelSize: 'pixel size', nRadiusMultiplier: 'radius multiplier', nStrokeWidthMultiplier: 'stroke width multiplier' },
    },
    CircleNoise: {
        params: { nPixelSize: 20, nWidthFactor: .25, nHeightFactor: .1, nPowFactor: 1.2, nLineWidth: 2, sStrokeStyle: `rgba(0,0,0,.5)` },
        help: { nPixelSize: 'pixel size', nWidthFactor: 'width factor', nHeightFactor: 'height factor', nPowFactor: 'pow factor', nLineWidth: 'line width', sStrokeStyle: 'stroke style' },
    },
    CirclePaint: {
        params: { nNoBG: true, nLineWidthFactor: .35, nX: 0, nY: 0 },
        help: { nNoBG: 'not display background', nLineWidthFactor: 'line width factor', nX: 'x offset', nY: 'y offset' },
    },
    CirclePaint2: {
        params: { nNoBG: true, nLineWidthFactor: .35, nX: 0, nY: 0, nRadiusFactor: 1.0 },
        help: { nNoBG: 'not display background', nLineWidthFactor: 'line width factor', nX: 'x offset', nY: 'y offset', nRadiusFactor: 'radius factor' }
    },
    CircleRadial: {
        params: { bNoBG: true, nPixelSize: 150, nLineLen: 1000, nCircleWidth: 200, bBlendWith: false, nBlendMult: 1 },
        help: { bNoBG: 'not display background', nPixelSize: 'pixel size', nLineLen: 'line length', nCircleWidth: 'circle width', bBlendWith: 'is blend?', nBlendMult: 'blend mutiplier' }
    },
    CircleStack: {
        params: { nWidth: 1500, nCount: 10, nDegree: 20 },
        help: { nWidth: 'width', nCount: 'count of circles', nDegree: 'degree' }
    },
    CSSBlur: {
        params: { nBlurVal: 20 },
        help: { nBlurVal: 'blur value' },
    },
    CSSBrightness: {
        params: { nBrightnessVal: 3 },
        help: { nBrightnessVal: 'brightness value' },
    },
    CSSContrast: {
        params: { nContrastVal: 2.0 },
        help: { nContrastVal: 'contrast value' },
    },
    CSSGrayscale: {
        params: { nGrayscaleVal: .5 },
        help: { nGrayscaleVal: 'grayscale value' }
    },
    CSSHueRotate: {
        params: { nDegreeVal: 90 },
        help: { nDegreeVal: 'rotate degree' }
    },
    CSSInvert: {
        params: {},
        help: {}
    },
    CSSSaturate: {
        params: { nSaturateVal: .5 },
        help: { nSaturateVal: 'saturation value' }
    },
    Dot: {
        params: { bNoBG: true, nPixelSize: 50, nThreshold: .5, nRed1: 255, nGreen1: 0, nBlue1: 0, nRed2: 255, nGreen2: 125, nBlue2: 0 },
        help: { bNoBG: 'not display background', nPixelSize: 'pixel size', nThreshold: 'threshold', nRed1: 'red', nGreen1: 'green', nBlue1: 'blue', nRed2: 'red2', nGreen2: 'green2', nBlue2: 'blue2' }
    },
    Duotone: {
        params: { nPixelSize: 2, nThreshold: .5, nRed1: 255, nGreen1: 255, nBlue1: 0, nRed2: 60, nGreen2: 60, nBlue2: 60 },
        help: { nPixelSize: 'pixel size', nThreshold: 'threshold', nRed1: 'red', nGreen1: 'green', nBlue1: 'blue', nRed2: 'red2', nGreen2: 'green2', nBlue2: 'blue2' }
    },
    Edge: {
        params: { kernelLevel: 8 },
        help: { kernelLevel: 'level' }
    },
    EdgeCircle: {
        params: { bNoBG: true, nPixelSize: 2, nThreshold: 0.5, nRadius: 200, nRed: 255, nGreen: 255, nBlue: 255, nAlpha: 0.1 },
        help: { bNoBG: 'not display background', nPixelSize: 'pixel size', nThreshold: 'threshold', nRadius: 'radius', nRed: 'red', nGreen: 'green', nBlue: 'blue', nAlpha: 'alpha' }
    },
    Emoji: {
        params: { bNoBG: true, nPixelSize: 20, nThreshold: .5, nFontSizeMutiplier: .8 },
        help: { bNoBG: 'not display background', nPixelSize: 'pixel size', nThreshold: 'threshold', nFontSizeMutiplier: 'font size mutiplier' }
    },
    EmojiCustom: {
        params: { bNoBG: true, nPixelSize: 55, sEmoji: '😀', nThreshold: .3, nFontSizeMutiplier: .8, nAlphaMutiplier: 1 },
        help: { bNoBG: 'not display background', nPixelSize: 'pixel size', sEmoji: 'emoji string', nThreshold: 'threshold', nFontSizeMutiplier: 'font size mutiplier', nAlphaMutiplier: 'alpha mutiplier' }
    },
    EmojiMatrix: {
        params: { bNoBG: true, nPixelSize: 30, aEmojisArr: ['❤️', '🟠', '😃', '🤢', '🥶', '👿'], nFontSize: 30, nHueOffset: 50 },
        help: { bNoBG: 'not display background', nPixelSize: 'pixel size', aEmojisArr: 'emoji symbol array', nFontSize: 'font size', nHueOffset: 'hue offset 0 ~ 360' }
    },
    Explode: {
        params: { bNoBG: false, nPixelSize: 90, nLineLen: 200, nStrokeWidthFactor: 2, nPetalCount: 5, nPetalSize: 10, bBlendWith: false, nBlendMult: 1 },
        help: { bNoBG: 'not display background', nPixelSize: 'pixel size', nLineLen: 'explode ray length', nStrokeWidthFactor: 'stroke width factor', nPetalCount: 'petal count', nPetalSize: 'petal size', bBlendWith: 'is blend?', nBlendMult: 'blend mutiplier' }
    },
    Fur: {
        params: { bNoBG: true, nPixelSize: 15, nLineLen: 20, nStrokeWidthFactor: .1, bBlendWith: true, nBlendMult: 1, nOffsetX: 0, nOffsetY: 0 },
        help: { bNoBG: 'not display background', nPixelSize: 'pixel size', nLineLen: 'fur length', nStrokeWidthFactor: 'stroke width factor', bBlendWith: 'is blend', nBlendMult: 'blend mutiplier', nOffsetX: 'offsetX', nOffsetY: 'offsetY' }
    },
    GlowRay: {
        params: { nScaleOffset: 5, nScaleOffsetCount: 20 },
        help: { nScaleOffset: 'more than 1', nScaleOffsetCount: 'loop draw times' }
    },
    Kaleidoscope: {
        params: { stepCount: 12, R: 1500 },
        help: { stepCount: 'more than 1', R: 'radius' }
    },
    Kaleidoscope2: {
        params: { stepCount: 12, R: 1500 },
        help: { stepCount: 'more than 1', R: 'radius' }
    },
    Level: {
        params: { nPixelSize: 2, nSplitLevel: 3, nRedFactor: 1, nGreenFactor: .1, nBlueFactor: .1 },
        help: { nPixelSize: 'pixel size', nSplitLevel: 'level count', nRedFactor: 'red factor', nGreenFactor: 'green factor', nBlueFactor: 'blue factor' }
    },
    LevelAssign: {
        params: { nPixelSize: 2, aColorArr: ['orange', 'pink', 'yellow'] },
        help: { nPixelSize: 'pixel size', aColorArr: 'color array' }
    },
    LevelColor: {
        params: { nPixelSize: 2, nSplitLevel: 5 },
        help: { nPixelSize: 'pixel size', nSplitLevel: 'level count' }
    },
    LevelRandom: {
        params: { nPixelSize: 2, nSplitLevel: 5, bBlackBG: false },
        help: { nPixelSize: 'pixel size', nSplitLevel: 'level count', bBlackBG: 'is black background?' }
    },
    MicroRect: {
        params: { nPixelSize: 30, nStrokeWidth: 15 },
        help: { nPixelSize: 'pixel size', nStrokeWidth: 'stroke width' }
    },
    Noise: {
        params: { nPixelSize: 2, nRedFactor: 2, nGreenFactor: 1, nBlueFactor: 0, nAlphaFactor: 1 },
        help: { nPixelSize: 'pixel size', nRedFactor: 'red factor', nGreenFactor: 'green factor', nBlueFactor: 'blue factor', nAlphaFactor: 'alpha factor' }
    },
    Pixelate: {
        params: { nPixelSize: 12 },
        help: { nPixelSize: 'pixel size' }
    },
    PolyAbstract: {
        params: { nPixelSize: 35, nRectWidth: 50, nStrokeWidth: .1 },
        help: { nPixelSize: 'pixel size', nRectWidth: 'rect width', nStrokeWidth: 'stroke width' }
    },
    PolyGradient: {
        params: { nPixelSize: 65, nRectWidth: 100, nStrokeWidth: .1, nFactor: .8, sColorOverlay: '#FC0' },
        help: { nPixelSize: 'pixel size', nRectWidth: 'rect width', nStrokeWidth: 'stroke width', nFactor: 'factor', sColorOverlay: 'overlay color' }
    },
    Rain: {
        params: { nNoBG: true, nPixelSize: 60, nStrokeWidthFactor: .5 },
        help: { nNoBG: 'not display background', nPixelSize: 'pixel size', nStrokeWidthFactor: 'stroke width factor' }
    },
    SVGGlass: {
        params: { nX: 0, nY: 0, nScaleVal: 1000 },
        help: { nX: 'x', nY: 'y', nScaleVal: 'scale value' }
    },
    SVGTurb: {
        params: { nFrequency: 0.006, nScale: 50, bRandomChannel: false },
        help: { nFrequency: 'frequency', nScale: 'scale', bRandomChannel: 'random channel flag' },
    },
}