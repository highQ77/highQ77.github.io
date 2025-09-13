// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function SVGGlass(params = { nX: 0, nY: 0, nScaleVal: 1000 }) {
    let { nX, nY, nScaleVal } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.innerHTML = ` 
    <filter id="svgglass">
        <feDisplacementMap 
        scale="${nScaleVal}" 
        xChannelSelector="R" 
        yChannelSelector="G" />
    </filter>
    `
    document.body.append(svg)
    ctx2.filter = `url(#svgglass)`
    ctx2.drawImage(canvas, 0, 0)
    ctx.drawImage(ctx2.canvas, -nScaleVal / 2 + nX, - nScaleVal / 2 + nY, canvas.width + nScaleVal / 2, canvas.height + nScaleVal / 2)
    svg.remove()
}