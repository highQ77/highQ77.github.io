import { node } from "../../../core/node.js"

export function ui() {

    // for node.vm_select
    const vmSelectItemTemplate = (item, idx) => {
        let icon = '🐷'
        if (idx == 0) icon = '🥇'
        if (idx == 1) icon = '🥈'
        if (idx == 2) icon = '🥉'
        return node.div().setStyle({ borderTop: '1px solid #ffffff3c', padding: '5px', background: '#00000066', backdropFilter: 'blur(50px)' })
            .setText(icon + ' ' + item)
    }
    const vmSelectItemDatas = node.proxy(['好好', '好棒', '好累', '好神', '好運', '好開心', '好朋友', '好神奇', ...Array(10).fill(0).map((i, idx) => idx.toString())])

    // for splitter style
    const splitterStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', borderRadius: '3px', background: '#333', overflow: 'hidden' }

    // for radio group
    const vmRadioGroupDatas = node.proxy(['A 好好', 'B 好棒', 'C 好累', 'D 好神', 'E 好運', 'F 好開心', 'G 好朋友', 'H 好神奇'])

    // for checkbox group
    const vmCheckboxGroupDatas = node.proxy(['A 好好', 'B 好棒', 'C 好累', 'D 好神', 'E 好運', 'F 好開心', 'G 好朋友', 'H 好神奇'])


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // page jsdom
    const jsdom = node.div().setStyle({ marginBottom: '50px' }).setChildren([
        node.h2().setText('Essential UI'),
        node.div().setText('透過 jsdom 彈指間生成任意 UI 元件，本框架開發複雜的介面相對輕鬆，且方便重複利用與分享給他人')
            .setStyle({ margin: '20px 0', color: '#CCC', background: '#000', padding: '5px', border: '1px solid #666' }),
        node.hr().setStyle({ margin: '20px 0' }),

        // dialog
        node.h4().setText('👽 Dialog').setStyle({ color: 'rgb(187, 253, 111)' }),
        node.div().setChildren([
            node.button().setText('Alert').on('click', _ => node.alert('這是警告視窗 This is an alert dialog!', r => console.log(r))),
            node.button().setText('Confirm').on('click', _ => node.confirm('這是確認視窗 This is a confirm dialog!', r => console.log(r))),
            node.button().setText('Date Picker').on('click', (e, t) => node.date(r => r && t.setText(r))),
            node.button().setText('Time Picker').on('click', (e, t) => node.time(r => r && t.setText(r))),
            node.button().setText('Color Picker').on('click', (e, t) => node.color(c => c && t.setStyle({ background: `rgb(${c.r},${c.g},${c.b})` }))),
            node.file('', 'File Picker', 2, r => textarea.setValue(r.content))
        ]),
        node.hr().setStyle({ margin: '20px 0' }),

        // form
        node.h4().setText('👽 Form').setStyle({ color: 'rgb(187, 253, 111)' }),
        node.div().setChildren([
            node.fo_text(),
            node.hr().setStyle({ margin: '20px 0' }),
            node.fo_textarea('form_textarea'),
            node.hr().setStyle({ margin: '20px 0' }),
            node.toggle('', false, r => { }),
            node.hr().setStyle({ margin: '20px 0' }),
            node.fo_radio_group('', vmRadioGroupDatas, r => console.log(r)),
            node.hr().setStyle({ margin: '20px 0' }),
            node.fo_checkbox_group('', vmCheckboxGroupDatas, r => console.log(r)),
            node.hr().setStyle({ margin: '20px 0' }),
            node.vm_select('', 'menu 01', vmSelectItemTemplate, vmSelectItemDatas, '250px', r => console.log(r)),
        ]),
        node.hr().setStyle({ margin: '20px 0' }),

        // div img
        node.h4().setText('👽 Div-Image').setStyle({ color: 'rgb(187, 253, 111)' }),
        node.div().setStyle({ display: 'flex', alignItems: 'center' }).setChildren([
            node.divimg('', 'official/chill/sample2.png').setStyle({ border: '3px solid #333' })
        ]),
        node.hr().setStyle({ margin: '20px 0' }),

        // scroller
        node.h4().setText('👽 Scroller').setStyle({ color: 'rgb(187, 253, 111)' }),
        node.div().setChildren([
            node.scroller('', '200px', '200px', '', '', '-9px', '1px', 0, node.img().setSrc('official/chill/sample.png').setStyle({ width: '300px', height: '300px', filter: 'grayscale(1)' })).setStyle({ marginRight: '15px' }),
            node.scroller('', '200px', '200px', '', '', '-9px', '1px', 1, node.img().setSrc('official/chill/sample.png').setStyle({ width: '300px', height: '300px', filter: 'grayscale(1)' })).setStyle({ marginRight: '15px' }),
            node.scroller('', '200px', '200px', '', '', '-9px', '1px', 2, node.img().setSrc('official/chill/sample.png').setStyle({ width: '300px', height: '300px', filter: 'grayscale(1)' })).setStyle({ marginRight: '15px' }),
            node.scroller('', '200px', '200px', 'rgb(187, 253, 111)', '#333', '-9px', '1px', 2, node.img().setSrc('official/chill/sample.png').setStyle({ width: '300px', height: '300px', filter: 'grayscale(1)' }))
        ]),
        node.hr().setStyle({ margin: '20px 0' }),

        // slider
        node.h4().setText('👽 Slider').setStyle({ color: 'rgb(187, 253, 111)' }),
        node.div().setStyle({ display: 'flex', alignItems: 'center' }).setChildren([
            node.sliderV('', '100px', 0, 0, 100, r => console.log(r)).setStyle({ margin: '20px 30px' }),
            node.sliderV('', '100px', 20, 20, 200, r => console.log(r)).setStyle({ margin: '20px 30px' }),
            node.sliderH('', '150px', 0, 0, 100, r => console.log(r)).setStyle({ margin: '20px 30px' }),
            node.sliderH('', '150px', 20, 20, 200, r => console.log(r)).setStyle({ margin: '20px 30px' }),
        ]),
        node.hr().setStyle({ margin: '20px 0' }),

        // splitter
        node.h4().setText('👽 Splitter').setStyle({ color: 'rgb(187, 253, 111)' }),
        node.div().setStyle({ background: '#111', padding: '5px', borderRadius: '10px', color: '#999' }).setChildren([
            node.splitterV('', '200px', 60,
                node.scroller('', '100%', '100%', '', '', '0px', '1px', 0, node.div('leftSideContent')).setStyle(splitterStyle),
                node.splitterH('', '100%', 30,
                    node.div().setStyle(splitterStyle).setChildren([
                        node.span().setText('RightTop Side')
                    ]),
                    node.div().setStyle(splitterStyle).setChildren([
                        node.span().setText('RightBottom Side')
                    ]),
                )
            )
        ]),

    ])

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    jsdom.getChildById('leftSideContent').setChildren([
        node.div()
            .setStyle({ padding: '10px' })
            .setText(Array(100).fill(0).map(i => 'this is a cool splitter with scrollbar. ').join(''))
    ])

    let textarea = jsdom.getChildById('form_textarea')

    return jsdom
}
