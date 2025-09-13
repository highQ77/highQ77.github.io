// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function Pyramid(params = { nPixelSize: 100, sColorArray: ['#33333377', '#66666677', '#99999977', '#CCCCCC77'] }) {
    let { nPixelSize, sColorArray } = params
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {

        ctx.beginPath()
        ctx.fillStyle = sColorArray[0]
        ctx.moveTo(x, y)
        ctx.lineTo(x + nPixelSize, y)
        ctx.lineTo(x + nPixelSize / 2, y + nPixelSize / 2)
        ctx.lineTo(x, y)
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = sColorArray[1]
        ctx.moveTo(x + nPixelSize, y)
        ctx.lineTo(x + nPixelSize, y + nPixelSize)
        ctx.lineTo(x + nPixelSize / 2, y + nPixelSize / 2)
        ctx.lineTo(x + nPixelSize, y)
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = sColorArray[2]
        ctx.moveTo(x + nPixelSize, y + nPixelSize)
        ctx.lineTo(x, y + nPixelSize)
        ctx.lineTo(x + nPixelSize / 2, y + nPixelSize / 2)
        ctx.lineTo(x + nPixelSize, y + nPixelSize)
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.fillStyle = sColorArray[3]
        ctx.moveTo(x, y + nPixelSize)
        ctx.lineTo(x, y)
        ctx.lineTo(x + nPixelSize / 2, y + nPixelSize / 2)
        ctx.lineTo(x, y + nPixelSize)
        ctx.fill()
        ctx.closePath()
    })
}