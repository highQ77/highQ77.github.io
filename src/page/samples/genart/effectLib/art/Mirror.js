// @creator: William77
// @pubdate: 2024/06/05
// @params: 

import { gacore } from "../../gacore.js"

export function Mirror() { // 仍需測試
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    const ctx3 = gacore.createNewDrawContext(canvas.width, canvas.height)
    const ctx4 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.translate(canvas.width, 0)
    ctx2.scale(-1, 1)
    ctx2.drawImage(canvas, 0, 0)
    ctx3.translate(0, canvas.height)
    ctx3.scale(1, -1)
    ctx3.drawImage(canvas, 0, 0)
    ctx4.translate(canvas.width, canvas.height)
    ctx4.scale(-1, -1)
    ctx4.drawImage(canvas, 0, 0)
    ctx.drawImage(canvas, 0, 0, canvas.width * .5, canvas.height * .5)
    ctx.drawImage(ctx2.canvas, 0, 0, canvas.width, canvas.height, canvas.width * .5, 0, canvas.width * .5, canvas.height * .5)
    ctx.drawImage(ctx3.canvas, 0, 0, canvas.width, canvas.height, 0, canvas.height * .5, canvas.width * .5, canvas.height * .5)
    ctx.drawImage(ctx4.canvas, 0, 0, canvas.width, canvas.height, canvas.width * .5, canvas.height * .5, canvas.width * .5, canvas.height * .5)
}