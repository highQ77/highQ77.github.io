// @creator: William77
// @pubdate: 2024/06/05 

import { gacore } from "../../gacore.js"

export function Dot(params = { bNoBG: true, nPixelSize: 50, nThreshold: .5, nRed1: 255, nGreen1: 0, nBlue1: 0, nRed2: 0, nGreen2: 125, nBlue2: 250 }) {
    let { bNoBG, nPixelSize, nThreshold, nRed1, nGreen1, nBlue1, nRed2, nGreen2, nBlue2 } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const whiteContext = gacore.createNewDrawContext(canvas.width, canvas.height)
    const blackContext = gacore.createNewDrawContext(canvas.width, canvas.height)
    const dot4WhiteContext = gacore.createNewDrawContext(canvas.width, canvas.height)
    const dot4BlackContext = gacore.createNewDrawContext(canvas.width, canvas.height)
    const tmp4WhiteContext = gacore.createNewDrawContext(canvas.width, canvas.height)
    const tmp4BlackContext = gacore.createNewDrawContext(canvas.width, canvas.height)
    // black/white
    gacore.perPixelHandler(ctx, 1, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        if (brightness >= nThreshold * 100) brightness = 100
        else brightness = 0
        if (brightness == 100) {
            whiteContext.fillStyle = `black`
            whiteContext.fillRect(x, y, 1, 1)
        } else {
            blackContext.fillStyle = `black`
            blackContext.fillRect(x, y, 1, 1)
        }
    })

    // color1 dot canvas
    gacore.perPixelHandler(ctx, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        dot4WhiteContext.fillStyle = `rgba(${nRed1},${nGreen1},${nBlue1},${1})`
        dot4WhiteContext.beginPath();
        dot4WhiteContext.arc(x + (nPixelSize >> 1), y + (nPixelSize >> 1), (nPixelSize >> 1) * brightness / 100, 0, 2 * Math.PI);
        dot4WhiteContext.fill();
    })
    dot4WhiteContext.drawImage(blackContext.canvas, 0, 0)

    // color2 dot canvas
    gacore.perPixelHandler(ctx, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        dot4BlackContext.fillStyle = `rgba(${nRed2},${nGreen2},${nBlue2},${1})`
        dot4BlackContext.beginPath();
        dot4BlackContext.arc(x + (nPixelSize >> 1), y + (nPixelSize >> 1), (nPixelSize >> 1) * brightness / 100, 0, 2 * Math.PI);
        dot4BlackContext.fill();
    })
    dot4BlackContext.drawImage(whiteContext.canvas, 0, 0)

    // 去背 white
    gacore.perPixelHandler(dot4WhiteContext, 1, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        if (brightness != 0) {
            tmp4WhiteContext.fillStyle = `rgba(${nRed1},${nGreen1},${nBlue1},${1})`
            tmp4WhiteContext.fillRect(x, y, 1, 1)
        }
    })

    // 去背 black
    gacore.perPixelHandler(dot4BlackContext, 1, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        if (brightness != 0) {
            tmp4BlackContext.fillStyle = `rgba(${nRed2},${nGreen2},${nBlue2},${1})`
            tmp4BlackContext.fillRect(x, y, 1, 1)
        }
    })
    if (bNoBG) {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    tmp4WhiteContext.drawImage(tmp4BlackContext.canvas, 0, 0)
    ctx.drawImage(tmp4WhiteContext.canvas, 0, 0)
}