// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function EmojiMatrix(params = { bNoBG: true, nPixelSize: 30, aEmojisArr: ['❤️', '🟠', '😃', '🤢', '🥶', '👿'], nFontSize: 30, nHueOffset: 50 }) {
    let { bNoBG, nPixelSize, aEmojisArr, nFontSize, nHueOffset } = params

    const ctx = gacore.getMainDrawContext()
    const ctx2 = gacore.createNewDrawContext(ctx.canvas.width, ctx.canvas.height)
    ctx2.drawImage(ctx.canvas, 0, 0)
    gacore.perPixelHandler(ctx, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        ctx.fillStyle = `rgba(${r * brightness / 100},${g * brightness / 100},${b * brightness / 100},${a})`
        ctx.fillRect(x, y, nPixelSize, nPixelSize)
    })
    if (bNoBG) {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`
        ctx.font = nFontSize + "px Arial";
        hue = (hue + nHueOffset) % 360
        for (let i = 0; i < aEmojisArr.length; i++) {
            if (hue > 360 / aEmojisArr.length * i && hue < 360 / aEmojisArr.length * (i + 1)) {
                ctx.fillText(aEmojisArr[i], x, y)
            }
        }
    })
}