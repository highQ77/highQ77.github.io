// @creator: William77
// @pubdate: 2024/06/05
// @params: .5

import { gacore } from "../../gacore.js"

export function CSSSaturate(params = { nSaturateVal: .5 }) {
    let { nSaturateVal } = params
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.filter = `saturate(${nSaturateVal})`
    ctx2.drawImage(canvas, 0, 0)
    ctx.drawImage(ctx2.canvas, 0, 0)
}