export const gacore = ((id) => {

    class GCO {
        static NONE = ''
        static SOURCE_OVER = 'source-over'
        static SOURCE_IN = 'source-in'
        static SOURCE_OUT = 'source-out'
        static SOURCE_ATOP = 'source-atop'
        static DESTINATION_OVER = 'destination-over'
        static DESTINATION_IN = 'destination-in'
        static DESTINATION_OUT = 'destination-out'
        static DESTINATION_ATOP = 'destination-atop'
        static LIGHTER = 'lighter'
        static COPY = 'copy'
        static XOR = 'xor'
        static MULTIPLY = 'multiply'
        static SCREEN = 'screen'
        static OVERLAY = 'overlay'
        static DARKEN = 'darken'
        static LIGHTEN = 'lighten'
        static COLOR_DODGE = 'color-dodge'
        static COLOR_BURN = 'color-burn'
        static HARD_LIGHT = 'hard-light'
        static SOFT_LIGHT = 'soft-light'
        static DIFFERENCE = 'difference'
        static EXCLUSION = 'exclusion'
        static HUE = 'hue'
        static SATURATION = 'saturation'
        static COLOR = 'color'
        static LUMONOSITY = 'lumonosity'
    }

    /**
    * 取得隨機色
    * @returns 隨機色
    */
    function getRandomColor() {
        return [255 * Math.random(), 255 * Math.random(), 255 * Math.random()].map(i => Math.round(i))
    }

    /**
    * 取得隨機色(字串)
    * @returns 隨機色
    */
    function getRandomColorString() {
        return `rgb(${Math.round(255 * Math.random())},${Math.round(255 * Math.random())},${Math.round(255 * Math.random())})`
    }

    /**
    * 取得隨機雙色
    * @returns 隨機雙色
    */
    function getRandomDuoColor(bInvert) {
        let c1 = [130 + 125 * Math.random(), 130 + 125 * Math.random(), 130 + 125 * Math.random()]
        let c2 = [60 * Math.random(), 60 * Math.random(), 60 * Math.random()]
        if (bInvert) [c2, c1] = [c1, c2]
        return { c1, c2 }
    }

    /**
     * 取得主要 canvas
     * @returns 主要 canvas
     */
    function getMainDrawContext() {
        return document.getElementById(id).getContext('2d')
    }

    /**
     * 創造新 canvas 並回傳 context
     * @returns 新 canvas
     */
    function createNewDrawContext(width, height) {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        return ctx
    }

    /**
     * 創造新 canvas 並回傳 context, 內容是主要 canvas 原圖備份
     * @returns 新 canvas
     */
    let copyCanvas
    function getOriginMainCopy() {
        if (!copyCanvas) {
            const c = getMainDrawContext()
            copyCanvas = document.createElement('canvas')
            copyCanvas.width = c.canvas.width
            copyCanvas.height = c.canvas.height
            const ctx = copyCanvas.getContext('2d')
            ctx.drawImage(c.canvas, 0, 0)
            return ctx
        }
        return copyCanvas.getContext('2d')
    }
    // getOriginMainCopy()

    /**
     * 創造新 canvas
     * @returns 新 canvas
     */
    function perPixelHandler(ctx, pixelSize, handler) {
        const data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data
        const colorSize = 4
        for (let j = 0; j < ctx.canvas.height; j += pixelSize) {
            for (let i = 0; i < ctx.canvas.width * colorSize; i += colorSize * pixelSize) {
                const pos = i + j * ctx.canvas.width * colorSize
                const r = data[pos]
                const g = data[pos + 1]
                const b = data[pos + 2]
                const a = data[pos + 3]
                const x = i / colorSize
                const y = j
                handler(x, y, r, g, b, a)
            }
        }
    }

    /**
     * 混合兩個畫布
     */
    function twoContextBlend(ctx, ctx2, blendFun) {
        const pixelSize = 1
        const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
        const data = imgData.data
        const data2 = ctx2.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data
        const colorSize = 4
        for (let j = 0; j < ctx.canvas.height; j += pixelSize) {
            for (let i = 0; i < ctx.canvas.width * colorSize; i += colorSize * pixelSize) {
                const pos = i + j * ctx.canvas.width * colorSize
                const r = blendFun(data[pos], data2[pos])
                const g = blendFun(data[pos + 1], data2[pos + 1])
                const b = blendFun(data[pos + 2], data2[pos + 2])
                const a = blendFun(data[pos + 3], data2[pos + 3])
                data[pos] = r
                data[pos + 1] = g
                data[pos + 2] = b
                data[pos + 3] = a
            }
        }
        ctx.putImageData(imgData, 0, 0)
    }

    /**
     * RGB to HSB 顏色轉換
     * @param r 0~255
     * @param g 0~255
     * @param b 0~255
     * @returns [0~360, 0~100, 0~100]
     */
    function RGB2HSB(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const v = Math.max(r, g, b),
            n = v - Math.min(r, g, b);
        const h =
            n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
        return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
    };

    /**
     * HSB to RGB 顏色轉換
     * @param h 0~360
     * @param s 0~100
     * @param b 0~100
     * @returns [0~255, 0~255, 0~255]
     */
    function HSB2RGB(h, s, b) {
        s /= 100;
        b /= 100;
        const k = (n) => (n + h / 60) % 6;
        const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
        return [255 * f(5), 255 * f(3), 255 * f(1)];
    };

    function getPixel(ctx, x, y) {
        if (!ctx) return [0, 0, 0, 0]
        const rgba = ctx.getImageData(x, y, 1, 1).data
        return [rgba[0], rgba[1], rgba[2], rgba[3]]
    }

    function loop(callback) {
        const canvas = getMainDrawContext().canvas
        const mouse = {
            step: 0,
            x: 0,
            y: 0,
            down: 0,
            move: 0,
        }
        if (callback == null) {
            canvas.update = null
        } else {
            canvas.addEventListener('mousemove', mm)
            canvas.addEventListener('mousedown', md)
            canvas.addEventListener('mouseup', mu)
            canvas.addEventListener('mouseenter', me)
            canvas.addEventListener('ontouchstart', ts)
            canvas.addEventListener('touchmove', tm)
            canvas.addEventListener('touchend', te)
            canvas.update = () => {
                if (mouse.step >= 2) { mouse.step = 0; callback(null); return }
                callback && callback(mouse)
                canvas.update && requestAnimationFrame(canvas.update)
            }
            requestAnimationFrame(canvas.update)
        }
        return mouse
        function updateFunc(pos) {
            let ratio = canvas.width / canvas.getClientRects()[0].width;
            mouse.x = pos.x * ratio
            mouse.y = pos.y * ratio
            mouse.down = pos.down;
            mouse.move = pos.move;
        }
        function ts(e) {
            mouse.step++
            mouse.down = 1
            updateFunc(mouse)
        }
        function tm(e) {
            let r = e.target.getClientRects()[0]
            mouse.x = e.touches[0].clientX - r.x
            mouse.y = e.touches[0].clientY - r.y
            mouse.down = 1
            mouse.move = 1
            updateFunc(mouse)
        }
        function te(e) {
            mouse.step++
            mouse.down = 0
            mouse.move = 0
            updateFunc(mouse)
        }
        function mm(e) {
            mouse.x = e.offsetX
            mouse.y = e.offsetY
            mouse.move = 1
            updateFunc(mouse)
        }
        function md(e) {
            mouse.step++
            mouse.x = e.offsetX
            mouse.y = e.offsetY
            mouse.down = 1
            updateFunc(mouse)
        }
        function mu(e) {
            mouse.step++
            mouse.x = e.offsetX
            mouse.y = e.offsetY
            mouse.down = 0
            mouse.move = 0
            updateFunc(mouse)
        }
        function me(e) {
            updateFunc(mouse)
        }

    }

    return {
        loop,
        getMainDrawContext,
        getOriginMainCopy,
        createNewDrawContext,
        twoContextBlend,
        perPixelHandler,
        getPixel,
        RGB2HSB,
        HSB2RGB,
        getRandomColor,
        getRandomDuoColor,
        getRandomColorString,
        GCO,
    }
})('gaCanvas')