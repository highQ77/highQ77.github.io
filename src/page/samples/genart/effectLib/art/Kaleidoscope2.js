// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

// stepCount > 10
export function Kaleidoscope2(params = { stepCount: 12, R: 1500 }) {
    let { stepCount, R } = params

    const ctx = gacore.getMainDrawContext()
    const clip = gacore.createNewDrawContext(ctx.canvas.width, ctx.canvas.height)
    clip.drawImage(ctx.canvas, 0, 0)
    clip.beginPath()
    clip.moveTo(ctx.canvas.width / 2, ctx.canvas.height / 2)
    clip.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, R, (360 / stepCount + 360 / stepCount * 1) / 180 * Math.PI, (360 / stepCount) / 180 * Math.PI, false)
    clip.closePath()
    clip.fillStyle = 'transparent'
    clip.fill()
    clip.clip()
    ctx.drawImage(clip.canvas, 0, 0)

    let mask = gacore.createNewDrawContext(ctx.canvas.width, ctx.canvas.height)
    mask.globalCompositeOperation = gacore.GCO.LIGHTEN
    mask.save()
    mask.translate(ctx.canvas.width / 2, 0)
    mask.rotate(360 / stepCount * 1.5 / 180 * Math.PI)
    mask.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2)
    mask.drawImage(ctx.canvas, 0, 0)
    mask.restore()

    let mask2 = gacore.createNewDrawContext(ctx.canvas.width, ctx.canvas.height)
    mask2.save()
    mask2.translate(mask2.canvas.width, 0)
    mask2.scale(-1, 1)
    mask2.drawImage(mask.canvas, 0, 0)
    mask.drawImage(mask2.canvas, 0, 0)
    mask2.restore()

    let combine = gacore.createNewDrawContext(ctx.canvas.width, ctx.canvas.height)
    combine.save()
    combine.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
    combine.rotate(360 / stepCount * -1.5 / 180 * Math.PI)
    combine.translate(-ctx.canvas.width / 2, 0)
    combine.drawImage(mask.canvas, 0, 0)
    combine.restore()

    combine.globalCompositeOperation = gacore.GCO.LIGHTEN
    for (let step = 0; step < stepCount; step++) {
        combine.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
        combine.rotate(360 / stepCount / 180 * Math.PI)
        combine.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2)
        combine.drawImage(combine.canvas, 0, 0)
    }
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.drawImage(combine.canvas, 0, 0)
}