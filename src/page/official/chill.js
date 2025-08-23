import { theme } from "../../core/config.js";
import { node } from "../../core/node.js";
import { router } from "../../core/router.js";
import { cButton, cRouterButton } from "./components/cButton.js";

export function chill() {

    // theme css modify 
    theme.button.active.color = 'white'
    theme.button.unactive.color = '#666'

    const jsdom = node.div().setChildren([
        node.div('nav').setStyle({ position: 'fixed', top: '0px', left: '0px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px', background: '#00000033', backdropFilter: 'blur(10px)' }).setChildren([
            node.div().setChildren([
                node.span().setText('Chill.js').setStyle({ fontSize: '30px', fontFamily: 'impact' }),
                node.span().setText(' v0.3')
            ]),
            node.div().setChildren([
                node.div().setStyle({ display: 'flex' }).setChildren([
                    cButton().setText('w77').setStyle({ marginRight: '10px' }).on('click', () => {
                        router.go('works')
                    }),
                    cButton().setText('Start YourApp').setStyle({ marginRight: '50px' }).on('click', () => {
                        router.go('yourapp')
                    }),
                    router.group('chillRouterView', [
                        cRouterButton('home', 'chill/home').setText('home'),
                        cRouterButton('demo', 'chill/demo').setText('demo'),
                    ]),
                ])
            ])
        ]),
        node.div('chillRouterView')
    ])

    return jsdom
}