import { node } from "../../core/node.js"
import { store } from "../../core/store.js"

export function home() {

    // rwd settings
    let featureRwdClass = 'rwd-xs:width[100%] rwd-lg:width[50%] rwd-xl:width[33.33%]'
    let featureRwdItemsClass = 'rwd-xs:borderBottom[2px solid #85589cff] rwd-sm:borderBottom[2px solid #627faeff] rwd-md:borderBottom[2px solid #3e8657ff] rwd-lg:borderBottom[2px solid #b7ad41ff]  rwd-xl:borderBottom[2px solid #af6923ff] rwd-xxl:borderBottom[2px solid red]'

    // vm settings
    const featuresData = node.proxy(store.get().chill.home.featureList)
    const featuresView = (item) => node.div().setClass(featureRwdClass + ' stop-select').setStyle({ display: 'inline-flex', padding: '10px' }).setChildren([
        node.div().setClass(featureRwdItemsClass).setStyle({ display: 'block', background: '#00000099', width: '100%', minHeight: '3em', padding: '10px', borderRadius: '8px', backdropFilter: 'blur(2px)' }).setChildren([
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
                node.div().setText(item.desc).setStyle({ display: item.desc ? 'block' : 'none', fontSize: '14px', color: '#ae9fcbff' })
            ])
        ]),
    ])

    // jsdom
    const jsdom = node.div().setChildren([
        node.div().setStyle({ position: 'absolute', transform: 'translate(-50%, -50%) rotate(45deg)', left: 'calc(100vw / 2)', top: 'calc(100dvh / 2)', width: '200px', height: '200px', border: '20px solid #FFFFFF33' }),
        node.div().setStyle({ position: 'absolute', transform: 'translate(-50%, -50%) rotate(45deg)', left: 'calc(100vw / 2)', top: 'calc(100dvh / 2)', width: '300px', height: '300px', border: '1px solid #FFFFFF33' }),
        node.div().setStyle({ width: '100%', padding: '80px 0', minHeight: '100dvh' }).setChildren([
            node.h1().setText('Are you Chill today？').setStyle({ fontFamily: 'Arial', marginLeft: '10px' }),
            node.span().setText('▶︎ An Easy SPA Development Framework').setStyle({ marginLeft: '10px' }),
            node.div().setStyle({ padding: '10px', textAlign: 'right' }).setChildren([
                node.button('', '',
                    { background: '#e07715ff', transition: 'all 1s', border: '1px solid #666' },
                    { background: 'orange', outline: '2048px solid #00000099' },
                    { background: '#e07715ff', outline: '0px solid transparent', border: '1px solid #666' })
                    .setText('toggle all').on('click', () => {
                        fList.getChildren().forEach(c => c.getChildById('toggle').dispatch('click'))
                    }),
            ]),
            node.vm_list('fList', featuresView, featuresData).setStyle({ marginTop: '20px' }),
        ])
    ]).setClass('ani-bg-default').setStyle({ padding: '10px' })

    const fList = jsdom.getChildById('fList')

    return jsdom
}