import { font } from "../../../core/font.js"
import { node } from "../../../core/node.js"
import { router } from "../../../core/router.js"

export function genart() {
    let jsdom = node.div().setStyle({ display: 'flex', justifyContent: 'end', alignItems: 'center', height: '100vh' }).setChildren([
        node.div().setStyle({ margin: '50px' }).setChildren([
            node.div().setText('Gen Artist').setStyle({ color: '#999', fontSize: '50px', fontFamily: font.family.TIMES }),
            node.div().setText('Generative Art Software').setStyle({ color: '#666' }),
            node.div().setText('powered by william77').setStyle({ color: '#666' }),
            node.button().setText('ENTER').setStyle({ marginTop: '20px' }).on('click', () => {
                router.go('genart_editor')
            })
        ]),
        node.divimg('', 'samples/genart/magic-coral-reef-07.png').setStyle({ width: '70%', height: '100dvh', borderLeft: '5px solid #44423bff' })
    ])
    return jsdom
}