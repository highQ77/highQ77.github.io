// @creator: William77
// @pubdate: 2024/06/05
// @params: 50, 100

import { gacore } from "../../gacore.js";

export function RandomGradientLines(params = { nCount: 50, nMaxLightWidth: 100 }) {
    let { nCount, nMaxLightWidth } = params
    const ctx = gacore.getMainDrawContext()
    for (let j = 0; j < nCount; j++) {
        const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        grad.addColorStop(0, `rgb(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()})`);
        grad.addColorStop(.2, `rgb(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()})`);
        grad.addColorStop(.4, `rgb(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()})`);
        grad.addColorStop(.6, `rgb(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()})`);
        grad.addColorStop(.8, `rgb(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()})`);
        grad.addColorStop(1, `rgb(${255 * Math.random()},${255 * Math.random()},${255 * Math.random()})`);
        ctx.fillStyle = grad;
        ctx.lineWidth = nMaxLightWidth * Math.random()

        // v
        ctx.save()
        ctx.translate(0, (Math.random() - .5) * 2 * ctx.canvas.height)
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
        ctx.rotate(2 * Math.PI * Math.random())
        ctx.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2)
        ctx.fillRect((ctx.canvas.width - ctx.lineWidth) / 2, 0, ctx.lineWidth, ctx.canvas.height);
        ctx.restore()

        // h
        ctx.save()
        ctx.translate((Math.random() - .5) * 2 * ctx.canvas.width, 0)
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
        ctx.rotate(2 * Math.PI * Math.random())
        ctx.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2)
        ctx.fillRect((ctx.canvas.width - ctx.lineWidth) / 2, 0, ctx.lineWidth, ctx.canvas.height);
        ctx.restore()
    }
}