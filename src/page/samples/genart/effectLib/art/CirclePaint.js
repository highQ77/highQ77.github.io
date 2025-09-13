// @creator: William77
// @pubdate: 2024/06/29
// @params: true, .35, 0, 0

import { gacore } from "../../gacore.js"

export function CirclePaint(params = { nNoBG: true, nLineWidthFactor: .35, nX: 0, nY: 0 }) {
    let { nNoBG, nLineWidthFactor, nX, nY } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    const ctx3 = gacore.createNewDrawContext(canvas.width, canvas.height)
    if (nNoBG) {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    for (let j = 1; j < 180; j++) {
        for (let i = 0; i < 360; i++) {
            ctx3.beginPath()
            let R = j * 50
            let x = nX + canvas.width * .5 + R * Math.cos(i / 180 * Math.PI)
            let y = nY + canvas.height * .5 + R * Math.sin(i / 180 * Math.PI)
            let x2 = nX + canvas.width * .5 + R * Math.cos((i + 1) / 180 * Math.PI)
            let y2 = nY + canvas.height * .5 + R * Math.sin((i + 1) / 180 * Math.PI)
            let [r, g, b] = gacore.getPixel(ctx2, x, y)
            let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
            ctx3.strokeStyle = `rgba(${r},${g},${b},${1})`
            ctx3.lineWidth = brightness * nLineWidthFactor + 1;
            ctx3.moveTo(x, y)
            ctx3.lineTo(x2, y2)
            ctx3.stroke()
            ctx3.closePath()
        }
    }
    gacore.twoContextBlend(ctx, ctx3, (a, b) => Math.sqrt(a ** 2 + b ** 2))
}