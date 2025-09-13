// @creator: William77
// @pubdate: 2024/06/05
// @params: 100, 100

import { gacore } from "../../gacore.js";

export function RandomLinesVH(params = { nCount: 50, nMaxLightWidth: 100 }) {
    let { nCount, nMaxLightWidth } = params
    const ctx = gacore.getMainDrawContext()
    for (let j = 0; j < nCount; j++) {
        let x = ctx.canvas.width * Math.random()
        let y = ctx.canvas.height * Math.random()
        ctx.strokeStyle = `rgba(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()},${1})`
        ctx.lineWidth = nMaxLightWidth * Math.random()
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, ctx.canvas.height)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(ctx.canvas.height, y)
        ctx.stroke()
    }
    ctx.closePath()
}