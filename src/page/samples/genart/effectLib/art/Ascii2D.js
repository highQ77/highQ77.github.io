// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function Ascii2D(params = { nPixelSize: 30, sFontFamily: 'arial', sFontSize: '24px', bShowBG: false }) {
    let { nPixelSize, sFontFamily, sFontSize, bShowBG } = params

    const asciiChars = `$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^\`'.`.split('').sort(_ => Math.random() - .5).join('')
    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = `${sFontSize} ${sFontFamily}`;
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        ctx.fillStyle = `rgba(${r * brightness / 100},${g * brightness / 100},${b * brightness / 100},${a})`
        bShowBG && ctx.fillRect(x, y, nPixelSize, nPixelSize)
        ctx.fillText(asciiChars.charAt(~~((brightness / 255) * asciiChars.length)), x + 2, y - 2)
    })
}
