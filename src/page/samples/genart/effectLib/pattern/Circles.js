// @creator: William77
// @pubdate: 2024/06/05
// @params: 100, 50, 255, 255, 255, .1, true

import { gacore } from "../../gacore.js"

export function Circles(params = { nR: 100, nLineWidth: 50, nStrokeR: 255, nStrokeG: 255, nStrokeB: 255, nStrokeA: .1, bNoBlend: true }) {
    let { nR, nLineWidth, nStrokeR, nStrokeG, nStrokeB, nStrokeA, bNoBlend } = params
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    ctx2.lineWidth = nLineWidth
    ctx2.strokeStyle = `rgba(${nStrokeR},${nStrokeG},${nStrokeB},${nStrokeA})`

    const cnt = canvas.width / 10
    for (let i = 0; i < cnt; i++) {
        ctx2.beginPath()
        ctx2.arc(canvas.width * .5, canvas.height * .5, (i + 1) * nR, 0, 2 * Math.PI);
        ctx2.closePath()
        ctx2.stroke()
    }
    if (bNoBlend)
        ctx.drawImage(ctx2.canvas, 0, 0)
    else
        gacore.twoContextBlend(ctx, ctx2, (a, b) => Math.sqrt(a ** 2 + b ** 2))
}