// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function MicroRect(params = { nPixelSize: 30, nStrokeWidth: 15 }) {
    let { nPixelSize, nStrokeWidth } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        ctx.lineWidth = nStrokeWidth;
        ctx.strokeStyle = `rgba(${r},${g},${b},${a * .05})`
        let nFactor = .1
        let s = saturation / 50
        ctx.beginPath()
        ctx.moveTo(x - brightness * s * nFactor, y - brightness * s * nFactor)
        ctx.lineTo(x + brightness * s * nFactor, y - brightness * s * nFactor)
        ctx.lineTo(x + brightness * s * nFactor, y + brightness * s * nFactor)
        ctx.lineTo(x - brightness * s * nFactor, y + brightness * s * nFactor)
        ctx.moveTo(x - brightness * s * nFactor, y - brightness * s * nFactor)
        ctx.stroke();
    })
}