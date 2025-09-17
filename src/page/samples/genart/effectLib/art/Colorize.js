// @creator: William77
// @pubdate: 2024/09/17

import { gacore } from "../../gacore.js"

export function Colorize(params = { sColor: 'red' }) {
    let { sColor } = params
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    ctx.fillStyle = sColor
    ctx.globalCompositeOperation = gacore.GCO.SCREEN
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation = gacore.GCO.SOURCE_OVER
}
