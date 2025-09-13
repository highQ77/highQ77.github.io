// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function LevelColor(params = { nPixelSize: 2, nSplitLevel: 5 }) {
    let { nPixelSize, nSplitLevel } = params

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
        ctx.fillStyle = `rgba(${nr * r / 255},${ng * g / 255},${nb * b / 255},${a})`
        ctx.fillRect(x, y, nPixelSize, nPixelSize)
    })
}