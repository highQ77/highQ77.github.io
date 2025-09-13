// @creator: William77
// @pubdate: 2024/06/05
// @params: 10, 255, 255, 255, .1, 0

import { gacore } from "../../gacore.js"

export function Stream(params = { nLineWidth: 10, nStrokeR: 255, nStrokeG: 255, nStrokeB: 255, nStrokeA: .1, nOffsetY: 0 }) {
    let { nLineWidth, nStrokeR, nStrokeG, nStrokeB, nStrokeA, nOffsetY } = params
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    ctx2.lineWidth = nLineWidth
    ctx2.strokeStyle = `rgba(${nStrokeR},${nStrokeG},${nStrokeB},${nStrokeA})`

    ctx2.beginPath()
    let prex = 0, prey = 0, r = 100
    for (let j = -10; j < 200; j++) {
        for (let i = 0; i < 180; i++) {
            ctx2.beginPath()
            ctx2.moveTo(prex, prey)
            prex = i * 15
            prey = j * 20 + r * Math.sin(i * 3 / 180 * Math.PI) + nOffsetY
            ctx2.lineTo(prex, prey)
            if (i % 180 != 0) ctx2.stroke()
        }
    }
    ctx2.closePath()
    ctx2.stroke()

    ctx.drawImage(ctx2.canvas, 0, 0)
}