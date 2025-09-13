// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function Bloom(params = { nBlurVal: 20, nMult: 1.0 }) {
    let { nBlurVal, nMult } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx_bu = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx_bu.drawImage(canvas, 0, 0)
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.filter = `blur(${nBlurVal}px)`
    ctx2.drawImage(canvas, 0, 0)
    ctx.drawImage(ctx2.canvas, 0, 0)
    gacore.twoContextBlend(ctx, ctx_bu, (a, b) => (a + b) * nMult)
}