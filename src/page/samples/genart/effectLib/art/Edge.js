// https://gist.github.com/arifd/9ef3d02b43e858170f52553319c05952
// arifd/edgeDetect.js
// I wrote a sobel edge detector in Javascript!
// todo: try Laplacian of Gaussian (LoG) instead of Sobel

// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function Edge(params = { kernelLevel: 8 }) {
    let { kernelLevel } = params

    const sobel_v =
        [
            -1.0, 0.0, +1.0,
            -2.0, 0.0, +2.0,
            -1.0, 0.0, +1.0
        ].map(i => i * kernelLevel);

    const sobel_h =
        [
            -1.0, -2.0, -1.0,
            0.0, 0.0, 0.0,
            +1.0, +2.0, +1.0
        ].map(i => i * kernelLevel);;

    // input: imageData object with RGBA data
    // output: 2D array with edge detection data. Note, 1 channel per pixel.
    function createEdgeMapFromImageData(imageData) {
        let pixels = new Uint8ClampedArray(imageData.data.length * 0.25);
        let width = imageData.width;
        let data = imageData.data;

        // create greyscale first
        {
            let i = imageData.data.length;
            while (i) {
                // let a = data[i-1];
                let b = data[i - 2];
                let g = data[i - 3];
                let r = data[i - 4];
                pixels[i * 0.25] = 0.3 * r + 0.59 * g + 0.11 * b; // Luminocity weighted average.
                // pixels[i*0.25] = (r+b+g)/3; // average
                i -= 4;
            }
        }

        // now edge detect
        for (let i = 0; i < pixels.length; i++) {
            // loop our 3x3 kernels, build our kernel values
            let hSum = 0;
            let vSum = 0;
            for (let y = 0; y < 3; y++)
                for (let x = 0; x < 3; x++) {
                    let pixel = pixels[i + (width * y) + x];
                    let kernelAccessor = (x) * 3 + (y);
                    hSum += pixel * sobel_h[kernelAccessor];
                    vSum += pixel * sobel_v[kernelAccessor];
                }
            // apply kernel evaluation to current pixel
            pixels[i] = Math.sqrt(hSum * hSum + vSum * vSum);
            // pixels[i] = Math.abs((hSum + vSum) * 0.5);
        };

        return pixels;
    }

    const ctx = gacore.getMainDrawContext()
    const canvas = ctx.canvas
    const ctx2 = gacore.createNewDrawContext(canvas.width, canvas.height)
    ctx2.drawImage(ctx.canvas, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    // Example usage (taking the pxiels 1D):
    const edge = createEdgeMapFromImageData(imageData);
    for (const i in edge) {
        let x = i % canvas.width;
        let y = (i - x) / canvas.width;
        let gray = 255 - edge[i]
        ctx2.fillStyle = `rgba(${gray},${gray},${gray},${gray / 255})`;
        ctx2.fillRect(x, y, 1, 1);
    }
    ctx.drawImage(ctx2.canvas, 0, 0, ctx2.canvas.width + 2, ctx2.canvas.height + 2)
}

