// @creator: William77
// @pubdate: 2024/06/05
// @params: 5, 255, 255, 255, .5, 200, 200

import { gacore } from "../../gacore.js"

export function Totem2(params = { nLineWidth: 5, nStrokeR: 255, nStrokeG: 255, nStrokeB: 255, nStrokeA: .5, nPatternW: 50, nPatternH: 50 }) {
    let { nLineWidth, nStrokeR, nStrokeG, nStrokeB, nStrokeA, nPatternW, nPatternH } = params
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas

    let w = nPatternW
    let h = nPatternH

    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.lineWidth = nLineWidth
    ctx2.strokeStyle = `rgba(${nStrokeR},${nStrokeG},${nStrokeB},${nStrokeA})`
    ctx2.beginPath()
    ctx2.moveTo(0, 0)
    ctx2.lineTo(w, h)
    ctx2.stroke()

    const ctx3 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx3.lineWidth = nLineWidth
    ctx3.strokeStyle = `rgba(${nStrokeR},${nStrokeG},${nStrokeB},${nStrokeA})`
    ctx3.beginPath()
    ctx3.moveTo(w, 0)
    ctx3.lineTo(0, h)
    ctx3.stroke()

    let texColCount = Math.ceil(ctx2.canvas.width / w)
    let texRowCount = Math.ceil(ctx2.canvas.height / h)

    for (let j = 0; j < texRowCount; j++) {
        for (let i = 0; i < texColCount; i++) {
            ctx.drawImage((Math.random() > .5 ? ctx3.canvas : ctx2.canvas), i * w, j * h)
        }
    }
}