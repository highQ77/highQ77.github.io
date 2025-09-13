// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js";

export function CircleStack(params = { nWidth: 1500, nCount: 10, nDegree: 20 }) {
    let { nWidth, nCount, nDegree } = params

    const ctx = gacore.getMainDrawContext()
    const ctx2 = gacore.createNewDrawContext(ctx.canvas.width, ctx.canvas.height)
    ctx2.drawImage(ctx.canvas, 0, 0)
    const ctx3 = gacore.createNewDrawContext(ctx.canvas.width, ctx.canvas.height)
    for (let i = 0; i < nCount; i++) {
        ctx3.save()
        ctx3.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
        ctx3.rotate(nDegree * i / 180 * Math.PI)
        ctx3.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2)
        ctx3.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx3.beginPath()
        ctx3.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, nWidth - i * nWidth / nCount, 0, 2 * Math.PI)
        ctx3.closePath()
        // ctx3.stroke()
        ctx3.clip()
        ctx3.drawImage(ctx2.canvas, 0, 0)
        ctx3.restore()
        ctx.drawImage(ctx3.canvas, 0, 0)
    }
}
