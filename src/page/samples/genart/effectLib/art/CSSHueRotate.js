// @creator: William77
// @pubdate: 2024/06/05
// @params: 90

import { gacore } from "../../gacore.js"

export function CSSHueRotate(params = { nDegreeVal: 90 }) {
    let { nDegreeVal } = params
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.filter = `hue-rotate(${nDegreeVal}deg)`
    ctx2.drawImage(canvas, 0, 0)
    ctx.drawImage(ctx2.canvas, 0, 0)
}