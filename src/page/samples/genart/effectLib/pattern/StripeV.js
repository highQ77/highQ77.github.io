// @creator: William77
// @pubdate: 2024/06/05
// @params: 20

import { gacore } from "../../gacore.js"

export function StripeV(params = { nLineCount: 20, sColor1: '#00000033', sColor2: '#FFFFFF33' }) {
    let { nLineCount, sColor1, sColor2 } = params
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    ctx2.lineWidth = ctx.canvas.width / nLineCount
    for (let x = 0; x < nLineCount; x++) {
        ctx2.strokeStyle = x % 2 ? sColor1 : sColor2
        ctx2.beginPath()
        ctx2.moveTo(x * ctx2.lineWidth + ctx2.lineWidth / 2, 0)
        ctx2.lineTo(x * ctx2.lineWidth + ctx2.lineWidth / 2, canvas.height)
        ctx2.stroke()
    }
    ctx2.closePath()
    ctx.drawImage(ctx2.canvas, 0, 0)
}