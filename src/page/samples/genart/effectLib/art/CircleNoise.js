// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js";

export function CircleNoise(params = { nPixelSize: 20, nWidthFactor: .25, nHeightFactor: .1, nPowFactor: 1.2, nLineWidth: 2, sStrokeStyle: `rgba(0,0,0,.5)` }) {
    let { nPixelSize, nWidthFactor, nHeightFactor, nPowFactor, nLineWidth, sStrokeStyle } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        ctx.strokeStyle = sStrokeStyle
        ctx.lineWidth = nLineWidth
        ctx.fillStyle = `rgba(${r},${g},${b},${.7})`
        ctx.beginPath()
        ctx.ellipse(x, y, (brightness * nWidthFactor) ** nPowFactor, (brightness * nHeightFactor) ** nPowFactor, Math.random() * 2 * Math.PI, 0, 360)
        ctx.fill()
        ctx.stroke()
    })
    ctx.closePath()
}
