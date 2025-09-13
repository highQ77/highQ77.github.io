// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function Fur(params = { bNoBG: true, nPixelSize: 15, nLineLen: 10, nStrokeWidthFactor: .1, bBlendWith: false, nBlendMult: 1, nOffsetX: 0, nOffsetY: 0 }) {
    let { bNoBG, nPixelSize, nLineLen, nStrokeWidthFactor, bBlendWith, nBlendMult, nOffsetX, nOffsetY } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    if (bNoBG) {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        ctx.strokeStyle = `rgba(${r},${g},${b},${a})`
        ctx.lineWidth = brightness / 100 * nPixelSize * nStrokeWidthFactor;
        ctx.beginPath()
        ctx.moveTo(x, y)
        let newX = x + (nPixelSize + nLineLen) * Math.cos(brightness / 100 * Math.PI * 2)
        let newY = y + (nPixelSize + nLineLen) * Math.sin(brightness / 100 * Math.PI * 2)
        if (nOffsetX) newX += nOffsetX
        if (nOffsetY) newY += nOffsetY
        ctx.lineTo(newX, newY)
        ctx.stroke();
        ctx.closePath()
    })
    if (bBlendWith)
        gacore.twoContextBlend(ctx, ctx2, (a, b) => (a + b) * nBlendMult)
}