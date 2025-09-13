// @creator: William77
// @pubdate: 2024/06/05
// @params: 2, 3, 1, .1, .1

import { gacore } from "../../gacore.js"

export function Level(params = { nPixelSize: 2, nSplitLevel: 3, nRedFactor: 1, nGreenFactor: .1, nBlueFactor: .1 }) {
    let { nPixelSize, nSplitLevel, nRedFactor, nGreenFactor, nBlueFactor } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        let partition = ~~(100 / nSplitLevel)
        for (let k = 0; k < nSplitLevel; k++) {
            if (brightness > k && (brightness < partition * (k + 1))) {
                brightness = partition * k
                break;
            }
        }
        let [nr, ng, nb] = gacore.HSB2RGB(hue, 0, brightness)
        ctx.fillStyle = `rgba(${nr * nRedFactor},${ng * nGreenFactor},${nb * nBlueFactor},${a})`
        ctx.fillRect(x, y, nPixelSize, nPixelSize)
    })
}