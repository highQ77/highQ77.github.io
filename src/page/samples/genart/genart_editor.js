import { GlobalEvent, zIndex } from "../../../core/config.js"
import { node } from "../../../core/node.js"
import { router } from "../../../core/router.js"

import { AbstractPaint } from "./effectLib/art/AbstractPaint.js"
import { ArcMatrix } from "./effectLib/art/ArcMatrix.js"
import { Ascii2D } from "./effectLib/art/Ascii2D.js"
import { Bloom } from "./effectLib/art/Bloom.js"
import { Circle } from "./effectLib/art/Circle.js"
import { CircleNoise } from "./effectLib/art/CircleNoise.js"
import { CirclePaint } from "./effectLib/art/CirclePaint.js"
import { CirclePaint2 } from "./effectLib/art/CirclePaint2.js"
import { CircleRadial } from "./effectLib/art/CircleRadial.js"
import { CircleStack } from "./effectLib/art/CircleStack.js"
import { Colorize } from "./effectLib/art/Colorize.js"
import { CSSBlur } from './effectLib/art/CSSBlur.js'
import { CSSBrightness } from "./effectLib/art/CSSBrightness.js"
import { CSSContrast } from "./effectLib/art/CSSContrast.js"
import { CSSGrayscale } from "./effectLib/art/CSSGrayscale.js"
import { CSSHueRotate } from "./effectLib/art/CSSHueRotate.js"
import { CSSInvert } from "./effectLib/art/CSSInvert.js"
import { CSSSaturate } from "./effectLib/art/CSSSaturate.js"
import { Dot } from "./effectLib/art/Dot.js"
import { Duotone } from "./effectLib/art/Duotone.js"
import { Edge } from "./effectLib/art/Edge.js"
import { EdgeCircle } from "./effectLib/art/EdgeCircle.js"
import { EdgeDetect } from "./effectLib/art/EdgeDetect.js"
import { Emoji } from "./effectLib/art/Emoji.js"
import { EmojiCustom } from "./effectLib/art/EmojiCustom.js"
import { EmojiMatrix } from "./effectLib/art/EmojiMatrix.js"
import { Explode } from "./effectLib/art/Explode.js"
import { Fur } from "./effectLib/art/Fur.js"
import { GlowRay } from "./effectLib/art/GlowRay.js"
import { Kaleidoscope } from "./effectLib/art/Kaleidoscope.js"
import { Kaleidoscope2 } from "./effectLib/art/Kaleidoscope2.js"
import { Level } from "./effectLib/art/Level.js"
import { LevelAssign } from "./effectLib/art/LevelAssign.js"
import { LevelColor } from "./effectLib/art/LevelColor.js"
import { LevelRandom } from "./effectLib/art/LevelRandom.js"
import { MicroRect } from "./effectLib/art/MicroRect.js"
import { Mirror } from "./effectLib/art/Mirror.js"
import { Noise } from "./effectLib/art/Noise.js"
import { Pixelate } from "./effectLib/art/Pixelate.js"
import { PolyAbstract } from "./effectLib/art/PolyAbstract.js"
import { PolyGradient } from "./effectLib/art/PolyGradient.js"
import { Rain } from "./effectLib/art/Rain.js"
import { SVGGlass } from "./effectLib/art/SVGGlass.js"
import { SVGTurb } from "./effectLib/art/SVGTurb.js"
import { Flash } from "./effectLib/gen/Flash.js"
import { LineSpiral } from "./effectLib/gen/LineSpiral.js"
import { RandomCircles } from "./effectLib/gen/RandomCircles.js"
import { RandomGradientLines } from "./effectLib/gen/RandomGradientLines.js"
import { RandomLines } from "./effectLib/gen/RandomLines.js"
import { RandomLinesVH } from "./effectLib/gen/RandomLinesVH.js"
import { RandomRects } from "./effectLib/gen/RandomRects.js"
import { RandomTextPool } from "./effectLib/gen/RandomTextPool.js"
import { SpiralAdvance } from "./effectLib/gen/SpiralAdvance.js"

