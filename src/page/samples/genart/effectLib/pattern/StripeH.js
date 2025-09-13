// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function StripeH(params = { nLineCount: 20, sColor1: '#00000033', sColor2: '#FFFFFF33' }) {
    let { nLineCount, sColor1, sColor2 } = params
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    ctx2.lineWidth = ctx.canvas.height / nLineCount
    for (let y = 0; y < nLineCount; y++) {
        ctx2.strokeStyle = y % 2 ? sColor1 : sColor2
        ctx2.beginPath()
        ctx2.moveTo(0, y * ctx2.lineWidth + ctx2.lineWidth / 2)
        ctx2.lineTo(canvas.width, y * ctx2.lineWidth + ctx2.lineWidth / 2)
        ctx2.stroke()
    }
    ctx2.closePath()
    ctx.drawImage(ctx2.canvas, 0, 0)
}