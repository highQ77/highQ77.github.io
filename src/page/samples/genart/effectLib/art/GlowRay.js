// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function GlowRay(params = { nScaleOffset: 5, nScaleOffsetCount: 20 }) {
    let { nScaleOffset, nScaleOffsetCount } = params

    const ctx = gacore.getMainDrawContext()
    let scaleOffset = nScaleOffset;
    ctx.globalCompositeOperation = gacore.GCO.LIGHTEN
    ctx.globalAlpha = 0.15
    for (let i = 0; i < nScaleOffsetCount; i++) {
        scaleOffset += 1
        ctx.drawImage(ctx.canvas, -scaleOffset, -scaleOffset, ctx.canvas.width + scaleOffset * 2, ctx.canvas.height + scaleOffset * 2)
    }
    ctx.globalCompositeOperation = gacore.GCO.SOURCE_OVER
    ctx.globalAlpha = 1
}
