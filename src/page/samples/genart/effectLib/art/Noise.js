// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function Noise(params = { nPixelSize: 2, nRedFactor: 2, nGreenFactor: 1, nBlueFactor: 0, nAlphaFactor: 1 }) {
    let { nPixelSize, nRedFactor, nGreenFactor, nBlueFactor, nAlphaFactor } = params

    const ctx = gacore.getMainDrawContext()
    gacore.perPixelHandler(ctx, nPixelSize, (x, y, r, g, b, a) => {
        let gray = (r + g + b) / 3
        ctx.fillStyle = `rgba(${gray * nRedFactor},${gray * nGreenFactor},${gray * nBlueFactor},${gray * nAlphaFactor})`
        ctx.fillRect(x, y, nPixelSize, nPixelSize)
        ctx.fillStyle = `rgba(${10},${10},${10},${Math.random()})`
        ctx.fillRect(x, y, nPixelSize, nPixelSize)
        ctx.fillStyle = `rgba(${r},${g},${b},${.5})`
        ctx.fillRect(x, y, nPixelSize, nPixelSize)
    })
}