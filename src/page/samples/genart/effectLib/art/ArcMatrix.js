// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function ArcMatrix(params = { nPixelSize: 50, nLineWidth: 50 }) {
    let { nPixelSize, nLineWidth } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    ctx2.lineWidth = nLineWidth
    let offset = nPixelSize * .5
    const infos = []
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        infos.push({ x, y, r, g, b, a, hue, saturation, brightness })
    })
    infos.forEach(i => {
        let { x, y, r, g, b, a, hue, saturation, brightness } = i
        ctx2.beginPath();
        ctx2.strokeStyle = `rgba(${r},${g},${b},.6)`
        ctx2.arc(x + offset, y + offset, offset, 0, 2 * Math.PI);
        ctx2.stroke();
    })
    ctx.drawImage(ctx2.canvas, 0, 0)
}
