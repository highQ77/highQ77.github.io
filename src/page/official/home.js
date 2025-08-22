import { node } from "../../core/node.js"
import { store } from "../../core/store.js"

export function home() {

    // rwd settings
    let featureRwdClass = 'rwd-xs:width[100%] rwd-lg:width[50%] rwd-xl:width[33.33%]'
    let featureRwdItemsClass = 'rwd-xs:borderBottom[3px solid #85589cff] rwd-sm:borderBottom[3px solid #627faeff] rwd-md:borderBottom[3px solid #3e8657ff] rwd-lg:borderBottom[3px solid #b7ad41ff]  rwd-xl:borderBottom[3px solid #af6923ff] rwd-xxl:borderBottom[3px solid red]'

    // vm settings
    const featuresData = node.proxy(store.get().chill.home.featureList)
    const featuresView = (item) => node.div().setClass(featureRwdClass + ' stop-select').setStyle({ display: 'inline-flex', padding: '10px' }).setChildren([
        node.div().setClass(featureRwdItemsClass).setStyle({ display: 'block', background: '#00000099', width: '100%', minHeight: '3em', padding: '10px', borderRadius: '10px', backdropFilter: 'blur(5px)' }).setChildren([
            node.div('toggle').setStyle({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }).setChildren([
                node.div().setStyle({ display: 'flex', alignItems: 'center' }).setChildren([
                    node.div().setText('⚡︎').setStyle({ color: 'orange', marginRight: '10px', fontSize: '20px' }),
                    node.div().setText(item.title),
                ]),
                node.div('toggleSymbol').setText(item.desc ? '+' : '').setStyle({ color: 'orange', fontSize: '20px' }),
            ]).on('click', (e, t) => {
                if (item.desc) {
                    let toggle = t.getParent().getChildById('infoToggle')
                    let symb = t.getParent().getChildById('toggleSymbol')
                    if (toggle.getStyle().display == 'none') {
                        toggle.setStyle({ display: 'block' })
                        symb.setText('-')
                    } else {
                        toggle.setStyle({ display: 'none' })
                        symb.setText('+')
                    }
                }
            }),
            node.div('infoToggle').setStyle({ display: 'none' }).setChildren([
                node.hr().setStyle({ display: item.desc ? 'block' : 'none', borderColor: '#FFFFFF33', margin: '10px 0px' }),
                node.div().setText(item.desc).setStyle({ display: item.desc ? 'block' : 'none', fontSize: '14px', color: '#cbb99fff' })
            ])
        ]),
    ])

    // jsdom
    const jsdom = node.div().setStyle({ width: '100%', padding: '80px 0', minHeight: '100dvh' }).setChildren([
        node.h1().setText('🥷 您今天 Chill 了嗎？').setStyle({ fontFamily: 'Arial', marginLeft: '10px' }),
        node.span().setText('easy jsdom SPA development framework').setStyle({ color: '#333', marginLeft: '10px' }),
        node.div().setStyle({ padding: '10px', textAlign: 'right' }).setChildren([
            node.button('', '', { background: '#e07715ff', transition: 'all 1s', border: '1px solid #666' }, { background: 'orange', outline: '2048px solid #00000099' }, { background: '#e07715ff', outline: '0px solid transparent', border: '1px solid #666' }).setText('toggle all').on('click', () => {
                fList.getChildren().forEach(c => c.getChildById('toggle').dispatch('click'))
            }),
        ]),
        node.vm_list('fList', featuresView, featuresData).setStyle({ marginTop: '20px' }),
    ]).setClass('ani-bg-default')

    const fList = jsdom.getChildById('fList')

    return jsdom
}