// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function Circle(params = { bNoBG: true, nPixelSize: 20, nRadiusMultiplier: .6, nStrokeWidthMultiplier: 1 }) {
    let { bNoBG, nPixelSize, nRadiusMultiplier, nStrokeWidthMultiplier } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    if (bNoBG) {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    const infos = []
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        infos.push({ x, y, r, g, b, a, hue, saturation, brightness })
    })
    infos.sort(() => Math.random() - 0.5);
    infos.forEach(i => {
        let { x, y, r, g, b, a, hue, saturation, brightness } = i
        ctx.strokeStyle = `rgba(${r},${g},${b},${a})`
        const R = brightness * nRadiusMultiplier
        ctx.lineWidth = brightness / 20 * nStrokeWidthMultiplier
        ctx.beginPath()
        ctx.arc(x, y, R, 0, 2 * Math.PI, false)
        ctx.stroke()
        ctx.closePath()
    })
}