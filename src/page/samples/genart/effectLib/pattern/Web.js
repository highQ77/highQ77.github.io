// @creator: William77
// @pubdate: 2024/06/05
// @params: true, 100, 10, 10

import { gacore } from "../../gacore.js"

export function Web(params = { bNoBG: true, nPixelSize: 50, nLineWidth: 5, nLineGap: 10 }) {
    let { bNoBG, nPixelSize, nLineWidth, nLineGap } = params
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    if (bNoBG) {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    let count = 0
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let state = (count % 2) ?
            [x + nLineGap, y + nLineGap, x + nPixelSize - nLineGap, y + nPixelSize - nLineGap] :
            [x - nLineGap + nPixelSize, y + nLineGap, x + nLineGap, y + nPixelSize - nLineGap];
        let [x1, y1, x2, y2] = state
        ctx.beginPath()
        ctx.lineWidth = nLineWidth
        ctx.strokeStyle = `rgba(${r * 2},${g * 2},${b * 2},${a})`
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.closePath()
        count++
    })
}