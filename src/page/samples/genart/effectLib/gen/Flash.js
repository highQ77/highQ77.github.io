// @creator: William77
// @pubdate: 2024/06/05
// @params: 100, 100

import { gacore } from "../../gacore.js";

export function Flash(params = { nCount: 100, nMaxLightWidth: 100 }) {
    let { nCount, nMaxLightWidth } = params
    let foldCount = 30
    const ctx = gacore.getMainDrawContext()
    for (let j = 0; j < nCount; j++) {
        let x = ctx.canvas.width * Math.random()
        ctx.strokeStyle = `rgba(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()},${1})`
        ctx.lineWidth = nMaxLightWidth * Math.random()
        ctx.beginPath()
        ctx.moveTo(x, 0)
        for (let i = -1; i <= foldCount; i++) {
            ctx.lineTo(x + 100 * (Math.random() - .5), (i + 1) * (ctx.canvas.height / foldCount))
        }
        ctx.stroke()
    }
}