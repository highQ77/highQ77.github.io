// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function CircleMatrix(params = { nPixelSize: 100 }) {
    let { nPixelSize } = params
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    ctx2.fillStyle = 'rgba(0,0,0,.8)'
    let offset = nPixelSize * .5
    gacore.perPixelHandler(ctx, nPixelSize, (x, y, r, g, b, a) => {
        ctx2.beginPath();
        ctx2.arc(x + offset, y + offset, offset, 0, 2 * Math.PI);
        ctx2.fill();
    })
    gacore.twoContextBlend(ctx, ctx2, (a, b) => Math.sqrt(a ** 2 + b ** 2))
}