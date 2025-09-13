// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function PolyAbstract(params = { nPixelSize: 35, nRectWidth: 50, nStrokeWidth: .1 }) {
    let { nPixelSize, nRectWidth, nStrokeWidth } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        // let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        ctx.lineWidth = nStrokeWidth;
        ctx.strokeStyle = `rgba(0,0,0,.3)`
        ctx.fillStyle = `rgba(${r},${g},${b},${a / 3})`
        ctx.beginPath()
        ctx.moveTo(x + nRectWidth * (Math.random() - .5) * 2, y + nRectWidth * (Math.random() - .5) * 2)
        ctx.lineTo(x + nRectWidth * (Math.random() - .5) * 2, y + nRectWidth * (Math.random() - .5) * 2)
        ctx.lineTo(x + nRectWidth * (Math.random() - .5) * 5, y + nRectWidth * (Math.random() - .5) * 5)
        ctx.lineTo(x + nRectWidth * (Math.random() - .5) * 2, y + nRectWidth * (Math.random() - .5) * 2)
        ctx.lineTo(x + nRectWidth * (Math.random() - .5) * 2, y + nRectWidth * (Math.random() - .5) * 2)
        ctx.fill();
        ctx.stroke();
        ctx.closePath()
    })
}