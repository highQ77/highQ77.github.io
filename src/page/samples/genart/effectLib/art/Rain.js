// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function Rain(params = { nNoBG: true, nPixelSize: 60, nStrokeWidthFactor: .5 }) {
    let { nNoBG, nPixelSize, nStrokeWidthFactor } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    if (nNoBG) {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        ctx.strokeStyle = `rgba(${r},${g},${b},${brightness / 100})`
        ctx.lineWidth = brightness * 0.01 * nPixelSize * nStrokeWidthFactor
        ctx.beginPath()
        ctx.moveTo(x, y)
        let newX = x + (nPixelSize)
        let newY = y + (nPixelSize)
        ctx.lineTo(newX, newY)
        ctx.stroke();
        ctx.closePath()
    })
}