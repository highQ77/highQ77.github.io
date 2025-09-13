// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function Weaver(params = { nGridWidth: 100, nLineWidth: 50, nStrokeR: 255, nStrokeG: 255, nStrokeB: 255, nStrokeA: .1 }) {
    let { nGridWidth, nLineWidth, nStrokeR, nStrokeG, nStrokeB, nStrokeA } = params
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    ctx2.lineWidth = nLineWidth
    ctx2.strokeStyle = `rgba(${nStrokeR},${nStrokeG},${nStrokeB},${nStrokeA})`

    ctx2.beginPath()
    const cnt = canvas.width / nGridWidth * 2
    for (let i = 0; i < cnt; i++) {
        ctx2.moveTo(nGridWidth * i, 0)
        ctx2.lineTo(0, nGridWidth * i)
    }
    ctx2.closePath()
    ctx2.stroke()

    ctx2.beginPath()
    const cnt2 = canvas.width / nGridWidth * 2
    for (let i = 0; i < cnt2; i++) {
        ctx2.moveTo(0, canvas.height - nGridWidth * i)
        ctx2.lineTo(nGridWidth * i, canvas.height)
    }
    ctx2.closePath()
    ctx2.stroke()

    ctx.drawImage(ctx2.canvas, 0, 0)
}