import { genart_data } from "./effectLib/genart_data.js"
import { CircleMatrix } from "./effectLib/pattern/CircleMatrix.js"
import { Circles } from "./effectLib/pattern/Circles.js"
import { Pyramid } from "./effectLib/pattern/Pyramid.js"
import { RandomRadioCircles } from "./effectLib/pattern/RandomRadioCircles.js"
import { Stream } from "./effectLib/pattern/Stream.js"
import { StripeH } from "./effectLib/pattern/StripeH.js"
import { StripeV } from "./effectLib/pattern/StripeV.js"
import { Totem } from "./effectLib/pattern/Totem.js"
import { Totem2 } from "./effectLib/pattern/Totem2.js"
import { Weaver } from "./effectLib/pattern/Weaver.js"
import { Web } from "./effectLib/pattern/Web.js"



export function genart_editor() {

    // top bar dropdown menu
    const menuItem = (item, hotkey) => {
        return node.div().setStyle({ display: 'flex', justifyContent: 'space-between', color: '#333', padding: '5px 10px', width: '100%' }).setClass('anitool_menu_item').setChildren([
            node.div().setText(item),
            node.div().setText(hotkey)
        ])
    }
    const menu_file = () => node.div().setStyle({ display: 'none', position: 'absolute', width: '250px', left: '-18px', top: '1em', zIndex: zIndex.popup, border: '10px solid transparent', boxSizing: 'content-box' }).setChildren([
        node.div().setStyle({ borderRadius: '6px', overflow: 'hidden', background: '#ffffff99', backdropFilter: 'blur(10px)' }).setChildren([
            menuItem('Open Image File', '⌘ + 2').on('click', (_, t) => { t.getParent().getParent().setStyle({ display: 'none' }); openImage() }),
            menuItem('Save Image', '⌘ + 3').on('click', (_, t) => { t.getParent().getParent().setStyle({ display: 'none' }); saveImage() }),
            menuItem('Import Layers Data', '⌘ + 4').on('click', (_, t) => { t.getParent().getParent().setStyle({ display: 'none' }); loadLayers() }),
            menuItem('Save Layers Data', '⌘ + 5').on('click', (_, t) => { t.getParent().getParent().setStyle({ display: 'none' }); saveLayers() }),
            node.hr().setStyle({ background: '#999' }),
            menuItem('Render Layers', '⌘ + 1').on('click', (_, t) => { t.getParent().getParent().setStyle({ display: 'none' }); render() }),
            node.hr().setStyle({ background: '#999' }),
            // menuItem('Chill.js').on('click', (_, t) => { t.getParent().getParent().setStyle({ display: 'none' }) }),
            // menuItem(`William's Works`).on('click', (_, t) => { t.getParent().getParent().setStyle({ display: 'none' }) }),
            menuItem('About Author', '').on('click', (_, t) => { t.getParent().getParent().setStyle({ display: 'none' }), node.alert('author: William77 / 威廉 / 梁紘謙 <br> mail: highqualityliang.77@gmail.com <br> skill 1: Game Dev <br> skill 2: Web App Dev <br> skill 3: Visual Design & Photography').setStyle({ fontSize: '14px' }) }),
            menuItem('Facebook Group', '').on('click', (_, t) => { t.getParent().getParent().setStyle({ display: 'none' }), node.alert(`<a href="https://www.facebook.com/groups/1072197384859596" target="_blank" style="color: white; text-decoration: none">🔗 Generative Art Taiwan</a>`) }),
        ])
    ]).on('mouseleave', (e, t) => { t.setStyle({ display: 'none' }) })

    // menu css setting
    node.appendClasses({
        '.anitool_topbar_menu_item:hover': { background: '#89898966', cursor: 'pointer' },
        '.anitool_menu_item:hover': { background: '#62ff0066', cursor: 'pointer' }
    })

    // top bar menu show / hide event
    let navBarBtns = (e, t) => {
        t.getParent().getParent().getChildren().forEach(i => {
            i.getChildren()[0]?.setStyle({ display: 'none' })
        })
        t.getParent().getChildren()[0].setStyle({ display: 'block' })
    }

    // top bar menu setting
    let topbar = node.div().setStyle({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#333', gap: '18px', height: '33px', borderBottom: '2px solid #222', fontSize: '.9em' }).setChildren([
        node.div().setStyle({ display: 'flex', gap: '1px', alignItems: 'center' }).setChildren([
            node.div().setText('☮︎').setStyle({ margin: '0 10px', fontSize: '25px', color: 'yellowgreen' }),
            node.div().setText('Gen-Artist').setClass('anitool_topbar_menu_item').setStyle({ padding: '2px', borderRadius: '5px', minWidth: '50px', textAlign: 'center' }),
            node.div().setStyle({ position: 'relative', cursor: 'pointer' }).setChildren([
                menu_file(),
                node.div().setText('File').setClass('anitool_topbar_menu_item').setStyle({ padding: '2px', borderRadius: '5px', minWidth: '50px', textAlign: 'center' }).on('click', navBarBtns).on('mouseenter', navBarBtns),
            ]),
            node.div().setText('generative art software demo. powered by William77').setStyle({ margin: '0px 20px', fontSize: '12px', color: 'rgba(137, 137, 137, .7)' }),
        ]),
        node.button().setText('w77').on('click', () => {
            router.go('works')
        }),
    ])


    // left side toolbar
    let editTpl = exec => {
        let btnStyles = { display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '1px', cursor: 'pointer', width: '20px', height: '18px', borderRadius: '5px' }
        let edit = node.div().setStyle({ display: 'flex', gap: '2px', outline: '1px solid #333', fontSize: '13px', color: '#999', padding: '2px' }).setChildren([
            node.div().setStyle({ display: 'flex', alignItems: 'center', gap: '2px' }).setChildren([
                node.div('flag').setText('☀️').setStyle({ ...btnStyles, border: '1px solid orange' }).on('click', (e, t) => {
                    if (t.getText() == '☀️') {
                        t.setText('🫥')
                    } else {
                        t.setText('☀️')
                    }
                }),
                node.div().setText('x').setStyle({ ...btnStyles, border: '1px solid red' }).on('click', () => {
                    let idx = layer.getChildren().findIndex(i => i == edit)
                    if (idx > -1) {
                        layer.removeChildAt(idx)
                        properties.removeChildren()
                        render()
                    }
                }),
                node.div().setText('˄').setStyle({ ...btnStyles, border: '1px solid yellowgreen' }).on('click', () => {
                    let idx = layer.getChildren().findIndex(i => i == edit)
                    if (idx > 0) {
                        exec = edit.getChildById('command').getText() || exec
                        layer.removeChildAt(idx)
                        let filterName = eval(exec.split('({')[0])
                        layer.addChildAt(editItem(filterName, exec).edit, idx - 1)
                    }
                }),
                node.div().setText('˅').setStyle({ ...btnStyles, border: '1px solid yellowgreen' }).on('click', () => {
                    let idx = layer.getChildren().findIndex(i => i == edit)
                    exec = edit.getChildById('command').getText() || exec
                    layer.removeChildAt(idx)
                    let filterName = eval(exec.split('({')[0])
                    layer.addChildAt(editItem(filterName, exec).edit, idx + 1)
                }),
            ]),
            node.div('command').setText(exec).setStyle({ display: 'flex', alignItems: 'center' })
        ])
        return edit
    }

    // menu functions
    let render = _ => {
        // render
        vctx.drawImage(img, 0, 0, vctx.canvas.width, vctx.canvas.height)
        let result = layer.getChildren().map(ch => ch.getChildById('flag').getText() == '☀️' && ch.getChildById('command')?.getText().replace('@', '')).join('\n')
        eval(result)
    }

    async function openImageFile() {
        return new Promise(resolve => {
            let input = document.createElement('input')
            input.type = 'file'
            input.onchange = _ => {
                let fr = new FileReader
                fr.onload = e => {
                    resolve(e.target.result)
                }
                fr.readAsDataURL(input.files[0])
            }
            input.click()
        })
    }

    function saveImageFile(fileName) {
        // save image
        const dataURL = vctx.canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.download = fileName
        downloadLink.href = dataURL
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    }

    function saveTextAsFile(text, fileName) {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
        const downloadLink = document.createElement('a')
        downloadLink.download = fileName
        downloadLink.href = window.URL.createObjectURL(blob)
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        window.URL.revokeObjectURL(downloadLink.href)
    }

    async function loadTextFile() {
        return new Promise(resolve => {
            let input = document.createElement('input')
            input.type = 'file'
            input.onchange = _ => {
                let fr = new FileReader
                fr.onload = e => {
                    resolve(e.target.result)
                }
                fr.readAsText(input.files[0], 'utf-8')
            }
            input.click()
        })
    }

    let openImage = async _ => {
        let src = await openImageFile()
        img.src = src
    }

    let saveImage = _ => {
        let name = prompt(`your artwork image's name?`, '')
        if (name) saveImageFile('gen-artist-' + Date.now() + '-' + name + '.png')
    }

    let saveLayers = _ => {
        // save layers
        let dumpText = layer.getChildren().map(ch => {
            return (ch.getChildById('flag').getText() == '☀️' ? '@' : '')
                + ch.getChildById('command')?.getText()
        }).join('\n')
        if (dumpText == '') return alert(`no layers' data.`);
        let name = prompt(`your artwork layers' name?`, '')
        saveTextAsFile(dumpText, 'gen-artist-' + Date.now() + '-' + name + '.txt')
    }

    let loadLayers = async _ => {
        // load layers
        let text = await loadTextFile()
        let lines = text.split('\n').map(i => i.trim()).filter(i => i != '')
        let linesFlag = lines.map(line => line[0])
        lines.map(i => i.split('({')[0]).forEach(i => {
            if (i[0] == '@') i = i.slice(1)
            toolBar.getChildById(i).dispatch('click')
        })
        layer.getChildren().forEach((c, idx) => {
            c.getChildById('flag').setText(linesFlag[idx] == "@" ? '☀️' : '🫥')
            c.getChildById('command').setText(lines[idx].replace('@', ''))
        })
        render()
    }

    let editItem = (filter, exec) => {
        let params = genart_data[filter.name].params
        if (exec) params = JSON.parse(exec.split('(')[1].split(')')[0])
        let help = genart_data[filter.name].help
        exec = exec || `${filter.name}(${JSON.stringify(params)})`
        let edit = editTpl(exec)
        edit.on('click', () => {
            let pObj = JSON.parse(edit.getChildById('command').getText().split('(')[1].split(')')[0])
            edit.getParent().getChildren().forEach(i => i.setStyle({ background: 'transparent' }))
            edit.setStyle({ background: '#444' })
            properties.removeChildren()
            properties.pushChild(node.div().setText(filter.name).setStyle({ lineHeight: '3em', color: 'yellowgreen' }))
            Object.keys(params).forEach(key => {
                properties.pushChild(
                    node.div().setStyle({ display: 'flex', padding: '2px' }).setChildren([
                        node.div('pk').setStyle({ width: '33%' }).setText(key),
                        node.div().setStyle({ width: '33%' }).setText(help[key]),
                        node.div('pv').setStyle({ width: '33%' }).setStyle({ border: '1px solid gray' }).setText(pObj[key] || params[key])
                    ])
                )
            })
            let ps = properties.getChildren().filter((i, idx) => idx > 0)
            ps.forEach(i => i.getChildById('pv').getHtmlTag().contentEditable = true)
            ps.forEach((i, idx) => i.getChildById('pv').on('mouseleave', (e, t) => {
                let cmd = edit.getChildById('command')
                let pobj = {}
                ps.forEach(i => {
                    let v = i.getChildById('pv').getText()
                    if (v[0] != '#') {
                        if (!isNaN(parseFloat(v[v.length - 1]))) v = parseFloat(i.getChildById('pv').getText())
                        if (v == 'true') v = true
                        if (v == 'false') v = false
                    }
                    pobj[i.getChildById('pk').getText()] = v
                })
                cmd.setText(`${filter.name}(${JSON.stringify(pobj)})`)
                params = pobj
                render()
            }))
            // ps.forEach((i, idx) => i.getChildById('pv').on('blur', () => {
            //     render()
            // }))
        })
        return { edit, exec }
    }

    // effect buttons
    let effectBtns = filter =>
        node.div(filter.name).setText('＋ ' + filter.name).setStyle({ fontSize: '13px', padding: '2px 10px', borderBottom: '1px solid #666', cursor: 'pointer' }).on('click', (e, t) => {
            let { edit, exec } = editItem(filter)
            layer.pushChild(edit)
            eval(exec)
        })

    let toolBar = node.div().setStyle({ display: 'flex', flexDirection: 'column', gap: '3px', width: '200px', height: '100%', borderRight: '2px solid #111', padding: '0px 0px' }).setChildren([
        node.div().setText('★ art filters').setStyle({ border: '.5px solid yellowgreen', background: '#444', padding: '0px 10px', fontSize: '13px' }),
        // effectBtns(AbstractPaint),
        effectBtns(ArcMatrix),
        effectBtns(Ascii2D),
        effectBtns(Bloom),
        effectBtns(Circle),
        effectBtns(CircleNoise),
        effectBtns(CirclePaint),
        effectBtns(CirclePaint2),
        effectBtns(CircleRadial),
        effectBtns(CircleStack),
        effectBtns(Colorize),
        effectBtns(CSSBlur),
        effectBtns(CSSBrightness),
        effectBtns(CSSContrast),
        effectBtns(CSSGrayscale),
        effectBtns(CSSHueRotate),
        effectBtns(CSSInvert),
        effectBtns(CSSSaturate),
        // effectBtns(Dot),
        effectBtns(Duotone),
        // effectBtns(Edge),
        effectBtns(EdgeCircle),
        effectBtns(EdgeDetect),
        // effectBtns(Emoji),
        effectBtns(EmojiCustom),
        // effectBtns(EmojiMatrix),
        // effectBtns(Explode),
        effectBtns(Fur),
        effectBtns(GlowRay),
        effectBtns(Kaleidoscope),
        effectBtns(Kaleidoscope2),
        // effectBtns(Level),
        // effectBtns(LevelAssign),
        // effectBtns(LevelColor),
        effectBtns(LevelRandom),
        effectBtns(MicroRect),
        effectBtns(Mirror),
        // effectBtns(Noise),
        effectBtns(Pixelate),
        effectBtns(PolyAbstract),
        effectBtns(PolyGradient),
        effectBtns(Rain),
        effectBtns(SVGGlass),
        effectBtns(SVGTurb),
        node.div().setText('★ visual gen').setStyle({ border: '.5px solid yellowgreen', background: '#444', padding: '0px 10px', fontSize: '13px' }),
        effectBtns(Flash),
        effectBtns(LineSpiral),
        effectBtns(RandomCircles),
        effectBtns(RandomGradientLines),
        effectBtns(RandomLines),
        effectBtns(RandomLinesVH),
        effectBtns(RandomRects),
        effectBtns(RandomTextPool),
        effectBtns(SpiralAdvance),
        node.div().setText('★ patterns').setStyle({ border: '.5px solid yellowgreen', background: '#444', padding: '0px 10px', fontSize: '13px' }),
        effectBtns(CircleMatrix),
        effectBtns(Circles),
        effectBtns(Pyramid),
        effectBtns(RandomRadioCircles),
        effectBtns(Stream),
        effectBtns(StripeH),
        effectBtns(StripeV),
        effectBtns(Totem),
        effectBtns(Totem2),
        effectBtns(Weaver),
        effectBtns(Web),
        // more in future...
        node.div().setText('more in future...').setStyle({ background: '#444', padding: '0px 10px', fontSize: '13px' }),
    ])


    // main scene view
    let sceneView = node.div().setStyle({ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', overflow: 'hidden' }).setChildren([
        node.div('sceneViewContent').setStyle({ position: 'relative', background: '#999' }).setChildren([
            node.canvas('viewCanvas').setSize(2048, 2048)
        ]),
        node.div().setStyle({ position: 'absolute', right: '20px', bottom: '0px' }).setChildren([
            node.sliderH('', '100px', 57, 10, 150, r => {
                let result = (r.minVal + (r.currentVal - r.minVal) * r.ratio) / 100
                sceneViewContent.setStyle({ scale: result })
            })
        ])
    ])
    let sceneViewContent = sceneView.getChildById('sceneViewContent')
    let viewCanvas = sceneView.getChildById('viewCanvas')
    let vctx = viewCanvas.getContext2D()
    vctx.canvas.id = 'gaCanvas'
    vctx.canvas.style.verticalAlign = 'top'
    let img = new Image
    img.onload = () => {
        viewCanvas.setSize(img.naturalWidth, img.naturalHeight)
        vctx.drawImage(img, 0, 0, vctx.canvas.width, vctx.canvas.height)
    }
    img.src = node.getAssetsPath('samples/genart/vg-selfp.png')

    // layout settings
    let leftSide = node.div().setStyle({ display: 'flex' }).setChildren([
        sceneView,
        node.scroller('effectListScroller', '200px', '100%', '', '', 0, 0, 0, toolBar)
    ])

    let rightTop = node.div().setStyle({ display: 'flex', flexDirection: 'column' }).setChildren([
        node.div().setStyle({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#333', width: '100%', padding: '2px 5px' }).setChildren([
            node.div().setText('layer').setStyle({ fontSize: '13px' }),
            node.div().setText('render').setStyle({ fontSize: '13px', border: '1px solid yellowgreen', padding: '2px 5px', borderRadius: '4px', color: 'yellowgreen', cursor: 'pointer' }).on('click', render)
        ]),
        node.div('layer')
    ])
    let rightBottom = node.div().setStyle({ display: 'flex', flexDirection: 'column', fontSize: '13px' }).setChildren([
        node.div().setText('properties').setStyle({ background: '#333', width: '100%', padding: '2px 5px' }),
        node.div('properties')
    ])

    let rightSide = node.div().setChildren([
        node.splitterH('appRightSplitterH', '100%', 60,
            node.scroller('filtersScroller', '100%', '100%', '', '', 0, 0, 0, rightTop),
            rightBottom
        )
    ])

    let jsdom = node.div().setChildren([
        topbar,
        node.splitterV('appSplitterV', 'calc(100dvh - 30px)', 70, leftSide, rightSide)
    ])

    // layer
    let layer = jsdom.getChildById('layer')

    // properties
    let properties = jsdom.getChildById('properties')

    // event binding
    let effectListScroller = jsdom.getChildById('effectListScroller')
    let update = () => {
        effectListScroller.setStyle({ height: (sceneView.getHtmlTag().getBoundingClientRect().height) + 'px' })
        let cs = toolBar.getChildren()
        toolBar.setStyle({ height: cs[0].getHtmlTag().getBoundingClientRect().height * (cs.length + 4) + 'px' })
    }

    jsdom.onGlobalEvent(GlobalEvent.SYSTEM_JSDOM_READY, update)
    jsdom.onGlobalEvent(GlobalEvent.SYSTEM_RESIZE_WINDOW, update)

    let keys = {}
    window.onkeydown = e => {
        if (keys[e.key]) return
        keys[e.key] = true
    }

    window.onkeyup = e => {
        // console.log(e.key, keys)
        if ((keys['Meta'] && keys['1']) || (keys['Control'] && keys['1'])) render()
        else if ((keys['Meta'] && keys['2']) || (keys['Control'] && keys['2'])) openImage()
        else if ((keys['Meta'] && keys['3']) || (keys['Control'] && keys['3'])) saveImage()
        else if ((keys['Meta'] && keys['4']) || (keys['Control'] && keys['4'])) loadLayers()
        else if ((keys['Meta'] && keys['5']) || (keys['Control'] && keys['5'])) saveLayers()
        Object.keys(keys).forEach(k => keys[k] = false)
    }

    jsdom.onGlobalEvent(GlobalEvent.SYSTEM_LEAVE_ROUTER_VIEW, () => {
        window.onkeydown = null
        window.onkeyup = null
    })

    return jsdom
}