// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js";

export function Pixelate(params = { nPixelSize: 12 }) {
    let { nPixelSize } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        ctx.fillStyle = `rgba(${r * brightness / 100},${g * brightness / 100},${b * brightness / 100},${a})`
        ctx.fillRect(x, y, nPixelSize, nPixelSize)
    })
}
