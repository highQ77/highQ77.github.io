// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function SVGTurb(params = { nFrequency: 0.006, nScale: 50, bRandomChannel: false }) {
    let { nFrequency, nScale, bRandomChannel } = params

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    let channel = ['R', 'G', 'B']
    if (bRandomChannel) channel.sort(i => Math.random() - .5)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.innerHTML = ` 
    <filter id="svgturb2">

        <feTurbulence 
        type="turbulence" 
        baseFrequency="${nFrequency}" 
        numOctaves="2" 
        type="fractalNoise" 
        result="turbulence" />

        <feDisplacementMap 
        in="SourceGraphic" 
        in2="turbulence" 
        scale="${nScale}" 
        xChannelSelector="${channel[0]}" 
        yChannelSelector="${channel[1]}" />

    </filter>
    `
    document.body.append(svg)
    ctx2.filter = `url(#svgturb2)`
    ctx2.drawImage(canvas, 0, 0)
    ctx.drawImage(ctx2.canvas, 0, 0)
    svg.remove()
}