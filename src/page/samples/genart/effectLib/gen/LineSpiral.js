// @creator: William77
// @pubdate: 2024/06/05
// @params: 10, 'white', .5, 1000

import { gacore } from "../../gacore.js";

export function LineSpiral(params = { nLineWidth: 10, sColor: 'white', nR: .5, nLoopCount: 1000 }) {
    let { nLineWidth, sColor, nR, nLoopCount } = params
    const ctx = gacore.getMainDrawContext()
    ctx.strokeStyle = sColor
    ctx.lineWidth = nLineWidth
    ctx.beginPath()
    ctx.moveTo(ctx.canvas.width / 2, ctx.canvas.height / 2)
    for (let i = 0; i < nLoopCount; i++) {
        let x = ctx.canvas.width / 2 + i * nR * Math.cos(i % 360 / 180 * Math.PI)
        let y = ctx.canvas.height / 2 + i * nR * Math.sin(i % 360 / 180 * Math.PI)
        ctx.lineTo(x, y)
    }
    ctx.stroke()
}