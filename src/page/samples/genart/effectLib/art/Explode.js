// @creator: William77
// @pubdate: 2024/06/05
// @params: false, 30, 100, 2, 5, 10, false, 1

import { gacore } from "../../gacore.js"

export function Explode(params = { bNoBG: false, nPixelSize: 30, nLineLen: 100, nStrokeWidthFactor: 2, nPetalCount: 5, nPetalSize: 10, bBlendWith: false, nBlendMult: 1 }) {
    let { bNoBG, nPixelSize, nLineLen, nStrokeWidthFactor, nPetalCount, nPetalSize, bBlendWith, nBlendMult } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    if (bNoBG) {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    let dcList = []
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        let drawCode = () => {
            let ball = createPetal(canvas, nPixelSize, `rgba(${r},${g},${b},${brightness / 100 * .9 + .1})`, nLineLen, nStrokeWidthFactor, nPetalCount, nPetalSize, brightness)
            ctx.drawImage(ball.canvas, -ball.canvas.width / 2 + x, -ball.canvas.height / 2 + y)
        }
        dcList.push(drawCode)
    })

    ctx.fillRect(0, 0, canvas.width, canvas.height)
    dcList.forEach(dc => dc())
    dcList.sort(() => Math.random() - .5).forEach(dc => dc())

    if (bBlendWith)
        gacore.twoContextBlend(ctx, ctx2, (a, b) => (a + b) * nBlendMult)
}

function createPetal(canvas, nPixelSize, sColor, nLineLen, nStrokeWidthFactor, nPetalCount, nPetalSize, brightness) {
    const furBall = gacore.createNewDrawContext(canvas.width, canvas.height)
    furBall.lineWidth = nStrokeWidthFactor * brightness / 100;
    furBall.strokeStyle = sColor
    furBall.fillStyle = sColor
    for (let i = 0; i < nPetalCount; i++) {
        furBall.globalAlpha = brightness / 100 * .5 + .5
        let a = Math.random() * Math.PI * 2
        let r = nPixelSize + nLineLen * Math.random()
        let newX = canvas.width / 2 + r * Math.cos(a)
        let newY = canvas.height / 2 + r * Math.sin(a)
        furBall.beginPath()
        furBall.moveTo(canvas.width / 2, canvas.height / 2)
        furBall.lineTo(newX, newY)
        furBall.stroke();
        furBall.beginPath()
        furBall.arc(newX, newY, nPetalSize * brightness / 100, 0, 2 * Math.PI)
        furBall.fill()
    }
    furBall.globalAlpha = 1
    furBall.closePath()
    return furBall
}