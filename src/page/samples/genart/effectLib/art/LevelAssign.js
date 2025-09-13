// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function LevelAssign(params = { nPixelSize: 2, aColorArr: ['orange', 'pink', 'yellow'] }) {
    let { nPixelSize, aColorArr } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    let nSplitLevel = aColorArr.length;
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        let partition = ~~(100 / nSplitLevel)
        for (let k = 0; k < nSplitLevel; k++) {
            if (brightness > k && (brightness < partition * (k + 1))) {
                // brightness = partition * k
                ctx.fillStyle = aColorArr[k]
                break;
            }
        }
        ctx.fillRect(x, y, nPixelSize, nPixelSize)
    })
}