
// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function SpiralAdvance(params = { nLineWidth: 10, nRFactor: 5, nRFactorDecrement: 0.03, sColor: 'white', nSegs: 36 }) {
    let { nLineWidth, nRFactor, nRFactorDecrement, sColor, nSegs } = params
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    ctx.strokeStyle = sColor
    ctx.lineWidth = nLineWidth
    let angle = 0
    let s = 0
    for (let i = 0; i < nSegs; i++) {
        angle += 360 / nSegs / 180 * Math.PI;
        ctx.beginPath();
        s += nRFactorDecrement
        ctx.ellipse(canvas.width / 2, canvas.height / 2, 700 * nRFactor * s, 300 * nRFactor * s, angle, 0, 360)
        ctx.stroke()
        ctx.closePath();
    }
}