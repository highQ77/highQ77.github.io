// @creator: William77
// @pubdate: 2024/06/05
// @params: 50, 100, false

import { gacore } from "../../gacore.js";

export function RandomLines(params = { nCount: 50, nMaxLineWidth: 100, bDashed: false }) {
    let { nCount, nMaxLineWidth, bDashed } = params
    const ctx = gacore.getMainDrawContext()
    for (let j = 0; j < nCount; j++) {
        let x = ctx.canvas.width * Math.random()
        let x2 = ctx.canvas.width * Math.random()
        let y = ctx.canvas.height * Math.random()
        let y2 = ctx.canvas.height * Math.random()
        if (bDashed)
            ctx.setLineDash([100 * Math.random(), 100 * Math.random(), 100 * Math.random(), 100 * Math.random(), 100 * Math.random()])
        ctx.strokeStyle = `rgba(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()},${1})`
        ctx.lineWidth = nMaxLineWidth * Math.random()
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x2, ctx.canvas.height)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(ctx.canvas.height, y2)
        ctx.stroke()
    }
}