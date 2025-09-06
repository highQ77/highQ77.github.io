import { node } from "../../../core/node.js";
import { router } from "../../../core/router.js";
import { store } from "../../../core/store.js";

export function probeat_result() {

    let score = store.get$().samples.probeat.score

    let jsdom = node.divimg('', './samples/probeat/swril.jpg').setStyle({ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100dvh', filter: 'grayscale(1)', boxShadow: 'inset 0 0 100px black' }).setChildren([
        node.div().setStyle({ fontSize: '50px', fontFamily: 'impact' }).setChildren([
            node.div().setText('PRO BEAT SCORE'),
            node.div().setStyle({ display: 'flex' }).setChildren([
                node.div().setText('BEST - ').setStyle({ width: '200px' }),
                node.div().setText(score.best[0]),
            ]),
            node.div().setStyle({ display: 'flex' }).setChildren([
                node.div().setText('GREAT - ').setStyle({ width: '200px' }),
                node.div().setText(score.great[0]),
            ]),
            node.div().setStyle({ display: 'flex' }).setChildren([
                node.div().setText('GOOD - ').setStyle({ width: '200px' }),
                node.div().setText(score.good[0]),
            ]),
            node.div().setStyle({ display: 'flex' }).setChildren([
                node.div().setText('BAD - ').setStyle({ width: '200px' }),
                node.div().setText(score.bad[0]),
            ]),
            node.div().setStyle({ display: 'flex' }).setChildren([
                node.div().setText('MISS - ').setStyle({ width: '200px' }),
                node.div().setText(score.miss[0]),
            ]),
            node.button().setStyle({ fontSize: '24px' }).setText('Back To Works').on('click', () => {
                router.go('works', null, true)
                score.best[0] = 0
                score.great[0] = 0
                score.good[0] = 0
                score.bad[0] = 0
                score.miss[0] = 0
            }),
        ]),
    ])

    return jsdom
}