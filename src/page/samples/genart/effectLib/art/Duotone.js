// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function Duotone(params = { nPixelSize: 2, nThreshold: .5, nRed1: 255, nGreen1: 255, nBlue1: 0, nRed2: 60, nGreen2: 60, nBlue2: 60 }) {
    let { nPixelSize, nThreshold, nRed1, nGreen1, nBlue1, nRed2, nGreen2, nBlue2 } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        if (brightness >= nThreshold * 100) brightness = 100
        else brightness = 0
        if (brightness == 100) {
            ctx.fillStyle = `rgba(${nRed1},${nGreen1},${nBlue1},${a})`
        } else {
            ctx.fillStyle = `rgba(${nRed2},${nGreen2},${nBlue2},${a})`
        }
        ctx.fillRect(x, y, nPixelSize, nPixelSize)
    })
}