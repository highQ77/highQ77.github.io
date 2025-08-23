import { node } from "../../core/node.js"
import { pro } from "../../core/uipro.js"

export function uipro() {

    // for pager
    const vmPagerDataView = (item, idx) => {
        let icon = '🐷'
        if (idx == 0) icon = '🥇'
        if (idx == 1) icon = '🥈'
        if (idx == 2) icon = '🥉'
        return node.div().setText(icon + ' ' + item).setStyle({ padding: '5px', margin: '0px 0px 5px 0px', background: '#333', borderRadius: '5px', transition: 'background .2s' })
            .on('mouseenter', (e, t) => t.setStyle({ background: '#555' }))
            .on('mouseleave', (e, t) => t.setStyle({ background: '#333' }))
    }
    const vmPagerDatas = node.proxy(Array(60).fill(0).map((i, idx) => 'pager ' + idx.toString()))

    let runSchedule // dialogue system

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // page jsdom
    const jsdom = node.div().setStyle({ marginBottom: '50px' }).setChildren([
        node.h2().setText('UI Pro'),
        node.div().setText('透過 jsdom 完成高階元件設計')
            .setStyle({ margin: '20px 0', color: '#CCC', background: '#000', padding: '5px', border: '1px solid #666' }),
        node.hr().setStyle({ margin: '20px 0' }),

        // carousel
        node.h4().setText('👽 Carousel').setStyle({ color: 'rgb(187, 253, 111)' }),
        node.div().setChildren([
            pro.carousel('', [
                node.div().setStyle({ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px', width: '100%', height: '100%', background: '#111' }).setChildren([
                    node.div().setText('Design Your Own Page').setStyle({ fontFamily: 'Serif' })
                ]),
                node.div().setStyle({ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px', width: '100%', height: '100%', background: 'rgba(255, 255, 255, 0.12)' }).setChildren([
                    node.divimg('', 'swril.jpg').setText('Gen-Art').setStyle({ fontFamily: 'impact', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '200px', color: '#FFFFFF66', border: '5px solid #000' })
                ]),
                node.div().setStyle({ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px', width: '100%', height: '100%', background: '#eae6ccff' }).setChildren([
                    node.div().setText('chill.js').setStyle({ color: 'black', fontFamily: 'Serif', fontSize: '60px', borderBottom: '35px solid black', borderTop: '35px solid black' })
                ]),
            ])
        ]),
        node.hr().setStyle({ margin: '20px 0' }),

        // pager
        node.h4().setText('👽 Pager').setStyle({ color: 'rgb(187, 253, 111)' }),
        node.div().setChildren([
            pro.vm_pager('', vmPagerDataView, vmPagerDatas, 5)
        ]),
        node.hr().setStyle({ margin: '20px 0' }),

        // dialogue system
        node.h4().setText('👽 Dialogue System').setStyle({ color: 'rgb(187, 253, 111)' }),
        node.div().setChildren([
            node.div().setStyle({ marginBottom: '20px' }).setChildren([
                node.div().setText('text : time, color, string'),
                node.div().setText('delay : time'),
                node.div().setText('shake : time, pixel, times'),
            ]),
            node.fo_textarea('scheduleTextArea').setStyle({ width: '100%', height: '6em' }).setValue(`text: [100, yellow, 台灣]; delay: [100]; text: [200, white, 是一個美麗的地方。]; shake: [20, 10, 3]; text: [50, rgb(187, 253, 111), 這是 shake 的特效 ! ];`),
            node.button('runBtn').setText('Run').setStyle({ margin: '20px 0' }).on('click', (e, t) => {
                if (t.getDisabled() == true) return
                runSchedule(scheduleTextArea.getValue())
                t.setDisabled(true)
            }),
            pro.dialogue('dsys', r => runSchedule = r, _ => runBtn.setDisabled(false))
        ]),


    ])

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let scheduleTextArea = jsdom.getChildById('scheduleTextArea')
    let runBtn = jsdom.getChildById('runBtn')

    return jsdom
}
