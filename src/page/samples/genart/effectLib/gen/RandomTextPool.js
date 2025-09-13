// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js";

export function RandomTextPool(params = { nPixelSize: 100, sDisplayText: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', sFont: 'Impact', nSize: 300 }) {
    let { nPixelSize, sDisplayText, sFont, nSize } = params
    const ctx = gacore.getMainDrawContext()
    const ctx2 = gacore.createNewDrawContext(ctx.canvas.width, ctx.canvas.height)
    ctx2.drawImage(ctx.canvas, 0, 0)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    let newText = sDisplayText.split('')
    let newIdx = 0
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.font = (14 + nSize * Math.random()) + "px " + sFont;
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(2 * Math.PI * Math.random())
        ctx.translate(-x, -y)
        ctx.fillText(newText[newIdx], x, y)
        ctx.restore()
        newIdx++
        if (newIdx > newText.length - 1) newIdx = 0
    })
}