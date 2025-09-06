import { node } from "../../../core/node.js";
import { router } from "../../../core/router.js";
import { store } from "../../../core/store.js";

export function probeat_home() {

    let isAutoPlay = store.get$().samples.probeat.isAutoPlay

    let jsdom = node.div().setStyle({ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100dvh', filter: 'grayscale(.3)', boxShadow: 'inset 0 0 100px black' }).setChildren([
        node.div().setChildren([
            node.div().setText('PRO BEAT').setStyle({ fontSize: '100px', fontFamily: 'impact' }),
            node.button().setText('Play Mode').on('click', () => {
                isAutoPlay[0] = false
                router.go('probeat_game', node.sceneTransition(
                    node.div().setText('Pro Beat').setStyle({ fontFamily: 'impact', color: 'white', fontSize: '35px' })
                ), true)
            }),
            node.button().setText('Auto Mode').on('click', () => {
                isAutoPlay[0] = true
                router.go('probeat_game', node.sceneTransition(
                    node.div().setText('Pro Beat').setStyle({ fontFamily: 'impact', color: 'white', fontSize: '35px' })
                ), true)
            })
        ])
    ])

    return jsdom
}