import { GlobalEvent } from "../../core/config.js"
import { node } from "../../core/node.js"
import { router } from "../../core/router.js"
import { store } from "../../core/store.js"

export function demo() {

    // jsdom
    const jsdom = node.div().setStyle({ paddingTop: '50px' }).setChildren([
        router.group('demoRouterView', [
            node.button('mvvm', 'chill/demo/mvvm').setText('mvvm'),
            node.button('ui', 'chill/demo/ui').setText('ui'),
            node.button('uipro', 'chill/demo/uipro').setText('ui-pro'),
            node.button('store', 'chill/demo/misc').setText('misc'),
        ], 'demoRouter').setStyle({ margin: '20px 20px 0px 20px' }),
        node.div('demoRouterView').setStyle({ padding: '20px' })
    ])

    // from misc page node.pubsub.publish(GlobalEvent.CUSTOM_CHANGE_NAV_BORDER_COLOR, xxData)
    let navBorderBottom = store.get$().chill.demo.navbar.borderBottom
    let demoRouter = jsdom.getChildById('demoRouter')
    demoRouter.setStyle({ paddingBottom: '10px', borderBottom: navBorderBottom[0] })
    jsdom.onGlobalEvent(GlobalEvent.CUSTOM_CHANGE_NAV_BORDER_COLOR, result => {
        navBorderBottom[0] = `1px solid rgb(${result.r},${result.g},${result.b})`
        demoRouter.setStyle({ borderBottom: navBorderBottom[0] })
    })

    return jsdom
}