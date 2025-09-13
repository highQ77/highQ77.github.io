// @creator: William77
// @pubdate: 2024/06/05
// @params: 3, 10

import { gacore } from "../../gacore.js"

export function RandomRadioCircles(params = { nCount: 3, nLineWidth: 10, sColor: 'white' }) {
    let { nCount, nLineWidth, sColor } = params
    const ctx = gacore.getMainDrawContext()
    ctx.strokeStyle = sColor;
    for (let j = 0; j < nCount; j++) {
        ctx.lineWidth = nLineWidth * Math.random()
        let x = ctx.canvas.width / 2 + ctx.canvas.width * (Math.random() - .5)
        let y = ctx.canvas.height / 2 + ctx.canvas.height * (Math.random() - .5)
        for (let i = 0; i < 10; i++) {
            ctx.beginPath()
            ctx.arc(x, y, (i + 1) * nLineWidth * 3, 0, 2 * Math.PI);
            ctx.closePath()
            ctx.stroke()
        }
    }
}