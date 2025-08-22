import { GlobalEvent, zIndex } from "../../core/config.js";
import { node } from "../../core/node.js";
import { router } from "../../core/router.js";

export function anitool() {

    // settings
    let sceneWitdh = 1024
    let sceneHeight = 768
    let frameCount = 225
    let frameWidth = 10
    let layerCount = 6
    let layerHeight = 23

    // top bar dropdown menu
    const menuItem = (item) => {
        return node.div().setStyle({ color: '#333', padding: '5px 10px', width: '100%' }).setClass('anitool_menu_item').setText(item)
    }
    const menu_file = () => node.div().setStyle({ display: 'none', position: 'absolute', width: '200px', left: '-18px', top: '1em', zIndex: zIndex.popup, border: '10px solid transparent', boxSizing: 'content-box' }).setChildren([
        node.div().setStyle({ borderRadius: '6px', overflow: 'hidden', background: '#ffffff99', backdropFilter: 'blur(10px)' }).setChildren([
            menuItem('item').on('click', (_, t) => { t.getParent().getParent().setStyle({ display: 'none' }) }),
            menuItem('item').on('click', (_, t) => { t.getParent().getParent().setStyle({ display: 'none' }) }),
            menuItem('item').on('click', (_, t) => { t.getParent().getParent().setStyle({ display: 'none' }) }),
            node.hr(),
            menuItem('item').on('click', (_, t) => { t.getParent().getParent().setStyle({ display: 'none' }) }),
            menuItem('item').on('click', (_, t) => { t.getParent().getParent().setStyle({ display: 'none' }) }),
            menuItem('item').on('click', (_, t) => { t.getParent().getParent().setStyle({ display: 'none' }) }),
            node.hr(),
            menuItem('chill.js').on('click', (_, t) => { t.getParent().setStyle({ display: 'none' }) }),
        ])
    ]).on('mouseleave', (e, t) => { t.setStyle({ display: 'none' }) })

    // menu css setting
    node.appendClasses({
        '.anitool_topbar_menu_item:hover': { background: '#89898966', cursor: 'pointer' },
        '.anitool_menu_item:hover': { background: '#FFCC0066', cursor: 'pointer' }
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
            node.div().setText('⚡︎').setStyle({ margin: '0 10px', fontSize: '25px', color: 'orange' }),
            node.div().setStyle({ position: 'relative', cursor: 'pointer' }).setChildren([
                menu_file(),
                node.div().setText('Ani-Tool').setClass('anitool_topbar_menu_item').setStyle({ padding: '2px', borderRadius: '5px', minWidth: '50px', textAlign: 'center' }).on('click', navBarBtns).on('mouseenter', navBarBtns),
            ]),
            node.div().setStyle({ position: 'relative', cursor: 'pointer' }).setChildren([
                menu_file(),
                node.div().setText('File').setClass('anitool_topbar_menu_item').setStyle({ padding: '2px', borderRadius: '5px', minWidth: '50px', textAlign: 'center' }).on('click', navBarBtns).on('mouseenter', navBarBtns),
            ]),
            node.div().setStyle({ position: 'relative', cursor: 'pointer' }).setChildren([
                menu_file(),
                node.div().setText('Edit').setClass('anitool_topbar_menu_item').setStyle({ padding: '2px', borderRadius: '5px', minWidth: '50px', textAlign: 'center' }).on('click', navBarBtns).on('mouseenter', navBarBtns),
            ]),
            node.div().setStyle({ position: 'relative', cursor: 'pointer' }).setChildren([
                menu_file(),
                node.div().setText('Help').setClass('anitool_topbar_menu_item').setStyle({ padding: '2px', borderRadius: '5px', minWidth: '50px', textAlign: 'center' }).on('click', navBarBtns).on('mouseenter', navBarBtns),
            ]),
            node.div().setText('animation editor UI layout demo. powered by William77').setStyle({ margin: '0px 20px', fontSize: '12px', color: 'rgba(137, 137, 137, .7)' }),
        ]),
        node.button().setText('w77').on('click', () => {
            router.go('works')
        })
    ])

    // layer & timeline
    let layer = (id, h) => node.div('layer_' + id).setStyle({ display: 'flex', alignItems: 'center', width: '200px', height: h + 'px', background: '#333', borderBottom: '1px solid #444', paddingLeft: '10px', fontSize: '12px' }).setText('layer - ' + id)
    let timeline = (id, count, w) =>
        node.div('timeline_' + id).setStyle({ display: 'flex', width: count * w + 'px', background: '#555', height: layerHeight + 'px', borderBottom: '1px solid #444', background: '#999' }).setChildren(
            Array(count).fill(0).map((i, idx) => {
                let jsdom = node.div().setStyle({ display: 'flex', justifyContent: 'center', alignItems: 'end', padding: '2px 0', minWidth: w + 'px', border: '0px', borderRight: idx == 0 ? '1px solid #222' : '1px solid #00000011' }).setChildren([
                    idx == 0 ? node.div().setStyle({ border: '1px solid black', width: '5px', height: '5px', borderRadius: '100%' }) : node.div()
                ])
                idx % 5 == 0 && jsdom.setStyle({ background: '#888' })
                return jsdom
            })
        )

    let layerGroup = node.div().setStyle({ width: '200px' })
    let timelineGroup = node.div()

    for (let i = 0; i < layerCount; i++) {
        layerGroup.unshiftChild(layer(i + 1, layerHeight))
        timelineGroup.unshiftChild(timeline(i, frameCount, frameWidth))
    }

    // time line frame number
    let rule = (id, count, w) => {
        return node.div('rule_timeline_' + id).setStyle({ display: 'flex', width: count * w + 'px', height: layerHeight + 'px', borderBottom: '1px solid #444', background: '#222' }).setChildren(
            Array(count).fill(0).map((i, idx) => {
                let jsdom = node.div().setStyle({ display: 'flex', justifyContent: 'center', alignItems: 'end', padding: '2px 0', minWidth: w + 'px', border: '0px', borderRight: idx == 0 ? '1px solid #222' : '1px solid #00000011' })
                idx % 5 == 0 && jsdom.setStyle({ fontSize: '12px' }).setText(idx + '')
                return jsdom
            })
        )
    }
    layerCount++
    layerGroup.unshiftChild(node.div().setStyle({ width: '200px', height: layerHeight + 'px' }))
    timelineGroup.unshiftChild(rule(layerCount, frameCount, frameWidth))

    // timeline editor
    let timelineEditor = node.div('timelineEditor').setStyle({ display: 'flex' }).setChildren([
        layerGroup,
        node.scroller('timelineFramesScroller', '100%', layerCount * layerHeight + 'px', '', '', '0px', '0px', 1, timelineGroup)]
    )

    // left side toolbar
    let toolBar = node.div().setStyle({ width: '34px', height: '100%', background: '#333', borderRight: '2px solid #111' }).setChildren([
        node.button().setText('✂︎').setStyle({ minWidth: '29px', marginBottom: '6px', marginTop: '3px' }),
        node.button().setText('✐').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('☇').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('❖').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('✐').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('☇').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('❖').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('✐').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('☇').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('❖').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('✐').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('☇').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('❖').setStyle({ minWidth: '29px', marginBottom: '6px' }),
    ])

    // main scene view
    let sceneView = node.div().setStyle({ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', overflow: 'hidden' }).setChildren([
        node.div('sceneViewContent').setStyle({ position: 'relative', minWidth: sceneWitdh + 'px', minHeight: sceneHeight + 'px', background: '#999' }).setChildren([
            node.div().setStyle({ position: 'absolute', top: '-1.1em', left: '0', fontSize: '14px' }).setText(`${sceneWitdh} x ${sceneHeight}`),
        ]),
        node.div().setStyle({ position: 'absolute', right: '20px', bottom: '0px' }).setChildren([
            node.sliderH('', '100px', 100, 30, 150, r => {
                let result = (r.minVal + (r.currentVal - r.minVal) * r.ratio) / 100
                sceneViewContent.setStyle({ scale: result })
            })
        ])
    ])
    let sceneViewContent = sceneView.getChildById('sceneViewContent')

    // layout settings
    let leftSide = node.div().setStyle({ display: 'flex' }).setChildren([
        toolBar,
        node.splitterH('appSplitterH', '100%', 21.5, timelineEditor, sceneView).setStyle({ width: 'calc(100% - 34px)' })
    ])

    let rightTop = node.div().setText('scene tree').setStyle({ display: 'flex' })
    let rightBottom = node.div().setStyle({ display: 'flex' })
    let rightBottomTools = node.div().setStyle({ width: '34px', height: '100%', background: '#333', borderRight: '2px solid #111' }).setChildren([
        node.button().setText('✂︎').setStyle({ minWidth: '29px', marginBottom: '6px', marginTop: '3px' }),
        node.button().setText('✐').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('☇').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('❖').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('✐').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('☇').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('❖').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('✐').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('☇').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('❖').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('✐').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('☇').setStyle({ minWidth: '29px', marginBottom: '6px' }),
        node.button().setText('❖').setStyle({ minWidth: '29px', marginBottom: '6px' }),
    ])
    rightBottom.setChildren([
        rightBottomTools,
        node.div().setText('tool panel').setStyle({ padding: '10px' })
    ])

    let rightSide = node.div().setChildren([
        node.splitterH('appRightSplitterH', '100%', 40, rightTop, rightBottom)
    ])

    let jsdom = node.div().setChildren([
        topbar,
        node.splitterV('appSplitterV', 'calc(100dvh - 30px)', 80, leftSide, rightSide)
    ])

    // event binding
    let timelineFramesScroller = jsdom.getChildById('timelineFramesScroller')
    let update = () => {
        timelineFramesScroller.setStyle({ width: (timelineEditor.getHtmlTag().getBoundingClientRect().width - 200) + 'px' })
        timelineGroup.setStyle({ width: frameCount * frameWidth + 'px' })
    }

    jsdom.onGlobalEvent(GlobalEvent.SYSTEM_JSDOM_READY, update)
    jsdom.onGlobalEvent(GlobalEvent.SYSTEM_RESIZE_WINDOW, update)

    return jsdom
}