// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function AbstractPaint(params = { nPixelSize: 50, nR: 35, nWidthFactor: .25, nHeightFactor: .1666 }) {
    let { nPixelSize, nR, nWidthFactor, nHeightFactor } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(canvas, 0, 0)
    const ctx3 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx3.drawImage(canvas, 0, 0)

    CSSBlur(10, ctx3)
    SVGTurb(0.1, ctx3)

    let R = nR;
    const ctxPaint = gacore.createNewDrawContext(R, R)
    const infos = []
    gacore.perPixelHandler(ctx2, nPixelSize, (x, y, r, g, b, a) => {
        let [hue, saturation, brightness] = gacore.RGB2HSB(r, g, b)
        infos.push({ x, y, r, g, b, a, hue, saturation, brightness })
    })
    // infos.sort((a, b) => Math.random() > .5)
    infos.forEach(i => {
        let { x, y, r, g, b, a, hue, saturation, brightness } = i
        ctxPaint.save()
        ctxPaint.translate(R / 2, R / 2)
        ctxPaint.rotate(45 * Math.PI)
        ctxPaint.translate(-R / 2, -R / 2)
        ctxPaint.beginPath()
        ctxPaint.clearRect(0, 0, R, R)
        ctxPaint.fillStyle = `rgba(${r},${g},${b},${1})`
        ctxPaint.fillRect(R / 4, R / 4, R * nWidthFactor, R * nHeightFactor)
        ctxPaint.fill()
        CSSBlur(10, ctxPaint)
        SVGTurb(0.1, ctxPaint)
        ctxPaint.restore()
        let tmp = gacore.createNewDrawContext(R, R)
        let scale = 1 + 2 * Math.random()
        let newR = R * scale
        tmp.canvas.width = newR
        tmp.canvas.height = newR
        tmp.save()
        tmp.translate(newR / 2, newR / 2)
        tmp.rotate(15 / 180 * Math.PI)
        tmp.translate(-newR / 2, -newR / 2)
        tmp.drawImage(ctxPaint.canvas, 0, 0, newR, newR)
        tmp.restore()
        ctx2.drawImage(tmp.canvas, x - newR / 2, y - newR / 2, newR + Math.random() * newR * 2, newR + Math.random() * newR * 2)
    })
    ctx.globalCompositeOperation = gacore.GCO.MULTIPLY;
    // ctx.globalAlpha = 1;
    // ctx.drawImage(ctx3.canvas, 0, 0)
    ctx.globalAlpha = 1;
    ctx.drawImage(ctx2.canvas, 0, 0)
    ctx.globalCompositeOperation = gacore.GCO.SOURCE_OVER;
    ctx.globalAlpha = 1;
    SVGTurb(.01, ctx)
    SVGTurb(.08, ctx)
}

function CSSBlur(nBlurVal, ctx) {
    // const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.filter = `blur(${nBlurVal}px)`
    ctx2.drawImage(canvas, 0, 0)
    ctx.drawImage(ctx2.canvas, 0, 0)
}

function SVGTurb(nFrequency, ctx) {
    // const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.innerHTML = ` 
    <filter id="svgturb2">

        <feTurbulence 
        type="turbulence" 
        baseFrequency="${nFrequency}" 
        numOctaves="1" 
        type="fractalNoise" 
        result="turbulence" />

        <feDisplacementMap 
        in="SourceGraphic" 
        in2="turbulence" 
        scale="50" 
        xChannelSelector="R" 
        yChannelSelector="G" />

    </filter>
    `
    document.body.append(svg)
    ctx2.filter = `url(#svgturb2)`
    ctx2.drawImage(canvas, 0, 0)
    ctx.drawImage(ctx2.canvas, 0, 0)
    svg.remove()
}