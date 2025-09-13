// @creator: William77
// @pubdate: 2024/06/05
// @params: 

import { gacore } from "../../gacore.js"

export function CSSInvert() {
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.filter = `invert(1)`
    ctx2.drawImage(canvas, 0, 0)
    ctx.drawImage(ctx2.canvas, 0, 0)
}