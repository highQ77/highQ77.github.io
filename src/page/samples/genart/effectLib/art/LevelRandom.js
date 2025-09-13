// @creator: William77
// @pubdate: 2024/06/05
// @params: 2, 5, false

import { gacore } from "../../gacore.js"

export function LevelRandom(params = { nPixelSize: 2, nSplitLevel: 5, bBlackBG: false }) {
    let { nPixelSize, nSplitLevel, bBlackBG } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    let hues = Array(nSplitLevel).fill(0).map(item => 360 * Math.random())
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        let partition = ~~(100 / nSplitLevel)
        let k = 0
        for (; k < nSplitLevel; k++) {
            if (brightness > k && (brightness < partition * (k + 1))) {
                brightness = partition * k
                break;
            }
        }
        if (bBlackBG && k == nSplitLevel - 1) brightness = 0
        let [nr, ng, nb] = gacore.HSB2RGB(hues[k], 100, brightness)
        ctx.fillStyle = `rgba(${nr},${ng},${nb},${a})`
        ctx.fillRect(x, y, nPixelSize, nPixelSize)
    })
}