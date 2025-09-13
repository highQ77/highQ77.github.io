// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function EmojiCustom(params = { bNoBG: true, nPixelSize: 55, sEmoji: '😀', nThreshold: .3, nFontSizeMutiplier: .8, nAlphaMutiplier: 1 }) {
    let { bNoBG, nPixelSize, sEmoji, nThreshold, nFontSizeMutiplier, nAlphaMutiplier } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    if (bNoBG) {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    const emojis = [sEmoji]
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        ctx.fillStyle = `rgba(${r},${g},${b},${brightness / 100 * nAlphaMutiplier})`
        ctx.font = brightness * nFontSizeMutiplier + "px Arial";
        if (brightness > 100 * nThreshold) {
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(Math.PI * 2 * brightness / 100)
            ctx.translate(-x, -y)
            ctx.fillText(emojis[~~(Math.random() * emojis.length)], x, y + 50)
            ctx.restore()
        }
    })
}