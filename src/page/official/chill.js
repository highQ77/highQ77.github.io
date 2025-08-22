import { node } from "../../core/node.js";
import { router } from "../../core/router.js";

export function chill() {

    const contentDOM = node.div().setChildren([
        node.div('nav').setStyle({ display: 'flex', cursor: 'pointer', justifyContent: 'space-between', alignItems: 'center', background: '#111' }).setChildren([
            node.div('logo').setStyle({ padding: '5px' }).setChildren([
                node.span('logo_text').setText('Chill.js').setStyle({ fontSize: '2em', fontFamily: 'Serif' }),
                node.span('logo_version').setText('v0.2').setStyle({ marginLeft: '5px', color: 'rgb(187, 253, 111)' })
            ]).on('click', () => router.go('chill/home')),
            node.div().setStyle({ display: 'flex' }).setChildren([
                node.button().setText('w77').setStyle({ marginRight: '10px' }).on('click', () => {
                    router.go('works')
                }),
                node.button().setText('BackToYourApp').setStyle({ marginRight: '50px' }).on('click', () => {
                    router.go('empty')
                }),
                router.group('chillRouterView', [
                    node.button('home', 'chill/home').setText('home'),
                    node.button('demo', 'chill/demo').setText('demo'),
                ]),
            ])
        ]),
        node.hr(),
        node.scroller('', '100dvw', 'calc(100dvh - 78px)', '#333', '#999', '0px', '1px', 0,
            node.div('chillRouterView')
        ).setClass('ani-bg-dark')
    ])

    const footerDOM = node.h5().setText('powered by William77 ' + (new Date).getFullYear())
        .setStyle({ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#111', margin: '0px' })

    let jsdom = node.div().setChildren([
        contentDOM.setStyle({ minHeight: 'calc(100dvh - 30px)' }),
        footerDOM.setStyle({ height: '30px' })
    ])

    return jsdom

}