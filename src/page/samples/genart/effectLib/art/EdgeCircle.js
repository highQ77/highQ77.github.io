// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function EdgeCircle(params = { bNoBG: true, nPixelSize: 2, nThreshold: 0.5, nRadius: 200, nRed: 255, nGreen: 255, nBlue: 255, nAlpha: 0.1 }) {
    let { bNoBG, nPixelSize, nThreshold, nRadius, nRed, nGreen, nBlue, nAlpha } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    if (bNoBG) {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        if (brightness >= nThreshold * 100) brightness = 100
        if (brightness == 100) {
            ctx2.fillStyle = `white`
        } else {
            ctx2.fillStyle = `black`
        }
        ctx2.fillRect(x, y, nPixelSize, nPixelSize)
    })

    ctx.strokeStyle = `rgba(${nRed},${nGreen},${nBlue},${nAlpha})`
    let temp = 0
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        if (temp == 0 && brightness != 0 || temp == 100 && brightness != 100) {
            ctx.fillStyle = `white`
            ctx.beginPath();
            ctx.ellipse(x, y, nRadius, nRadius, 0, 0, Math.PI * 2)
            ctx.stroke();
        }
        temp = brightness
    })
    ctx.beginPath();
}