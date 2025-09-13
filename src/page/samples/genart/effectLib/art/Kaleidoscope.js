// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

// stepCount > 10
export function Kaleidoscope(params = { stepCount: 12, R: 1500 }) {
    let { stepCount, R } = params

    const ctx = gacore.getMainDrawContext()
    const clip = gacore.createNewDrawContext(ctx.canvas.width, ctx.canvas.height)
    clip.drawImage(ctx.canvas, 0, 0)
    clip.beginPath()
    clip.moveTo(ctx.canvas.width / 2, ctx.canvas.height / 2)
    clip.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, R, (360 / stepCount + 360 / stepCount * 1) / 180 * Math.PI, (360 / stepCount) / 180 * Math.PI, false)
    clip.closePath()
    clip.fillStyle = 'black'
    clip.fill()
    clip.clip()
    ctx.drawImage(clip.canvas, 0, 0)
    let mask = gacore.createNewDrawContext(ctx.canvas.width, ctx.canvas.height)
    mask.globalCompositeOperation = gacore.GCO.SCREEN
    for (let step = 0; step < stepCount; step++) {
        mask.save()
        mask.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
        mask.rotate(360 / stepCount * step / 180 * Math.PI)
        mask.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2)
        mask.drawImage(ctx.canvas, 0, 0)
        mask.restore()
    }
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.drawImage(mask.canvas, 0, 0)
}