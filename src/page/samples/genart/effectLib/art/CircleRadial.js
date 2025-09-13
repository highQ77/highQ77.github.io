// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function CircleRadial(params = { bNoBG: true, nPixelSize: 150, nLineLen: 1000, nCircleWidth: 200, bBlendWith: false, nBlendMult: 1 }) {
    let { bNoBG, nPixelSize, nLineLen, nCircleWidth, bBlendWith, nBlendMult } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    if (bNoBG) {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    const infos = []
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        infos.push({ x, y, r, g, b, a, hue, saturation, brightness })
    })
    infos.sort(() => Math.random() - 0.5);
    infos.forEach(i => {
        let { x, y, r, g, b, a, hue, saturation, brightness } = i
        let r2 = Math.random() * nCircleWidth
        let ag = brightness / 100 * Math.PI * Math.random()
        let newX2 = x + r * Math.cos(ag)
        let newY2 = y + r * Math.sin(ag)
        ctx.beginPath()
        const grad = ctx.createRadialGradient(x, y, 0, x, y, (nLineLen));
        grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
        grad.addColorStop(.9, `rgba(${r / 3},${g / 3},${b / 3},${.1})`);
        grad.addColorStop(1, `rgba(${r / 5},${g / 5},${b / 5},${0})`);
        ctx.fillStyle = grad
        ctx.arc(newX2, newY2, r2, 0, 2 * Math.PI, false)
        ctx.fill();
        ctx.closePath()
    })

    if (bBlendWith)
        gacore.twoContextBlend(ctx, ctx2, (a, b) => (a + b) * nBlendMult)

    ctx.beginPath()
}
