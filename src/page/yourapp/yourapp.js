import { node } from "../../core/node.js"
import { router } from "../../core/router.js"

export function yourapp() {
    let jsdom = node.div().setClass('ani-bg-dark').setStyle({ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }).setChildren([
        node.div().setChildren([
            node.div().setText('Powered by william77').setStyle({ color: '#666' }),
            node.div().setStyle({ fontSize: '70px', marginBottom: '20px', fontFamily: 'impact' }).setText('Time to Design Your App'),
            node.hr().setStyle({ margin: '20px 0' }),
            node.button().setText('Go to Chill.js Official Site to Learn').on('click', () => {
                router.go('chill', node.sceneTransition(
                    node.div().setText('Chill.js v0.3').setStyle({ fontFamily: 'impact', color: 'white', fontSize: '35px' })
                ))
            }),
            node.div().setText('To start your project, edit this page in src/page/yourapp/empty.js').setStyle({ margin: '20px 0', color: 'rgb(187, 253, 111)' }),
        ])
    ])
    return jsdom
}
