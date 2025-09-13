// @creator: William77
// @pubdate: 2024/06/05
// @params: 50, 100

import { gacore } from "../../gacore.js";

export function RandomRects(params = { nCount: 50, nMaxRectWidth: 100 }) {
    let { nCount, nMaxRectWidth } = params
    const ctx = gacore.getMainDrawContext()
    ctx.strokeStyle = 'black'
    for (let j = 0; j < nCount; j++) {
        let x = ctx.canvas.width * Math.random()
        let y = ctx.canvas.height * Math.random()
        ctx.lineWidth = 10 + nMaxRectWidth * Math.random() / 3
        ctx.beginPath()
        let r = nMaxRectWidth * Math.random() + 50
        ctx.rect(x, y, r, r)
        ctx.stroke()
    }
    ctx.closePath()
}