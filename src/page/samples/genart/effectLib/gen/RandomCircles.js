// @creator: William77
// @pubdate: 2024/06/05
// @params: 50, 100

import { gacore } from "../../gacore.js";

export function RandomCircles(params = { nCount: 50, nMaxCircleWidth: 100 }) {
    let { nCount, nMaxCircleWidth } = params
    const ctx = gacore.getMainDrawContext()
    for (let j = 0; j < nCount; j++) {
        let x = ctx.canvas.width * Math.random()
        let y = ctx.canvas.height * Math.random()
        ctx.lineWidth = 10 + nMaxCircleWidth * Math.random() / 3
        ctx.beginPath()
        ctx.arc(x, y, nMaxCircleWidth * Math.random() + 50, 0, 2 * Math.PI)
        ctx.stroke()
    }
}