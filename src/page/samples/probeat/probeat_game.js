import { GlobalEvent } from "../../../core/config.js";
import { node } from "../../../core/node.js";
import { router } from "../../../core/router.js";
import { store } from "../../../core/store.js";
import { BMSLoader } from "./BMSLoader.js";

export function probeat_game() {
    // 新手學習專案 learning project - music game development 

    // 所有 bms 音樂包下載處 (bms download place: https://www.bmsworld.nz/)
    // cranKy – J219, (147BPM Genre, Euro Beat ^^ Fan Made)
    // [youtube J219] https://www.youtube.com/watch?v=jp4cjU8NLZQ&width=1280&height=720
    // [download J219] https://mega.co.nz/#!yQoBmYib!X5dXTxxRjJEmz4isPQ402xFAfvWZ3ttXdtR8T1twBpk
    // 請自行用 vscode live server 架 server 放音樂包測試 
    let resourceURL = 'samples/probeat/cranky%20%5BEURO%20BEAT%5D%20J219/'

    // 產生遊戲歌曲相關資源 (J219.bms -> J219-bms-copy.txt, 因為 gitPage 會擋不明副檔名)

    let isAutoPlay = store.get$().samples.probeat.isAutoPlay[0]
    let score = store.get$().samples.probeat.score

    let barWidth = 75
    let duration = 1500
    let comboCounter = 0
    let reactColor = 'rgba(86, 117, 180, 1)' // lightbar color
    let reactColor2 = 'rgba(255, 0, 0, 1)' // bubble color

    let jsdom = node.div().setStyle({ background: 'black' }).setChildren([
        node.divimg('', 'samples/probeat/bg.jpg').setStyle({ width: '100vw', height: '100dvh' }),
        node.div().setStyle({ position: 'absolute', left: '0px', top: '0px', background: '#000000eb', width: '100vw', height: '100dvh' }),
        node.canvas('canvasScreen').setStyle({ position: 'absolute', left: '0px', top: '0px', width: '100dvw', height: '100dvh', filter: 'grayscale(1) blur(2px) opacity(.3)' }),
        node.canvas('canvasColor').setStyle({ position: 'absolute', left: 'calc(413px + (100vw - 413px - 512px) / 2)', top: 'calc((100dvh - 512px) / 2)', width: '512px', height: '512px' }),
        node.div().setStyle({ position: 'absolute', left: '0px', top: '0px', height: '100dvh' }).setChildren([
            node.div('barContainer').setStyle({ display: 'flex', position: 'absolute', left: '0px', top: '0px', height: 'calc(100dvh - 150px)' }).setChildren([
                node.div().setStyle({ width: barWidth + 'px', height: '100%', background: '#000000AA', borderRight: '1px solid #FFFFFF66' }),
                node.div().setStyle({ width: barWidth + 'px', height: '100%', background: '#000000AA', borderRight: '1px solid #FFFFFF66' }),
                node.div().setStyle({ width: barWidth + 'px', height: '100%', background: '#000000AA', borderRight: '1px solid #FFFFFF66' }),
                node.div().setStyle({ width: barWidth + 'px', height: '100%', background: '#000000AA', borderRight: '1px solid #FFFFFF66' }),
                node.div().setStyle({ width: barWidth * 1.5 + 'px', height: '100%', background: '#000000AA', borderRight: '1px solid #FFFFFF66' }),
                node.div().setStyle({ position: 'absolute', height: '5px', width: barWidth * 5.5 + 'px', background: 'rgba(255, 0, 0, 0.55)', bottom: '0px' }),
                node.div('popupHint').setClass('opani').setStyle({ position: 'absolute', width: '100%', bottom: '100px', fontFamily: 'impact', fontSize: '43px', textAlign: 'center' }),
                node.div('popupLevel').setStyle({ position: 'absolute', width: '100%', bottom: '150px', fontFamily: 'impact', fontSize: '60px', textAlign: 'center', opacity: '0', transition: 'opacity .05s' })
            ]),
            node.div('barControls').setStyle({ position: 'absolute', left: '0px', bottom: '0px', width: '413px', height: '150px', background: '#171716ff' }).setChildren([
                node.div('k0').setStyle({ position: 'absolute', border: '1px solid #111', borderRadius: '5px', left: 0 + 'px', bottom: '0px', width: barWidth + 'px', height: '130px', background: '#FFFFFFCC', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'end' }).setChildren([node.div().setText('Z')]),
                node.div('k2').setStyle({ position: 'absolute', border: '1px solid #111', borderRadius: '5px', left: barWidth + 'px', bottom: '0px', width: barWidth + 'px', height: '130px', background: '#FFFFFFCC', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'end' }).setChildren([node.div().setText('X')]),
                node.div('k4').setStyle({ position: 'absolute', border: '1px solid #111', borderRadius: '5px', left: barWidth * 2 + 'px', bottom: '0px', width: barWidth + 'px', height: '130px', background: '#FFFFFFCC', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'end' }).setChildren([node.div().setText('C')]),
                node.div('k6').setStyle({ position: 'absolute', border: '1px solid #111', borderRadius: '5px', left: barWidth * 3 + 'px', bottom: '0px', width: barWidth + 'px', height: '130px', background: '#FFFFFFCC', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'end' }).setChildren([node.div().setText('V')]),
                node.div('k1').setStyle({ position: 'absolute', border: '1px solid #111', borderRadius: '5px', left: barWidth / 2 + 5 + 'px', bottom: '40px', width: barWidth - 10 + 'px', height: '100px', background: '#111', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'end' }).setChildren([node.div().setText('S')]),
                node.div('k3').setStyle({ position: 'absolute', border: '1px solid #111', borderRadius: '5px', left: barWidth / 2 * 3 + 5 + 'px', bottom: '40px', width: barWidth - 10 + 'px', height: '100px', background: '#111', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'end' }).setChildren([node.div().setText('D')]),
                node.div('k5').setStyle({ position: 'absolute', border: '1px solid #111', borderRadius: '5px', left: barWidth / 2 * 5 + 5 + 'px', bottom: '40px', width: barWidth - 10 + 'px', height: '100px', background: '#111', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'end' }).setChildren([node.div().setText('F')]),
                node.div('disk').setStyle({ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', right: '-56px', top: '76px', width: '112px', height: '112px', background: '#333', borderRadius: '100%', transform: 'translate(-50%, -50%) rotate(0deg)' }).setChildren([
                    node.div().setStyle({ border: '1px solid gray', width: '100%' }),
                    node.div('diskCover').setStyle({ position: 'absolute', width: '60px', height: '60px', right: '26px', top: '26px', background: '#999', borderRadius: '100%', border: '3px solid #fef9e6ff' })
                ])
            ]),
            node.div('timeBar').setStyle({ position: 'absolute', left: '413px', top: '0px', width: '10px', height: '100%', background: '#171716ff' }).setChildren([
                node.div('timeBarThumb').setStyle({ position: 'absolute', borderBottom: '1px solid orange', width: '8px', left: '1px', top: '0px' })
            ])
        ]),
        node.divimg('loading', 'samples/probeat/bg.jpg').setStyle({ position: 'absolute', left: '0px', top: '0px', width: '100vw', height: '100dvh' }).setChildren([
            node.div('loadingText').setStyle({ position: 'absolute', background: '#333333CC', bottom: '0px', left: '0px', width: '100vw', textAlign: 'center' }).setText('loading')
        ]),
    ])

    let ctx = jsdom.getChildById('canvasColor').getContext2D()
    let ctxScreen = jsdom.getChildById('canvasScreen').getContext2D()
    let barContainer = jsdom.getChildById('barContainer')
    let disk = jsdom.getChildById('disk')
    let diskCover = jsdom.getChildById('diskCover')
    let popupHint = jsdom.getChildById('popupHint')
    let popupLevel = jsdom.getChildById('popupLevel')
    let timeBarThumb = jsdom.getChildById('timeBarThumb')
    let loading = jsdom.getChildById('loading')
    let loadingText = jsdom.getChildById('loadingText')

    let deg = 0
    jsdom.onGlobalEvent(GlobalEvent.SYSTEM_LOOP, () => {
        disk.setStyle({ transform: `translate(-50%, -50%) rotate(${(deg += 5) % 360}deg)` })
    });

    node.opacityAnimation('opani', '.1s');

    (async () => {

        let bms = await BMSLoader.loadBMS('assets/' + resourceURL, 'J219-bms-copy.txt')
        loading.setStyle({ background: `url(${node.getAssetsPath(resourceURL + bms.stagefile)})`, backgroundSize: 'cover' })
        let bmpRC = await BMSLoader.loadImages((type, cur, total, filename) => {
            console.log(type, cur, '/', total, filename, 'loaded')
            loadingText.setText([type, cur, '/', total, filename, 'loaded'].join(' '))
        })
        let wavRC = await BMSLoader.loadSounds((type, cur, total, filename) => {
            console.log(type, cur, '/', total, filename, 'loaded')
            loadingText.setText([type, cur, '/', total, filename, 'loaded'].join(' '))
        })
        // sleep for a while
        await new Promise(r => setTimeout(r, 3000))
        console.log(bms)
        loading.remove()

        // 轉盤
        diskCover.setStyle({ background: `url(${node.getAssetsPath(resourceURL + bms.stagefile)})`, backgroundSize: 'cover' })

        let missRC = bmpRC[0]
        let isMissTimer = -1
        let barCounter = 0
        let dataRC = JSON.parse(JSON.stringify(bms.data));
        let barRC = generateBarsWithDuration(bms.data, duration);
        let measureInfo = null

        // 動畫迴圈
        loop = loop.bind(this)
        let startTime = 0
        let start = () => {
            startTime = performance.now()
            requestAnimationFrame(loop)
        }
        requestAnimationFrame(start)

        // keyboard 事件綁定
        let keys = {
            'z': false,
            's': false,
            'x': false,
            'd': false,
            'c': false,
            'f': false,
            'v': false,
            ' ': false,
        }
        let keysAudio = {
            'z': false,
            's': false,
            'x': false,
            'd': false,
            'c': false,
            'f': false,
            'v': false,
            ' ': false,
        }
        window.onkeydown = e => {
            e.preventDefault()

            if (keys[e.key]) return
            let j = -1
            switch (e.key) {
                case 'z': j = 0; break;
                case 's': j = 1; break;
                case 'x': j = 2; break;
                case 'd': j = 3; break;
                case 'c': j = 4; break;
                case 'f': j = 5; break;
                case 'v': j = 6; break;
                case ' ': j = 7; break;
            }
            if (j == -1) return

            keysAudio[e.key] = true

            let lightBar = createLightbar(j)

            let keyBar = j == 7 ? disk : jsdom.getChildById('k' + j)
            keyBar.setStyle({ boxShadow: `inset 0 0 50px ${reactColor}` })

            let delay = true
            keys[e.key] = { lightBar, keyBar, delay }
        }

        let leave = true // leave game
        function leaveGame() {
            needLeave = true
            Object.values(wavRC).forEach(a => a.unload())
            router.go('probeat_result')
        }

        window.onkeyup = e => {
            e.preventDefault()

            if (keys[e.key]) {
                keys[e.key].lightBar.remove()
                keys[e.key].keyBar.setStyle({ boxShadow: 'inset 0 0 0px transparent' })
                keys[e.key] = null
            }
            keysAudio[e.key] = false

            // 離開遊戲
            if (e.key == 'Escape' && leave) {
                leave = false
                leaveGame()
            }
        }

        if (isAutoPlay) {
            window.onkeydown = null
            window.onkeyup = e => {
                // 離開遊戲
                if (e.key == 'Escape' && leave) {
                    leave = false
                    leaveGame()
                }
            }
        }

        let needLeave = false
        jsdom.onGlobalEvent(GlobalEvent.SYSTEM_LEAVE_ROUTER_VIEW, () => { needLeave = true, Object.values(wavRC).forEach(a => a.unload()) })

        function loop() {

            if (needLeave) return

            const tDiff = performance.now() - startTime
            if (measureInfo) {
                // 圖像播放
                for (let i = 0, l = measureInfo.bmp.id.length; i < l; i++) {
                    if (tDiff > measureInfo.bmp.timing[i]) {
                        let frame = bmpRC[measureInfo.bmp.id[i]]
                        ctxScreen.drawImage(frame, 0, 0)
                        ctx.drawImage(frame, 0, 0)
                        if (isMissTimer > -1) {
                            ctx.globalAlpha = .3
                            ctx.drawImage(missRC, 0, 0)
                            ctx.globalAlpha = 1
                        }
                        measureInfo.bmp.id.shift()
                        measureInfo.bmp.timing.shift()
                        i--
                        l--
                    } else break;
                }
                // 聲音播放
                for (let i = 0, l = measureInfo.wav.id.length; i < l; i++) {
                    if (tDiff > measureInfo.wav.timing[i]) {
                        let audio = wavRC[measureInfo.wav.id[i]];
                        audio.play()
                        measureInfo.wav.id.shift()
                        measureInfo.wav.timing.shift()
                        i--
                        l--
                    } else break;
                }


                if (isAutoPlay) {
                    // 音符播放 (auto play)
                    for (let j = 0, jl = measureInfo.note.key.length; j < jl; j++) {
                        let key = measureInfo.note.key[j];
                        for (let i = 0, l = key.id.length; i < l; i++) {
                            if (tDiff > key.timing[i]) {
                                let audio = wavRC[key.id[i]];
                                audio.play();
                                key.id.shift();
                                key.timing.shift();
                                i--;
                                l--;
                            } else break;
                        }
                    }
                } else {

                    // 音符播放 (manual play - search first audio) 
                    let hasAudio = false
                    for (let i = 0, l = dataRC.length; i < l; i++) {
                        let info = dataRC[i]
                        for (let j = 0, jl = info.note.key.length; j < jl; j++) {
                            let key = info.note.key[j]
                            let adoKey = Object.keys(keysAudio)[j]
                            for (let k = 0, kl = key.id.length; k < kl; k++) {
                                let audioId = key.id[k]
                                if (audioId && keysAudio[adoKey]) {
                                    let audio = wavRC[audioId]
                                    audio.play()
                                    keysAudio[adoKey] = false
                                    hasAudio = true
                                }
                                if (info == measureInfo) {
                                    if (tDiff > key.timing[k]) {
                                        key.id.shift()
                                        key.timing.shift()
                                        k--
                                        kl--
                                    }
                                }
                            }
                        }
                        if (hasAudio) break
                    }

                }

                // 確認音符播放完畢 keyslen == 0
                let keyslen = measureInfo.note.key.map(info => info.length).reduce((i, s) => i + s);
                // 聲音圖像播完換下一小節
                if (!measureInfo.wav.id.length && !measureInfo.bmp.id.length && !keyslen) {
                    dataRC.shift();
                    measureInfo = null;
                }
            }
            // 取得小節資訊
            if (!measureInfo) {
                for (let i = 0, l = dataRC.length; i < l; i++) {
                    let info = dataRC[i]
                    if (tDiff > info.timing) {
                        measureInfo = info;
                        i--;
                        l--;
                    } else break;
                }
            }

            // 音符在指定時間出現
            for (let j = 0, jl = barRC.length; j < jl; j++) {
                let bar = barRC[j]
                for (let i = 0, l = bar.id.length; i < l; i++) {
                    if (tDiff > bar.timing[i]) {
                        // create bar
                        let n = createBar(j)
                        setTimeout(() => {
                            n.setStyle({ top: 'calc(100% + 50px)' })

                            // keyboard trace (manual)
                            if (!isAutoPlay) {
                                n.onGlobalEvent(GlobalEvent.SYSTEM_LOOP, () => {
                                    let nb = n.getHtmlTag().getBoundingClientRect().bottom
                                    let bcb = barContainer.getHtmlTag().getBoundingClientRect().bottom
                                    let key = Object.keys(keys)[j]
                                    if (key && keys[key] && keys[key].delay) {
                                        let level = Math.abs(nb - bcb)
                                        if (level <= 100) {
                                            let circle = createCircleScaleEffect(j)
                                            setTimeout(() => { circle.setStyle({ border: `0px solid ${reactColor2}`, scale: '2' }) })
                                            setTimeout(() => { circle.remove() }, 500)

                                            n.noMiss = true
                                            if (popupLevel.getStyle().opacity == '0') popupLevel.setStyle({ opacity: '1' })

                                            popupLevel.setText('MISS').setStyle({ color: 'purple', opacity: '1' })

                                            let state = 'miss'
                                            if (level <= 100 / 5 * 4) {
                                                state = 'bad'
                                                popupLevel.setText('BAD').setStyle({ color: 'blue', opacity: '1' })
                                            }
                                            if (level <= 100 / 5 * 3) {
                                                state = 'good'
                                                popupLevel.setText('GOOD').setStyle({ color: 'yellow', opacity: '1' })
                                            }
                                            if (level <= 100 / 5 * 2) {
                                                state = 'great'
                                                popupLevel.setText('GREAT').setStyle({ color: 'green', opacity: '1' })
                                            }
                                            if (level <= 100 / 5 * 1) {
                                                state = 'best'
                                                popupLevel.setText('BEST').setStyle({ color: 'orange', opacity: '1' })
                                            }
                                            score[state][0]++
                                            setTimeout(() => { popupLevel.setStyle({ opacity: '0' }) }, 1000)

                                            if (popupLevel.getText() != 'MISS') comboCounter++

                                            if (comboCounter > 5) {
                                                popupHint.setStyle({ display: 'block' })
                                                popupHint.setText('combo' + (comboCounter))
                                            } else {
                                                popupHint.setStyle({ display: 'none' })
                                            }
                                        }

                                        // delay remove
                                        if (keys[key].delay) {
                                            keys[key].delay = false
                                            setTimeout(() => {
                                                keys[key]?.lightBar.remove()
                                                keys[key]?.keyBar.setStyle({ boxShadow: 'inset 0 0 0px transparent' })
                                                keys[key] = null
                                            }, 80)
                                        }
                                    }
                                })
                            }

                            // auto play mode
                            setTimeout(() => {
                                n.remove()

                                if (isAutoPlay) {
                                    // lightBar display
                                    let lightBar = createLightbar(j)
                                    setTimeout(() => { lightBar.remove() }, 80)

                                    // key highlighter
                                    let key = j == 7 ? disk : jsdom.getChildById('k' + j)
                                    key.setStyle({ boxShadow: `inset 0 0 50px ${reactColor}` })
                                    setTimeout(() => { key.setStyle({ boxShadow: 'inset 0 0 0px transparent' }) }, 80)

                                    // circle scale effect
                                    let circle = createCircleScaleEffect(j)
                                    setTimeout(() => { circle.setStyle({ border: `0px solid ${reactColor2}`, scale: '2' }) })
                                    setTimeout(() => { circle.remove() }, 500)

                                    // combo counter
                                    popupHint.setText('combo' + (++comboCounter))
                                    if (comboCounter > 5) {
                                        popupHint.setStyle({ display: 'block' })
                                        popupHint.setText('combo' + (comboCounter))
                                    }

                                    // level
                                    popupLevel.setText('BEST').setStyle({ color: 'orange', opacity: '1' })
                                    setTimeout(() => { popupLevel.setStyle({ opacity: '0' }) }, 1000)
                                    score['best'][0]++
                                } else {
                                    // miss handle
                                    if (!n.noMiss) {
                                        comboCounter = 0

                                        popupLevel.setText('MISS').setStyle({ color: 'purple', opacity: '1' })
                                        setTimeout(() => { popupLevel.setStyle({ opacity: '0' }) }, 1000)
                                        score['miss'][0]++

                                        clearTimeout(isMissTimer)
                                        isMissTimer = setTimeout(() => { isMissTimer = -1 }, 300)
                                    }
                                }

                                barCounter++
                                if (barCounter >= bms.totalNote && !needLeave) {
                                    popupHint.setStyle({ display: 'none' })
                                    needLeave = true
                                    setTimeout(() => {
                                        router.go('probeat_result', node.sceneTransition(
                                            node.div().setText('Pro Beat').setStyle({ fontFamily: 'impact', color: 'white', fontSize: '35px' })
                                        ))
                                    }, 3000)
                                }
                                timeBarThumb.setStyle({ top: `calc(100% * ${barCounter} / ${bms.totalNote})` })

                            }, duration)
                        })
                        bar.id.shift()
                        bar.timing.shift()
                        i--
                        l--
                    } else break
                }
            }
            requestAnimationFrame(loop)
        }

        function createBar(j) {
            let barColor = j % 2 ? 'blue' : 'lightgray'
            let n = node.div().setStyle({
                background: j == 7 ? 'red' : barColor,
                borderBottom: '2px solid black',
                borderTop: '2px solid white',
                position: 'absolute',
                width: j == 7 ? (barWidth * 1.5 + 'px') : (barWidth + 'px'),
                height: '10px',
                left: j == 7 ? `${(j + 1) * barWidth * .5}px` : `${j * barWidth * .5}px`,
                top: '-10px',
                transition: `top ${duration / 1000}s linear`,
            })
            barContainer.pushChild(n)
            return n
        }

        function createLightbar(j) {
            let lightBar = node.div().setStyle({
                opacity: '.5',
                background: `linear-gradient(180deg, ${reactColor} , #ffffffff)`,
                boxShadow: `inset 0 0 50px ${reactColor}`,
                mixBlendMode: 'lighten',
                position: 'absolute',
                width: j == 7 ? (barWidth * 1.5 + 'px') : (barWidth + 'px'),
                left: j == 7 ? `${(j + 1) * barWidth * .5}px` : `${j * barWidth * .5}px`,
                top: '0px',
                height: '100%',
                zIndex: '99',
            })
            barContainer.pushChild(lightBar)
            return lightBar
        }

        function createCircleScaleEffect(j) {
            let circle = node.div().setStyle({
                opacity: '.5',
                background: 'transparent',
                mixBlendMode: 'screen',
                position: 'absolute',
                width: j == 7 ? (barWidth * 1.5 + 'px') : (barWidth + 'px'),
                left: j == 7 ? `${(j + 1) * barWidth * .5}px` : `${j * barWidth * .5}px`,
                bottom: -(j == 7 ? (barWidth * 1.5) : (barWidth)) / 2 + 'px',
                height: j == 7 ? (barWidth * 1.5 + 'px') : (barWidth + 'px'),
                zIndex: '99',
                borderRadius: '100%',
                border: `20px solid ${reactColor}`,
                scale: '1',
                transition: 'all .5s'
            })
            barContainer.pushChild(circle)
            return circle
        }

        /**
         * 音符出現資源設定 (所有音符提早 duration 時間出現)
         * @param data bms.data
         * @param duration 音符出現時間設定 (毫秒)
         * @returns 
         */
        function generateBarsWithDuration(data, duration) {
            const keyArr = data.map(d => d.note.key)
            let timing = {}
            let id = {}
            let result = []
            for (let j = 0, jl = keyArr.length; j < jl; j++) {
                const keys = keyArr[j]
                for (let i = 0, il = keys.length; i < il; i++) {
                    timing[i] = timing[i] || []
                    timing[i] = [...timing[i], ...keys[i].timing]
                    id[i] = id[i] || []
                    id[i] = [...id[i], ...keys[i].id]
                }
            }
            Object.keys(timing).forEach(tk => result.push({ id: id[tk], timing: timing[tk].map(t => t - duration) }))
            return result;
        }

    })()

    return jsdom
}