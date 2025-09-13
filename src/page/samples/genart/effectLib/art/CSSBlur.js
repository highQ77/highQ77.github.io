// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js";

export function CSSBlur(params = { nBlurVal: 20 }) {
    let { nBlurVal } = params
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.filter = `blur(${nBlurVal}px)`
    ctx2.drawImage(canvas, 0, 0)
    ctx.drawImage(ctx2.canvas, 0, 0)
}