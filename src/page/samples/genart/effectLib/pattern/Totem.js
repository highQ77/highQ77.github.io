// @creator: William77
// @pubdate: 2024/06/05
// @params: 34, 6

import { gacore } from "../../gacore.js"

export function Totem(params = { nPixelSize: 34, nLineWidth: 6 }) {
    let { nPixelSize, nLineWidth } = params
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let state;
        switch (Math.floor(Math.random() * 2)) {
            case 0: state = [x, y, x + nPixelSize, y + nPixelSize]; break;
            case 1: state = [x + nPixelSize, y, x, y + nPixelSize]; break;
        }
        let [x1, y1, x2, y2] = state
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`
        ctx.fillRect(x, y, nPixelSize, nPixelSize)
        ctx.beginPath()
        ctx.lineWidth = nLineWidth
        ctx.strokeStyle = `rgba(${r * 2},${g * 2},${b * 2},${a})`
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.closePath()
    })
}