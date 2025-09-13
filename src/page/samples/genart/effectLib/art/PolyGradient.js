// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function PolyGradient(params = { nPixelSize: 65, nRectWidth: 100, nStrokeWidth: .1, nFactor: .8, sColorOverlay: '#FC0' }) {
    let { nPixelSize, nRectWidth, nStrokeWidth, nFactor, sColorOverlay } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        ctx.lineWidth = nStrokeWidth;
        ctx.strokeStyle = `black`
        const grad = ctx.createLinearGradient(x, y, x, y + nRectWidth * nFactor);
        grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
        grad.addColorStop(1, sColorOverlay);
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.moveTo(x + nRectWidth * (Math.random() - .5) * 2, y + nRectWidth * (Math.random() - .5) * 2)
        ctx.lineTo(x + nRectWidth * (Math.random() - .5) * 2, y + nRectWidth * (Math.random() - .5) * 2)
        ctx.lineTo(x + nRectWidth * (Math.random() - .5) * 2, y + nRectWidth * (Math.random() - .5) * 2)
        ctx.lineTo(x + nRectWidth * (Math.random() - .5) * 2, y + nRectWidth * (Math.random() - .5) * 2)
        ctx.lineTo(x + nRectWidth * (Math.random() - .5) * 2, y + nRectWidth * (Math.random() - .5) * 2)
        ctx.fill();
        ctx.stroke();
        ctx.closePath()
    })
}