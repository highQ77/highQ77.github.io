// @creator: William77
// @pubdate: 2024/06/05

import { gacore } from "../../gacore.js"

export function EdgeDetect(params = {}) {
    let { } = params
    const ctx = gacore.getMainDrawContext()
    const originalImageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const edgeDetectedImageData = applySobel(originalImageData);
    ctx.putImageData(edgeDetectedImageData, 0, 0);
}

function applySobel(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const outputData = new Uint8ClampedArray(data.length);

    // Grayscale conversion (simplified for brevity)
    const grayscaleData = new Array(width * height);
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        grayscaleData[i / 4] = avg;
    }

    const Gx = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ];

    const Gy = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
    ];

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let Gx_sum = 0;
            let Gy_sum = 0;

            // Convolution
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const pixelValue = grayscaleData[(y + ky) * width + (x + kx)];
                    Gx_sum += pixelValue * Gx[ky + 1][kx + 1];
                    Gy_sum += pixelValue * Gy[ky + 1][kx + 1];
                }
            }

            const magnitude = Math.sqrt(Gx_sum * Gx_sum + Gy_sum * Gy_sum);
            const outputIndex = (y * width + x) * 4;

            outputData[outputIndex] = magnitude;     // Red
            outputData[outputIndex + 1] = magnitude; // Green
            outputData[outputIndex + 2] = magnitude; // Blue
            outputData[outputIndex + 3] = 255;       // Alpha
        }
    }
    return new ImageData(outputData, width, height);
}